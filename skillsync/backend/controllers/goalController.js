const GoalPlan = require('../models/GoalPlan');
const User = require('../models/User');
const { generateQuiz } = require('../utils/quizGenerator');

// ══════════════════════════════════════════════════════
//  GOAL TEMPLATES
// ══════════════════════════════════════════════════════
const GOAL_TEMPLATES = {
    'Frontend Developer': {
        category: 'Frontend',
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git', 'REST APIs', 'Tailwind CSS', 'Testing', 'Deployment'],
        skillDetails: [
            { name: 'HTML', proficiency: 1, category: 'Frontend' },
            { name: 'CSS', proficiency: 1, category: 'Frontend' },
            { name: 'JavaScript', proficiency: 1, category: 'Programming' },
            { name: 'React', proficiency: 1, category: 'Frontend' },
            { name: 'Git', proficiency: 1, category: 'Tools' },
        ],
        levels: {
            beginner: { ratio: 0.25, focus: ['HTML', 'CSS', 'JavaScript basics'], taskTypes: { concept: 0.5, practice: 0.35, project: 0.1, assessment: 0.05 } },
            intermediate: { ratio: 0.30, focus: ['JavaScript advanced', 'DOM', 'Git', 'REST APIs'], taskTypes: { concept: 0.35, practice: 0.35, project: 0.2, assessment: 0.1 } },
            advanced: { ratio: 0.25, focus: ['React', 'React Hooks', 'TypeScript', 'Tailwind CSS'], taskTypes: { concept: 0.25, practice: 0.30, project: 0.30, assessment: 0.15 } },
            professional: { ratio: 0.20, focus: ['Testing', 'Deployment', 'Performance', 'Portfolio Projects'], taskTypes: { concept: 0.15, practice: 0.20, project: 0.45, assessment: 0.20 } },
        },
    },
    'Data Analyst': {
        category: 'Data Science',
        skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Data Visualization', 'Statistics', 'Excel', 'Power BI', 'EDA', 'ML Basics'],
        skillDetails: [
            { name: 'Python', proficiency: 1, category: 'Programming' },
            { name: 'SQL', proficiency: 1, category: 'Database' },
            { name: 'Excel', proficiency: 1, category: 'Tools' },
            { name: 'Statistics', proficiency: 1, category: 'Data Science' },
            { name: 'Data Visualization', proficiency: 1, category: 'Data Science' },
        ],
        levels: {
            beginner: { ratio: 0.25, focus: ['Python basics', 'Excel', 'SQL fundamentals'], taskTypes: { concept: 0.5, practice: 0.35, project: 0.1, assessment: 0.05 } },
            intermediate: { ratio: 0.30, focus: ['Pandas', 'NumPy', 'SQL advanced', 'Statistics'], taskTypes: { concept: 0.35, practice: 0.35, project: 0.2, assessment: 0.1 } },
            advanced: { ratio: 0.25, focus: ['Data Viz', 'Power BI', 'EDA', 'Storytelling'], taskTypes: { concept: 0.25, practice: 0.30, project: 0.30, assessment: 0.15 } },
            professional: { ratio: 0.20, focus: ['ML Basics', 'Real Datasets', 'Dashboard Projects'], taskTypes: { concept: 0.15, practice: 0.20, project: 0.45, assessment: 0.20 } },
        },
    },
    'Backend Developer': {
        category: 'Backend',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST API Design', 'Authentication', 'SQL', 'System Design', 'Docker', 'Testing', 'Cloud'],
        skillDetails: [
            { name: 'Node.js', proficiency: 1, category: 'Backend' },
            { name: 'Express', proficiency: 1, category: 'Backend' },
            { name: 'MongoDB', proficiency: 1, category: 'Database' },
            { name: 'SQL', proficiency: 1, category: 'Database' },
            { name: 'Git', proficiency: 1, category: 'Tools' },
        ],
        levels: {
            beginner: { ratio: 0.25, focus: ['Node.js basics', 'HTTP', 'Express'], taskTypes: { concept: 0.5, practice: 0.35, project: 0.1, assessment: 0.05 } },
            intermediate: { ratio: 0.30, focus: ['MongoDB', 'REST API Design', 'Authentication'], taskTypes: { concept: 0.35, practice: 0.35, project: 0.2, assessment: 0.1 } },
            advanced: { ratio: 0.25, focus: ['SQL', 'System Design', 'Testing'], taskTypes: { concept: 0.25, practice: 0.30, project: 0.30, assessment: 0.15 } },
            professional: { ratio: 0.20, focus: ['Docker', 'Cloud', 'Performance', 'Production Apps'], taskTypes: { concept: 0.15, practice: 0.20, project: 0.45, assessment: 0.20 } },
        },
    },
    'Full Stack Developer': {
        category: 'Full Stack',
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'REST APIs', 'Auth', 'Deployment'],
        skillDetails: [
            { name: 'JavaScript', proficiency: 1, category: 'Programming' },
            { name: 'React', proficiency: 1, category: 'Frontend' },
            { name: 'Node.js', proficiency: 1, category: 'Backend' },
            { name: 'MongoDB', proficiency: 1, category: 'Database' },
            { name: 'Git', proficiency: 1, category: 'Tools' },
        ],
        levels: {
            beginner: { ratio: 0.25, focus: ['HTML/CSS', 'JS basics', 'Git'], taskTypes: { concept: 0.5, practice: 0.35, project: 0.1, assessment: 0.05 } },
            intermediate: { ratio: 0.30, focus: ['React', 'Node.js', 'Express', 'MongoDB'], taskTypes: { concept: 0.35, practice: 0.35, project: 0.2, assessment: 0.1 } },
            advanced: { ratio: 0.25, focus: ['Full Stack App', 'Auth', 'REST APIs'], taskTypes: { concept: 0.25, practice: 0.30, project: 0.30, assessment: 0.15 } },
            professional: { ratio: 0.20, focus: ['Deployment', 'CI/CD', 'Portfolio', 'Open Source'], taskTypes: { concept: 0.15, practice: 0.20, project: 0.45, assessment: 0.20 } },
        },
    },
    'Data Scientist': {
        category: 'AI/ML',
        skills: ['Python', 'Statistics', 'Pandas', 'Scikit-Learn', 'Machine Learning', 'Deep Learning', 'NLP', 'Model Deployment', 'Feature Engineering', 'Research'],
        skillDetails: [
            { name: 'Python', proficiency: 1, category: 'Programming' },
            { name: 'Statistics', proficiency: 1, category: 'Data Science' },
            { name: 'Machine Learning', proficiency: 1, category: 'AI/ML' },
            { name: 'Pandas', proficiency: 1, category: 'Data Science' },
            { name: 'Deep Learning', proficiency: 1, category: 'AI/ML' },
        ],
        levels: {
            beginner: { ratio: 0.25, focus: ['Python', 'Statistics', 'Math foundations'], taskTypes: { concept: 0.5, practice: 0.35, project: 0.1, assessment: 0.05 } },
            intermediate: { ratio: 0.30, focus: ['Pandas', 'Scikit-Learn', 'ML algorithms'], taskTypes: { concept: 0.35, practice: 0.35, project: 0.2, assessment: 0.1 } },
            advanced: { ratio: 0.25, focus: ['Deep Learning', 'NLP', 'Feature Engineering'], taskTypes: { concept: 0.25, practice: 0.30, project: 0.30, assessment: 0.15 } },
            professional: { ratio: 0.20, focus: ['Model Deployment', 'Research Papers', 'Kaggle'], taskTypes: { concept: 0.15, practice: 0.20, project: 0.45, assessment: 0.20 } },
        },
    },
};

// ══════════════════════════════════════════════════════
//  DISCIPLINE PENALTY CONFIG
// ══════════════════════════════════════════════════════
const PENALTY_CONFIG = {
    normal: { missedThreshold: 1, deduction: 5, penaltyTasks: 1, label: 'Good Standing 🟢' },
    warning: { missedThreshold: 3, deduction: 10, penaltyTasks: 2, label: 'Warning ⚠️' },
    freeze: { missedThreshold: 5, deduction: 20, penaltyTasks: 3, label: 'Frozen 🧊' },
    critical: { missedThreshold: 6, deduction: 30, penaltyTasks: 5, label: 'Critical ❌' },
};

function calcPenaltyLevel(consecutiveMissed) {
    if (consecutiveMissed >= 6) return 'critical';
    if (consecutiveMissed >= 4) return 'freeze';
    if (consecutiveMissed >= 2) return 'warning';
    return 'normal';
}

function addPenaltyTasks(plan, count, dayNum) {
    const ref = plan.tasks.find(t => t.day === dayNum) || {};
    const skill = ref.skills?.[0] || 'previously missed topic';
    const lvl = ref.level || plan.currentLevel;
    for (let i = 0; i < count; i++) {
        plan.tasks.push({
            day: dayNum,
            level: lvl,
            type: 'revision',
            title: `🔴 PENALTY Task ${i + 1}: Urgent revision — ${skill}`,
            description: `Mandatory penalty task due to missing ${plan.consecutiveMissedDays} consecutive days. You must complete all penalty tasks to unfreeze your account. Review ${skill} fundamentals thoroughly.`,
            skills: ref.skills || [skill],
            estimatedMinutes: 45,
            difficulty: Math.min(10, (ref.difficulty || 3) + 2),
            isCompulsory: true,
            status: 'pending',
        });
    }
}

// ══════════════════════════════════════════════════════
//  TASK GENERATION HELPERS
// ══════════════════════════════════════════════════════
const TASK_TITLES = {
    concept: (skill, level) => `📖 Study ${skill} — ${level} concepts`,
    practice: (skill, level) => `💻 Practice ${skill} exercises (${level})`,
    project: (skill, level) => `🛠️ Build a mini-project using ${skill}`,
    assessment: (skill, level) => `📝 Skill assessment: ${skill} (${level} level)`,
    revision: (skill) => `🔄 Revision: Reinforce ${skill} concepts`,
};

const TASK_DESCRIPTIONS = {
    concept: (skill) => `Learn core theoretical foundations of ${skill}. Watch 1–2 tutorial videos, read documentation, and take notes.`,
    practice: (skill) => `Complete 5–10 hands-on coding exercises covering ${skill}. Focus on understanding, not just output.`,
    project: (skill) => `Build a small working project that demonstrates ${skill}. Commit to GitHub when complete.`,
    assessment: (skill) => `Test your current understanding of ${skill} with a timed quiz and coding challenge.`,
    revision: (skill) => `Review your notes and redo 3 failed exercises from previous sessions on ${skill}.`,
};

const BASE_DIFFICULTY = { beginner: 2, intermediate: 4, advanced: 6, professional: 8 };
const TASK_MINUTES = { concept: 60, practice: 45, project: 90, assessment: 30, revision: 40 };

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function pickType(taskTypes) {
    const r = Math.random();
    let cumulative = 0;
    for (const [type, prob] of Object.entries(taskTypes)) {
        cumulative += prob;
        if (r < cumulative) return type;
    }
    return 'practice';
}

function generatePlan(template, timelineDays) {
    const levels = ['beginner', 'intermediate', 'advanced', 'professional'];
    const boundaries = {};
    let dayPointer = 1;

    levels.forEach(lvl => {
        const days = Math.round(template.levels[lvl].ratio * timelineDays);
        boundaries[lvl] = { startDay: dayPointer, endDay: dayPointer + days - 1 };
        dayPointer += days;
    });

    const tasks = [];
    levels.forEach(lvl => {
        const { startDay, endDay } = boundaries[lvl];
        const lvlDef = template.levels[lvl];

        for (let day = startDay; day <= endDay; day++) {
            const focusedSkills = template.skills.filter(s =>
                lvlDef.focus.some(f => f.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(f.toLowerCase()))
            );
            const skill = pickRandom(focusedSkills.length ? focusedSkills : template.skills);
            const type = pickType(lvlDef.taskTypes);
            const baseDiff = BASE_DIFFICULTY[lvl];
            const variance = Math.floor(Math.random() * 2) - 1;

            tasks.push({
                day, level: lvl, type,
                title: TASK_TITLES[type](skill, lvl),
                description: TASK_DESCRIPTIONS[type](skill),
                skills: [skill],
                estimatedMinutes: TASK_MINUTES[type],
                difficulty: Math.min(10, Math.max(1, baseDiff + variance)),
                isCompulsory: true, status: 'pending',
            });
        }
    });

    return { tasks, levelBoundaries: boundaries };
}

// ══════════════════════════════════════════════════════
//  CONTROLLER FUNCTIONS
// ══════════════════════════════════════════════════════

// GET /api/goals/templates
const getTemplates = async (req, res) => {
    const templates = Object.entries(GOAL_TEMPLATES).map(([name, t]) => ({
        name, category: t.category, skills: t.skills, skillDetails: t.skillDetails, levels: Object.keys(t.levels),
    }));
    res.json({ success: true, templates });
};

// POST /api/goals/start
const startGoal = async (req, res, next) => {
    try {
        const { goalTitle, timelineDays = 90, customSkills } = req.body;
        if (!goalTitle) return res.status(400).json({ success: false, message: 'goalTitle is required' });

        let template;

        if (customSkills && Array.isArray(customSkills) && customSkills.length > 0) {
            template = {
                category: 'Custom Goal',
                skills: customSkills,
                skillDetails: customSkills.map(s => ({ name: s, proficiency: 1, category: 'Custom' })),
                levels: {
                    beginner: { ratio: 0.25, focus: customSkills, taskTypes: { concept: 0.40, practice: 0.40, project: 0.15, assessment: 0.05 } },
                    intermediate: { ratio: 0.30, focus: customSkills, taskTypes: { concept: 0.30, practice: 0.40, project: 0.20, assessment: 0.10 } },
                    advanced: { ratio: 0.25, focus: customSkills, taskTypes: { concept: 0.20, practice: 0.35, project: 0.30, assessment: 0.15 } },
                    professional: { ratio: 0.20, focus: customSkills, taskTypes: { concept: 0.10, practice: 0.25, project: 0.45, assessment: 0.20 } },
                },
            };
        } else {
            template = GOAL_TEMPLATES[goalTitle];
            if (!template) return res.status(400).json({ success: false, message: 'Unknown goal template.' });
        }

        await GoalPlan.deleteOne({ student: req.user.id });

        const { tasks, levelBoundaries } = generatePlan(template, timelineDays);

        const plan = await GoalPlan.create({
            student: req.user.id,
            goalTitle,
            goalCategory: template.category,
            timelineDays: Number(timelineDays),
            startDate: new Date(),
            levelBoundaries,
            currentLevel: 'beginner',
            currentDay: 1,
            tasks,
            notifications: [{
                type: 'milestone',
                message: `🚀 Your ${goalTitle} journey begins! ${timelineDays} days to become industry-ready.`,
            }],
        });

        // Auto-inject skills
        try {
            const user = await User.findById(req.user.id);
            if (user) {
                const existingNames = (user.skills || []).map(s => s.name.toLowerCase());
                const newSkills = template.skillDetails.filter(sd => !existingNames.includes(sd.name.toLowerCase()));
                if (newSkills.length > 0) {
                    user.skills = [...(user.skills || []), ...newSkills];
                    await user.save();
                }
            }
        } catch (e) { /* ignore */ }

        res.status(201).json({ success: true, plan });
    } catch (err) { next(err); }
};

// GET /api/goals/my
const getMyPlan = async (req, res, next) => {
    try {
        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.json({ success: true, plan: null });

        const elapsed = Math.floor((Date.now() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const syncedDay = Math.min(elapsed, plan.timelineDays);

        if (syncedDay !== plan.currentDay) {
            const daysJumped = syncedDay - plan.currentDay;
            const missedTasks = plan.tasks.filter(t => t.day < syncedDay && t.status === 'pending');

            if (missedTasks.length > 0) {
                missedTasks.forEach(t => { t.status = 'missed'; plan.totalMissed += 1; });

                plan.consecutiveMissedDays += daysJumped;
                const newLevel = calcPenaltyLevel(plan.consecutiveMissedDays);
                const cfg = PENALTY_CONFIG[newLevel];

                plan.disciplineScore = Math.max(0, plan.disciplineScore - cfg.deduction * daysJumped);
                plan.penaltyPoints += cfg.deduction * daysJumped;
                plan.streak = 0;
                plan.penaltyLevel = newLevel;

                if (newLevel === 'freeze' || newLevel === 'critical') {
                    plan.isFrozen = true;
                    plan.penaltyTasksRequired = cfg.penaltyTasks;
                    addPenaltyTasks(plan, cfg.penaltyTasks, syncedDay);
                } else {
                    missedTasks.slice(0, cfg.penaltyTasks).forEach(missed => {
                        plan.tasks.push({
                            day: syncedDay, level: missed.level, type: 'revision',
                            title: TASK_TITLES.revision(missed.skills[0] || 'previous topic'),
                            description: TASK_DESCRIPTIONS.revision(missed.skills[0] || 'previous topic'),
                            skills: missed.skills,
                            estimatedMinutes: TASK_MINUTES.revision,
                            difficulty: Math.min(10, missed.difficulty + 1),
                            isCompulsory: true, status: 'pending',
                        });
                    });
                }

                const penaltyMsg = `⚠️ You missed tasks! Streak reset. Current penalty level: ${cfg.label}`;
                plan.notifications.push({ type: 'missed', message: penaltyMsg });
            }

            plan.currentDay = syncedDay;

            for (const [lvl, bounds] of Object.entries(plan.levelBoundaries)) {
                if (syncedDay >= bounds.startDay && syncedDay <= bounds.endDay) {
                    if (plan.currentLevel !== lvl) {
                        plan.notifications.push({ type: 'milestone', message: `🏆 Level Up! Now at ${lvl.toUpperCase()}!` });
                    }
                    plan.currentLevel = lvl;
                    break;
                }
            }

            if (syncedDay >= plan.timelineDays) {
                plan.isCompleted = true;
                plan.notifications.push({ type: 'milestone', message: `🎉 Goal Completed!` });
            }

            const done = plan.tasks.filter(t => t.status === 'completed').length;
            const total = plan.tasks.filter(t => t.day <= syncedDay).length;
            plan.completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

            await plan.save();
        }

        const todayTasks = plan.tasks.filter(t => t.day === plan.currentDay);
        const unreadNotifs = plan.notifications.filter(n => !n.read);
        res.json({ success: true, plan, todayTasks, unreadNotifs });
    } catch (err) { next(err); }
};

// PATCH /api/goals/tasks/:taskId/complete
const completeTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { score = 80, notes = '' } = req.body;

        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.status(404).json({ success: false, message: 'No active goal plan' });

        const task = plan.tasks.id(taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        // Manual override allowed for some cases, but generally we want quiz completion
        if (task.status === 'completed') return res.status(400).json({ success: false, message: 'Task already completed' });

        task.status = 'completed';
        task.completedAt = new Date();
        task.score = Math.min(100, Math.max(0, Number(score)));
        task.notes = notes;
        plan.totalCompleted += 1;

        // Discipline Recovery (Simplified for brevity as we focus on quiz)
        if (plan.consecutiveMissedDays > 0) {
            plan.consecutiveMissedDays = Math.max(0, plan.consecutiveMissedDays - 1);
            plan.disciplineScore = Math.min(100, plan.disciplineScore + 2);
        }

        // Streak Logic
        const dayTasks = plan.tasks.filter(t => t.day === plan.currentDay && t.isCompulsory);
        if (dayTasks.every(t => t.status === 'completed')) {
            plan.streak += 1;
            if (plan.streak > plan.longestStreak) plan.longestStreak = plan.streak;
        }

        const done = plan.tasks.filter(t => t.status === 'completed').length;
        const total = plan.tasks.filter(t => t.day <= plan.currentDay).length;
        plan.completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

        await plan.save();
        res.json({ success: true, task, plan });
    } catch (err) { next(err); }
};

// ── NEW QUIZ FUNCTIONS ────────────────────────────────────────

// POST /api/goals/tasks/:taskId/quiz/start
const startTaskQuiz = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.status(404).json({ success: false, message: 'Goal Plan not found' });

        const task = plan.tasks.id(taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        if (task.status === 'completed') {
            return res.json({ success: true, alreadyCompleted: true, message: 'Task already completed!' });
        }

        // Generate quiz if not exists
        if (!task.quiz || !task.quiz.questions || task.quiz.questions.length === 0) {
            const skill = task.skills[0] || 'General';
            const questions = generateQuiz(skill, 5); // Generate 5 questions (User Request)
            task.quiz = {
                questions,
                attempts: 0,
                lastScore: 0,
                generatedAt: new Date()
            };
            await plan.save();
        }

        // Return questions without correct answer
        const clientQuestions = task.quiz.questions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options
        }));

        res.json({ success: true, questions: clientQuestions });

    } catch (err) { next(err); }
};

// POST /api/goals/tasks/:taskId/quiz/submit
const submitTaskQuiz = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { answers } = req.body; // Array of indices e.g. [1, 0, 2]

        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.status(404).json({ success: false, message: 'Goal Plan not found' });

        const task = plan.tasks.id(taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        if (!task.quiz || !task.quiz.questions) {
            return res.status(400).json({ success: false, message: 'Quiz not started' });
        }

        task.quiz.attempts += 1;

        // Calculate Score
        let correctCount = 0;
        const results = task.quiz.questions.map((q, i) => {
            const isCorrect = q.correctIndex === answers[i];
            if (isCorrect) correctCount++;
            return { questionId: q._id, isCorrect, correctIndex: q.correctIndex };
        });

        const score = Math.round((correctCount / task.quiz.questions.length) * 100);
        task.quiz.lastScore = score;
        const passed = score >= 60;

        if (passed) {
            // Task Completion Logic
            task.status = 'completed';
            task.completedAt = new Date();
            task.score = score;
            plan.totalCompleted += 1;

            // Skill Score & Streak Update
            const difficulty = task.difficulty || 3;
            const points = difficulty * 5;
            plan.skillImprovementScore += points;

            // Check daily streak
            const dayTasks = plan.tasks.filter(t => t.day === plan.currentDay && t.isCompulsory);
            if (dayTasks.every(t => t.status === 'completed')) {
                plan.streak += 1;
                plan.longestStreak = Math.max(plan.streak, plan.longestStreak);
            }
        } else {
            // Failed logic
            // Reduce streak if failed? Prompt says "Reduce streak by -1".
            if (plan.streak > 0) plan.streak -= 1;
            // Assign revision?
            // For now just return failed status, frontend can show retry
        }

        // Update completion rate
        const done = plan.tasks.filter(t => t.status === 'completed').length;
        const total = plan.tasks.filter(t => t.day <= plan.currentDay).length;
        plan.completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

        await plan.save();

        res.json({
            success: true,
            passed,
            score,
            results, // Show which were correct
            message: passed ? `🎉 Passed! +${task.difficulty * 5} Skill Points` : '❌ Failed. Try again!',
            streak: plan.streak
        });

    } catch (err) { next(err); }
};

// GET /api/goals/progress
const getProgress = async (req, res, next) => {
    try {
        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.json({ success: true, progress: null });

        const allTasks = plan.tasks;
        const completedTasks = allTasks.filter(t => t.status === 'completed');
        const missedTasks = allTasks.filter(t => t.status === 'missed');

        const dailyData = [];
        for (let d = Math.max(1, plan.currentDay - 13); d <= plan.currentDay; d++) {
            const dt = allTasks.filter(t => t.day === d);
            const done = dt.filter(t => t.status === 'completed').length;
            dailyData.push({ day: d, total: dt.length, completed: done, rate: dt.length > 0 ? Math.round((done / dt.length) * 100) : 0 });
        }

        const levelStats = {};
        ['beginner', 'intermediate', 'advanced', 'professional'].forEach(lvl => {
            const lt = allTasks.filter(t => t.level === lvl);
            const ld = lt.filter(t => t.status === 'completed');
            levelStats[lvl] = {
                total: lt.length, completed: ld.length,
                avgScore: ld.length ? Math.round(ld.reduce((s, t) => s + (t.score || 0), 0) / ld.length) : 0,
                rate: lt.length > 0 ? Math.round((ld.length / lt.length) * 100) : 0,
            };
        });

        res.json({
            success: true, progress: {
                goalTitle: plan.goalTitle, currentDay: plan.currentDay, timelineDays: plan.timelineDays,
                daysLeft: Math.max(0, plan.timelineDays - plan.currentDay), deadline: plan.deadline,
                currentLevel: plan.currentLevel, streak: plan.streak, longestStreak: plan.longestStreak,
                totalCompleted: completedTasks.length, totalMissed: missedTasks.length,
                completionRate: plan.completionRate, skillImprovementScore: plan.skillImprovementScore,
                performanceScore: plan.performanceScore, difficultyMultiplier: plan.difficultyMultiplier,
                levelBoundaries: plan.levelBoundaries, dailyData, levelStats, isCompleted: plan.isCompleted,
                disciplineScore: plan.disciplineScore, penaltyLevel: plan.penaltyLevel,
                penaltyPoints: plan.penaltyPoints, consecutiveMissedDays: plan.consecutiveMissedDays,
                isFrozen: plan.isFrozen, penaltyTasksRequired: plan.penaltyTasksRequired,
            }
        });
    } catch (err) { next(err); }
};

// GET /api/goals/discipline
const getDisciplineStatus = async (req, res, next) => {
    try {
        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.json({ success: true, discipline: null });
        const cfg = PENALTY_CONFIG[plan.penaltyLevel];
        res.json({
            success: true, discipline: {
                disciplineScore: plan.disciplineScore, penaltyLevel: plan.penaltyLevel, penaltyLabel: cfg.label,
                penaltyPoints: plan.penaltyPoints, consecutiveMissedDays: plan.consecutiveMissedDays,
                isFrozen: plan.isFrozen, penaltyTasksRequired: plan.penaltyTasksRequired,
                streak: plan.streak, totalMissed: plan.totalMissed, totalCompleted: plan.totalCompleted,
            }
        });
    } catch (err) { next(err); }
};

// PATCH /api/goals/notifications/read
const markNotificationsRead = async (req, res, next) => {
    try {
        const plan = await GoalPlan.findOne({ student: req.user.id });
        if (!plan) return res.status(404).json({ success: false, message: 'No plan found' });
        plan.notifications.forEach(n => n.read = true);
        await plan.save();
        res.json({ success: true });
    } catch (err) { next(err); }
};

// DELETE /api/goals/reset
const resetGoal = async (req, res, next) => {
    try {
        await GoalPlan.deleteOne({ student: req.user.id });
        res.json({ success: true, message: 'Goal plan reset successfully' });
    } catch (err) { next(err); }
};

module.exports = {
    getTemplates, startGoal, getMyPlan, completeTask, getProgress,
    getDisciplineStatus, markNotificationsRead, resetGoal,
    startTaskQuiz, submitTaskQuiz
};
