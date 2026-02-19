const express = require('express');
const router = express.Router();
const { getProfile, updateCareerGoal, addSkill, updateSkill, deleteSkill } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All user routes are protected

router.get('/profile', getProfile);
router.put('/career-goal', updateCareerGoal);
router.post('/skills', addSkill);
router.put('/skills/:skillId', updateSkill);
router.delete('/skills/:skillId', deleteSkill);

module.exports = router;
