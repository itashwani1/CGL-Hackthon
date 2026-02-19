const mongoose = require('mongoose');

const RequiredSkillSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 1 }, // importance weight for scoring
    minimumProficiency: { type: Number, default: 6, min: 1, max: 10 },
    category: { type: String, default: 'General' },
});

const RoleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        category: {
            type: String,
            required: true,
            enum: ['Engineering', 'Data', 'Design', 'Product', 'DevOps', 'Security', 'Management'],
        },
        description: { type: String, default: '' },
        requiredSkills: [RequiredSkillSchema],
        salaryRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
            currency: { type: String, default: 'USD' },
        },
        demandIndex: { type: Number, required: true, min: 0, max: 100 }, // market demand 0-100
        experienceLevel: {
            type: String,
            enum: ['Junior', 'Mid', 'Senior', 'Lead'],
            default: 'Mid',
        },
        topCompanies: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Role', RoleSchema);
