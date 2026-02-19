const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    platform: {
        type: String,
        required: true,
        enum: ['Coursera', 'Udemy', 'edX', 'Pluralsight', 'YouTube', 'FreeCodeCamp', 'LinkedIn Learning', 'Scrimba', 'Frontend Masters', 'DataCamp'],
    },
    duration: { type: String, default: 'Self-paced' }, // e.g. "10 hours"
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    isPaid: { type: Boolean, default: false },
});

const RecommendationSchema = new mongoose.Schema(
    {
        skill: { type: String, required: true, unique: true, lowercase: true, trim: true },
        displayName: { type: String, required: true },
        category: { type: String, default: 'General' },
        courses: [CourseSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Recommendation', RecommendationSchema);
