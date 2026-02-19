const mongoose = require('mongoose');

const RequiredSkillSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    minProficiency: { type: Number, required: true, min: 1, max: 10 },
    category: { type: String, default: 'General' },
});

const CompanyJobSchema = new mongoose.Schema(
    {
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        jobTitle: { type: String, required: [true, 'Job title is required'], trim: true },
        description: { type: String, default: '' },
        requiredSkills: [RequiredSkillSchema],
        openings: { type: Number, default: 1, min: 1 },
        deadline: { type: Date },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('CompanyJob', CompanyJobSchema);
