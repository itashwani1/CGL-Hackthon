const Role = require('../models/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Public
const getRoles = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const roles = await Role.find(query).select('name category salaryRange demandIndex experienceLevel description');
        res.status(200).json({ success: true, count: roles.length, roles });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single role by ID
// @route   GET /api/roles/:id
// @access  Public
const getRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.status(200).json({ success: true, role });
    } catch (error) {
        next(error);
    }
};

// @desc    Get role categories
// @route   GET /api/roles/categories
// @access  Public
const getCategories = async (req, res, next) => {
    try {
        const categories = await Role.distinct('category');
        res.status(200).json({ success: true, categories });
    } catch (error) {
        next(error);
    }
};

module.exports = { getRoles, getRole, getCategories };
