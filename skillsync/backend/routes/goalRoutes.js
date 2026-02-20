const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getTemplates,
    startGoal,
    getMyPlan,
    completeTask,
    getProgress,
    getDisciplineStatus,
    markNotificationsRead,
    resetGoal,
    startTaskQuiz,
    submitTaskQuiz
} = require('../controllers/goalController');

router.get('/templates', protect, getTemplates);
router.post('/start', protect, startGoal);
router.get('/my', protect, getMyPlan);
router.get('/progress', protect, getProgress);
router.get('/discipline', protect, getDisciplineStatus);
router.patch('/tasks/:taskId/complete', protect, completeTask);
router.patch('/notifications/read', protect, markNotificationsRead);
router.delete('/reset', protect, resetGoal);

// Quiz Routes
router.post('/tasks/:taskId/quiz/start', protect, startTaskQuiz);
router.post('/tasks/:taskId/quiz/submit', protect, submitTaskQuiz);

module.exports = router;

