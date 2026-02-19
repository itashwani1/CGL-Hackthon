const User = require('../models/User');
const CompanyJob = require('../models/CompanyJob');

// @desc   Get all student profiles (for institute)
// @route  GET /api/institute/students
const getStudents = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('name email skills careerGoal createdAt')
            .sort({ createdAt: -1 });
        res.json({ success: true, students });
    } catch (error) { next(error); }
};

// @desc   Get aggregate analytics for institute
// @route  GET /api/institute/analytics
const getAnalytics = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'student' }).select('skills careerGoal');

        // Top skills
        const skillMap = {};
        students.forEach(s => {
            s.skills.forEach(sk => {
                if (!skillMap[sk.name]) skillMap[sk.name] = { count: 0, totalProficiency: 0 };
                skillMap[sk.name].count++;
                skillMap[sk.name].totalProficiency += sk.proficiency;
            });
        });
        const topSkills = Object.entries(skillMap)
            .map(([name, data]) => ({
                name,
                count: data.count,
                avgProficiency: Math.round((data.totalProficiency / data.count) * 10) / 10,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Career goal distribution
        const goalMap = {};
        students.forEach(s => {
            const goal = s.careerGoal || 'Not Set';
            goalMap[goal] = (goalMap[goal] || 0) + 1;
        });
        const careerGoals = Object.entries(goalMap)
            .map(([goal, count]) => ({ goal, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        res.json({
            success: true,
            analytics: {
                totalStudents: students.length,
                totalSkillsTracked: Object.keys(skillMap).length,
                topSkills,
                careerGoals,
            }
        });
    } catch (error) { next(error); }
};

// @desc   Get all active company job postings (for placement reference)
// @route  GET /api/institute/jobs
const getJobBoard = async (req, res, next) => {
    try {
        const jobs = await CompanyJob.find({ isActive: true })
            .populate('postedBy', 'name organizationName industry location')
            .sort({ createdAt: -1 });
        res.json({ success: true, jobs });
    } catch (error) { next(error); }
};

module.exports = { getStudents, getAnalytics, getJobBoard };
