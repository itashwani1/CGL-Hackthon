const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    proficiency: { type: Number, required: true, min: 1, max: 10 },
    category: { type: String, default: 'General' },
});

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
        role: { type: String, enum: ['student', 'company', 'institute'], default: 'student' },
        // Student fields
        skills: [SkillSchema],
        careerGoal: { type: String, default: '' },
        avatar: { type: String, default: '' },
        // Company / Institute fields
        organizationName: { type: String, default: '' },
        industry: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model('User', UserSchema);
