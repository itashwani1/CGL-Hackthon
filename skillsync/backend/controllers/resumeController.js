const User = require('../models/User');
const Role = require('../models/Role'); // Import Role model for skills
const fs = require('fs');
const pdf = require('pdf-parse');

// Skill normalization map
const skillAliases = {
    'reactjs': 'React',
    'react.js': 'React',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'expressjs': 'Express',
    'express.js': 'Express',
    'vuejs': 'Vue.js',
    'vue.js': 'Vue.js',
    'angularjs': 'Angular',
    'aws': 'AWS',
    'amazon web services': 'AWS',
    'mongo': 'MongoDB',
    'mongodb': 'MongoDB',
    'dotnet': '.NET',
    '.net': '.NET',
    'c#': 'C#',
    'csharp': 'C#',
    'cpp': 'C++',
    'c++': 'C++',
    'sql server': 'SQL',
    'mssql': 'SQL',
    'ts': 'TypeScript'
};

const normalizeSkill = (skill) => {
    const lower = skill.toLowerCase().trim();
    return skillAliases[lower] || skill; // Return mapped alias or original (normalized case handled later)
};

const extractTextFromResume = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        // Basic check for scanned PDF (if text length is very low but pages > 0)
        if (data.numpages > 0 && data.text.trim().length < 50) {
            throw new Error('SCANNED_PDF_DETECTED');
        }
        return data.text;
    } catch (error) {
        if (error.message === 'SCANNED_PDF_DETECTED') throw error;
        throw new Error('PDF_PARSE_FAILED');
    }
};

const analyzeResumeText = async (text, careerGoal) => {
    const normalizedText = text.toLowerCase();

    // Default skills if no role found
    let requiredSkills = [];
    let roleTitle = careerGoal || 'General';

    if (careerGoal) {
        try {
            // Try to find the Role in DB to get required skills
            const role = await Role.findOne({ name: { $regex: new RegExp(`^${careerGoal}$`, 'i') } });
            if (role && role.requiredSkills && role.requiredSkills.length > 0) {
                requiredSkills = role.requiredSkills.map(s => ({ name: s.skill, weight: s.weight || 1 }));
            }
        } catch (err) {
            console.error('Error fetching role for analysis:', err);
        }
    }

    // Fallback if no specific role skills found
    if (requiredSkills.length === 0) {
        // Generic modern tech skills as fallback
        const fallbacks = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'JavaScript', 'HTML/CSS', 'Git', 'Project Management'];
        requiredSkills = fallbacks.map(s => ({ name: s, weight: 1 }));
        roleTitle = 'General Tech Professional';
    }

    // Identify found skills
    const foundSkills = [];
    const missingSkills = [];
    let matchScore = 0;
    let totalWeight = 0;

    requiredSkills.forEach(reqSkill => {
        const skillName = reqSkill.name;
        // Check for skill or its alias in text
        // Use word boundary to avoid partial matches (e.g. 'Java' in 'Javascript')
        // Special case for C++ and C# which have symbols
        const escapedSkill = skillName.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // Escape regex special chars
        const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');

        // Handle aliases too for better matching
        const aliasMatch = Object.keys(skillAliases).find(key => skillAliases[key].toLowerCase() === skillName.toLowerCase() && normalizedText.includes(key));

        if (regex.test(text) || aliasMatch) {
            foundSkills.push(skillName);
            matchScore += (reqSkill.weight || 1);
        } else {
            missingSkills.push(skillName);
        }
        totalWeight += (reqSkill.weight || 1);
    });

    // Calculate percent
    const percentMatch = totalWeight > 0 ? Math.round((matchScore / totalWeight) * 100) : 0;

    // Generate Suggestions based on missing skills context
    const suggestions = missingSkills.slice(0, 3).map(skill =>
        `Consider learning or adding ${skill} to better align with the ${roleTitle} role.`
    );

    // Structure/Length analysis
    if (text.length < 500) suggestions.push('Resume is quite short. Add more detail about your projects/experience.');
    if (!/@/.test(text)) suggestions.push('Ensure your contact email is clearly visible.');
    if (!/github|linkedin/i.test(text) && ['developer', 'engineer', 'softare'].some(k => roleTitle.toLowerCase().includes(k))) {
        suggestions.push('Add links to your GitHub or LinkedIn profile.');
    }

    // Resume Score (Weighted combination of match % and basic checks)
    let resumeScore = percentMatch;
    if (text.length > 1000) resumeScore += 5;
    if (foundSkills.length > 3) resumeScore += 5;
    if (resumeScore > 100) resumeScore = 100;

    return {
        score: resumeScore,
        matchPercentage: percentMatch,
        skills: foundSkills, // Skills present
        missingSkills: missingSkills, // Skills needed
        analysis: {
            strengths: [`Matched ${foundSkills.length} key skills for ${roleTitle}.`, ...(percentMatch > 70 ? ['Strong alignment with target role!'] : [])],
            weaknesses: missingSkills.length > 0 ? [`Missing ${missingSkills.length} critical skills.`] : [],
            improvementTips: suggestions
        }
    };
};

exports.uploadResume = async (req, res) => {
    console.log('Resume upload endpoint hit');

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    try {
        // 1. Extract Text
        let resumeText;
        try {
            resumeText = await extractTextFromResume(req.file.path);
        } catch (e) {
            if (e.message === 'SCANNED_PDF_DETECTED') {
                return res.status(400).json({
                    success: false,
                    message: 'Scanned PDF detected. OCR is not yet configured on this server. Please upload a text-based PDF.'
                });
            }
            throw e;
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // 2. Analyze
        console.log(`Analyzing resume for ${user.email} -> Goal: ${user.careerGoal}`);
        const result = await analyzeResumeText(resumeText, user.careerGoal);

        // 3. Update User
        user.resumeUrl = `/uploads/${req.file.filename}`;
        user.resumeScore = result.score;
        user.resumeSkills = result.skills;
        user.resumeAnalysis = result.analysis;

        // Store detailed match info if schema allows (for now using existing analysis field)
        // We could add `missingSkills` to schema if needed, but fitting it into existing structure for now.

        await user.save();

        // 4. Return Structured Response
        res.json({
            success: true,
            data: {
                resumeUrl: user.resumeUrl,
                resumeScore: user.resumeScore,
                resumeSkills: user.resumeSkills,
                resumeAnalysis: user.resumeAnalysis,
                matchDetails: {
                    matchPercentage: result.matchPercentage,
                    missingSkills: result.missingSkills
                }
            }
        });

    } catch (error) {
        console.error('Error processing resume:', error);
        res.status(500).json({ success: false, message: 'Error processing resume: ' + error.message });
    }
};

exports.getAnalysis = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            data: {
                resumeUrl: user.resumeUrl,
                resumeScore: user.resumeScore,
                resumeSkills: user.resumeSkills,
                resumeAnalysis: user.resumeAnalysis
            }
        });
    } catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({ success: false, message: 'Error fetching analysis' });
    }
};
