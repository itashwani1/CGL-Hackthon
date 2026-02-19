const express = require('express');
const router = express.Router();
const { getGapAnalysis, getAnalysisRecommendations, compareWithRole } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All analysis routes are protected

router.get('/gap', getGapAnalysis);
router.get('/recommendations', getAnalysisRecommendations);
router.post('/compare', compareWithRole);

module.exports = router;
