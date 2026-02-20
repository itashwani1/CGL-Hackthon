const mongoose = require('mongoose');

// ─── Task Template Schema (embedded inside GoalPlan) ───────────────────────
const TaskSchema = new mongoose.Schema({
    day: { type: Number, required: true },           // Day number (1–90)
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'professional'], required: true },
    type: { type: String, enum: ['concept', 'practice', 'project', 'assessment', 'revision'], required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    skills: [String],
    estimatedMinutes: { type: Number, default: 45 },
    difficulty: { type: Number, default: 3, min: 1, max: 10 },  // adaptive
    isCompulsory: { type: Boolean, default: true },

    // Completion tracking
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'missed', 'revision', 'failed'], default: 'pending' },
    completedAt: { type: Date },
    score: { type: Number, min: 0, max: 100 },       // assessment/practice score
    notes: { type: String, default: '' },

    // Quiz / Assessment
    quiz: {
        questions: [{
            question: String,
            options: [String],
            correctIndex: Number, // 0-3
            explanation: String
        }],
        attempts: { type: Number, default: 0 },
        lastScore: { type: Number, default: 0 },
        generatedAt: Date
    }
}, { _id: true });

// ─── Main GoalPlan Schema ──────────────────────────────────────────────────
const GoalPlanSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Goal definition
    goalTitle: { type: String, required: true },     // e.g. "Frontend Developer"
    goalCategory: { type: String, required: true },  // e.g. "Frontend", "Data Science"
    timelineDays: { type: Number, default: 90, min: 30, max: 180 },
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date },

    // Level boundaries (calculated from timelineDays)
    levelBoundaries: {
        beginner: { startDay: Number, endDay: Number },
        intermediate: { startDay: Number, endDay: Number },
        advanced: { startDay: Number, endDay: Number },
        professional: { startDay: Number, endDay: Number },
    },

    // Status
    currentLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'professional'], default: 'beginner' },
    currentDay: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },

    // All generated tasks
    tasks: [TaskSchema],

    // Adaptive metrics
    performanceScore: { type: Number, default: 50 },   // 0–100 rolling average
    difficultyMultiplier: { type: Number, default: 1.0 }, // adaptive factor (0.7–1.5)

    // Streak & Stats
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    totalMissed: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },       // %
    skillImprovementScore: { type: Number, default: 0 }, // cumulative

    // ── Discipline & Penalty System ───────────────────────────────
    consecutiveMissedDays: { type: Number, default: 0 },   // resets on any task completed
    penaltyPoints: { type: Number, default: 0 },           // cumulative penalty score
    disciplineScore: { type: Number, default: 100 },       // starts 100, gets deducted
    // NORMAL (0-1 missed) | WARNING (2-3 missed) | FREEZE (4-5 missed) | CRITICAL (6+ missed)
    penaltyLevel: { type: String, enum: ['normal', 'warning', 'freeze', 'critical'], default: 'normal' },
    isFrozen: { type: Boolean, default: false },           // frozen = cannot proceed until penalty tasks done
    penaltyTasksRequired: { type: Number, default: 0 },    // how many penalty tasks remain to unfreeze

    // Notifications log
    notifications: [{
        type: { type: String, enum: ['reminder', 'missed', 'milestone', 'streak'] },
        message: String,
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
    }],

}, { timestamps: true });

// Auto-set deadline before save
GoalPlanSchema.pre('save', function (next) {
    if (!this.deadline && this.startDate && this.timelineDays) {
        this.deadline = new Date(this.startDate.getTime() + this.timelineDays * 24 * 60 * 60 * 1000);
    }
    next();
});

module.exports = mongoose.model('GoalPlan', GoalPlanSchema);
