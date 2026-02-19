const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createJob, getMyJobs, updateJob, deleteJob, getMatchedStudents, getStats
} = require('../controllers/companyController');

// Middleware: only company role allowed
const companyOnly = (req, res, next) => {
    if (req.user.role !== 'company') {
        return res.status(403).json({ success: false, message: 'Access denied. Company accounts only.' });
    }
    next();
};

router.use(protect, companyOnly);

router.get('/stats', getStats);
router.route('/jobs').get(getMyJobs).post(createJob);
router.route('/jobs/:id').put(updateJob).delete(deleteJob);
router.get('/jobs/:id/matches', getMatchedStudents);

module.exports = router;
