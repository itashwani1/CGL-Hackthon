const Recommendation = require('../models/Recommendation');

/**
 * Recommendation Engine
 * Given arrays of missing and low proficiency skills,
 * fetches relevant courses from the Recommendation collection.
 */

const getRecommendations = async (missingSkills, lowProficiencySkills) => {
    const skillsToRecommend = [
        ...missingSkills.map((s) => ({ ...s, type: 'missing' })),
        ...lowProficiencySkills.map((s) => ({ ...s, type: 'low_proficiency' })),
    ];

    const results = [];

    for (const skillObj of skillsToRecommend) {
        const skillName = skillObj.skill.toLowerCase();

        const rec = await Recommendation.findOne({
            skill: { $regex: new RegExp(`^${skillName}$`, 'i') },
        });

        if (rec) {
            results.push({
                skill: rec.displayName,
                category: rec.category,
                type: skillObj.type,
                priority: skillObj.type === 'missing' ? 'high' : 'medium',
                userProficiency: skillObj.userProficiency || 0,
                requiredProficiency: skillObj.minimumProficiency || skillObj.requiredProficiency || 6,
                weight: skillObj.weight,
                courses: rec.courses.slice(0, 4), // Return top 4 courses per skill
            });
        } else {
            // Even if no specific courses exist, return the skill gap info
            results.push({
                skill: skillObj.skill,
                category: skillObj.category || 'General',
                type: skillObj.type,
                priority: skillObj.type === 'missing' ? 'high' : 'medium',
                userProficiency: skillObj.userProficiency || 0,
                requiredProficiency: skillObj.minimumProficiency || skillObj.requiredProficiency || 6,
                weight: skillObj.weight,
                courses: [],
            });
        }
    }

    // Sort by priority (missing > low_proficiency) then by weight desc
    results.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'missing' ? -1 : 1;
        return b.weight - a.weight;
    });

    return results;
};

module.exports = { getRecommendations };
