const CompanyJob = require('../models/CompanyJob');
const User = require('../models/User');

// @desc   Create a job posting
// @route  POST /api/company/jobs
const createJob = async (req, res, next) => {
    try {
        const { jobTitle, description, requiredSkills, openings, deadline } = req.body;
        if (!jobTitle || !requiredSkills || requiredSkills.length === 0) {
            return res.status(400).json({ success: false, message: 'Job title and required skills are mandatory' });
        }
        const job = await CompanyJob.create({
            postedBy: req.user.id,
            jobTitle, description, requiredSkills,
            openings: openings || 1,
            deadline: deadline || null,
        });
        res.status(201).json({ success: true, job });
    } catch (error) { next(error); }
};

// @desc   Get all jobs by this company
// @route  GET /api/company/jobs
const getMyJobs = async (req, res, next) => {
    try {
        const jobs = await CompanyJob.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, jobs });
    } catch (error) { next(error); }
};

// @desc   Update a job posting
// @route  PUT /api/company/jobs/:id
const updateJob = async (req, res, next) => {
    try {
        const job = await CompanyJob.findOne({ _id: req.params.id, postedBy: req.user.id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        Object.assign(job, req.body);
        await job.save();
        res.json({ success: true, job });
    } catch (error) { next(error); }
};

// @desc   Delete a job posting
// @route  DELETE /api/company/jobs/:id
const deleteJob = async (req, res, next) => {
    try {
        const job = await CompanyJob.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, message: 'Job deleted' });
    } catch (error) { next(error); }
};

// @desc   Get matched students for a job posting
// @route  GET /api/company/jobs/:id/matches
const getMatchedStudents = async (req, res, next) => {
    try {
        const job = await CompanyJob.findOne({ _id: req.params.id, postedBy: req.user.id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        const students = await User.find({ role: 'student' }).select('name email skills careerGoal');

        // Helper to normalize skill names: "React.js" -> "reactjs"
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

        const matched = students.map(student => {
            let matchCount = 0;
            let totalRequired = job.requiredSkills.length;

            const skillDetails = job.requiredSkills.map(req => {
                const reqNorm = normalize(req.name);

                // Find student skill with matching normalized name
                const found = student.skills.find(s => {
                    const skillNorm = normalize(s.name);
                    return skillNorm === reqNorm || skillNorm.includes(reqNorm) || reqNorm.includes(skillNorm);
                });

                const meets = found && found.proficiency >= req.minProficiency;
                if (meets) matchCount++;

                return {
                    skill: req.name,
                    required: req.minProficiency,
                    actual: found ? found.proficiency : 0,
                    meets
                };
            });

            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                matchScore: totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 0,
                skillDetails,
            };
        }).filter(s => s.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);

        res.json({ success: true, matches: matched });
    } catch (error) { next(error); }
};

// @desc   Get company profile stats
// @route  GET /api/company/stats
const getStats = async (req, res, next) => {
    try {
        const totalJobs = await CompanyJob.countDocuments({ postedBy: req.user.id });
        const activeJobs = await CompanyJob.countDocuments({ postedBy: req.user.id, isActive: true });
        const totalStudents = await User.countDocuments({ role: 'student' });
        res.json({ success: true, stats: { totalJobs, activeJobs, totalStudents } });
    } catch (error) { next(error); }
};

module.exports = { createJob, getMyJobs, updateJob, deleteJob, getMatchedStudents, getStats };
