const User = require('../models/User');
const Role = require('../models/Role');
const { analyzeGap } = require('../utils/gapAnalysis');
const { getRecommendations } = require('../utils/recommendationEngine');

// @desc    Run gap analysis for user against their career goal
// @route   GET /api/analysis/gap
// @access  Private
const getGapAnalysis = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.careerGoal) {
            return res.status(400).json({ success: false, message: 'Please set a career goal first' });
        }

        // Find role by name (career goal)
        const role = await Role.findOne({ name: { $regex: new RegExp(`^${user.careerGoal}$`, 'i') } });
        if (!role) {
            return res.status(404).json({ success: false, message: `Role "${user.careerGoal}" not found in database` });
        }

        const analysis = analyzeGap(user.skills, role.requiredSkills);

        res.status(200).json({
            success: true,
            role: {
                name: role.name,
                category: role.category,
                salaryRange: role.salaryRange,
                demandIndex: role.demandIndex,
                experienceLevel: role.experienceLevel,
                topCompanies: role.topCompanies,
            },
            analysis,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recommendations based on gap analysis
// @route   GET /api/analysis/recommendations
// @access  Private
const getAnalysisRecommendations = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.careerGoal) {
            return res.status(400).json({ success: false, message: 'Please set a career goal first' });
        }

        const role = await Role.findOne({ name: { $regex: new RegExp(`^${user.careerGoal}$`, 'i') } });
        if (!role) {
            return res.status(404).json({ success: false, message: `Role "${user.careerGoal}" not found` });
        }

        const { missingSkills, lowProficiencySkills } = analyzeGap(user.skills, role.requiredSkills);
        const recommendations = await getRecommendations(missingSkills, lowProficiencySkills);

        res.status(200).json({
            success: true,
            careerGoal: user.careerGoal,
            count: recommendations.length,
            recommendations,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get analysis for a specific role (not user's goal)
// @route   POST /api/analysis/compare
// @access  Private
const compareWithRole = async (req, res, next) => {
    try {
        const { roleId } = req.body;
        const user = await User.findById(req.user.id);
        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        const analysis = analyzeGap(user.skills, role.requiredSkills);

        res.status(200).json({
            success: true,
            role: { name: role.name, category: role.category, salaryRange: role.salaryRange, demandIndex: role.demandIndex },
            analysis,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getGapAnalysis, getAnalysisRecommendations, compareWithRole };
