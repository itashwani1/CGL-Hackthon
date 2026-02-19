/**
 * Gap Analysis Utility
 * Compares user skills against a role's required skills and computes:
 *  - missingSkills: skills not present in user profile
 *  - lowProficiencySkills: skills present but below minimum required proficiency
 *  - matchedSkills: skills that meet requirements
 *  - fitScore: weighted percentage indicating role readiness
 */

const analyzeGap = (userSkills, requiredSkills) => {
    const missingSkills = [];
    const lowProficiencySkills = [];
    const matchedSkills = [];

    let totalWeight = 0;
    let achievedWeight = 0;

    requiredSkills.forEach((reqSkill) => {
        const skillName = reqSkill.skill.toLowerCase();
        const weight = reqSkill.weight;
        const minProf = reqSkill.minimumProficiency || 6;
        totalWeight += weight;

        const userSkill = userSkills.find(
            (s) => s.name.toLowerCase() === skillName
        );

        if (!userSkill) {
            // Skill completely missing
            missingSkills.push({
                skill: reqSkill.skill,
                weight,
                minimumProficiency: minProf,
                category: reqSkill.category || 'General',
            });
        } else if (userSkill.proficiency < minProf) {
            // Skill present but proficiency is low
            const profGap = minProf - userSkill.proficiency;
            lowProficiencySkills.push({
                skill: reqSkill.skill,
                userProficiency: userSkill.proficiency,
                requiredProficiency: minProf,
                proficiencyGap: profGap,
                weight,
                category: reqSkill.category || 'General',
            });
            // Partial credit based on how close they are
            const partialCredit = (userSkill.proficiency / minProf) * weight;
            achievedWeight += partialCredit;
        } else {
            // Skill meets requirements
            matchedSkills.push({
                skill: reqSkill.skill,
                userProficiency: userSkill.proficiency,
                requiredProficiency: minProf,
                weight,
                category: reqSkill.category || 'General',
            });
            achievedWeight += weight;
        }
    });

    const fitScore = totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 100) : 0;

    return {
        missingSkills,
        lowProficiencySkills,
        matchedSkills,
        fitScore: Math.min(fitScore, 100),
        totalRequired: requiredSkills.length,
        totalMissing: missingSkills.length,
        totalLow: lowProficiencySkills.length,
        totalMatched: matchedSkills.length,
    };
};

module.exports = { analyzeGap };
