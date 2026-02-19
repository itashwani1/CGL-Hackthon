const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStudents, getAnalytics, getJobBoard } = require('../controllers/instituteController');

// Middleware: only institute role allowed
const instituteOnly = (req, res, next) => {
    if (req.user.role !== 'institute') {
        return res.status(403).json({ success: false, message: 'Access denied. Institute accounts only.' });
    }
    next();
};

router.use(protect, instituteOnly);

router.get('/students', getStudents);
router.get('/analytics', getAnalytics);
router.get('/jobs', getJobBoard);

module.exports = router;
