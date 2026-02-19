const User = require('../models/User');

// @desc    Get user profile (skills + career goal)
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update career goal
// @route   PUT /api/users/career-goal
// @access  Private
const updateCareerGoal = async (req, res, next) => {
    try {
        const { careerGoal } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { careerGoal },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a skill
// @route   POST /api/users/skills
// @access  Private
const addSkill = async (req, res, next) => {
    try {
        const { name, proficiency, category } = req.body;

        if (!name || !proficiency) {
            return res.status(400).json({ success: false, message: 'Skill name and proficiency are required' });
        }

        const user = await User.findById(req.user.id);

        // Check if skill already exists
        const existingSkillIndex = user.skills.findIndex(
            (s) => s.name.toLowerCase() === name.toLowerCase()
        );

        if (existingSkillIndex !== -1) {
            // Update existing skill
            user.skills[existingSkillIndex].proficiency = proficiency;
            if (category) user.skills[existingSkillIndex].category = category;
        } else {
            user.skills.push({ name, proficiency, category: category || 'General' });
        }

        await user.save();
        res.status(200).json({ success: true, skills: user.skills });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a skill
// @route   PUT /api/users/skills/:skillId
// @access  Private
const updateSkill = async (req, res, next) => {
    try {
        const { name, proficiency, category } = req.body;
        const user = await User.findById(req.user.id);

        const skill = user.skills.id(req.params.skillId);
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        if (name) skill.name = name;
        if (proficiency) skill.proficiency = proficiency;
        if (category) skill.category = category;

        await user.save();
        res.status(200).json({ success: true, skills: user.skills });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a skill
// @route   DELETE /api/users/skills/:skillId
// @access  Private
const deleteSkill = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        user.skills = user.skills.filter((s) => s._id.toString() !== req.params.skillId);
        await user.save();
        res.status(200).json({ success: true, skills: user.skills });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateCareerGoal, addSkill, updateSkill, deleteSkill };
