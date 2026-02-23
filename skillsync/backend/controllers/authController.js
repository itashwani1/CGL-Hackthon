const User = require('../models/User');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skills: user.skills,
            careerGoal: user.careerGoal,
            organizationName: user.organizationName,
            industry: user.industry,
            location: user.location,
            website: user.website,
        },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        let { name, email, password, role, organizationName, industry, location, website } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        }

        email = email.toLowerCase();

        const validRoles = ['student', 'company', 'institute'];
        const userRole = validRoles.includes(role) ? role : 'student';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({
            name, email, password,
            role: userRole,
            organizationName: organizationName || '',
            industry: industry || '',
            location: location || '',
            website: website || '',
        });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        email = email.toLowerCase();
        console.log(`🔐 Login attempt for: ${email}`);

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log(`👤 User not found: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log(`🔑 Invalid password for: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log(`✅ Login successful for: ${email} (${user.role})`);
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };
