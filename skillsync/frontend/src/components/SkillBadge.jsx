const proficiencyColors = {
    low: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    high: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

const getProficiencyLevel = (p) => p <= 3 ? 'low' : p <= 6 ? 'medium' : 'high';

const proficiencyLabels = {
    low: 'Beginner',
    medium: 'Intermediate',
    high: 'Advanced',
};

export default function SkillBadge({ skill, onDelete }) {
    const level = getProficiencyLevel(skill.proficiency);
    const colors = proficiencyColors[level];

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colors.bg} ${colors.border} group`}>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{skill.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    {/* Proficiency dots */}
                    <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${i < skill.proficiency
                                        ? level === 'low' ? 'bg-red-400' : level === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                                        : 'bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className={`text-xs ${colors.text}`}>{skill.proficiency}/10</span>
                </div>
            </div>
            <span className={`badge ${colors.bg} ${colors.text} ${colors.border} border text-xs hidden sm:flex`}>
                {proficiencyLabels[level]}
            </span>
            {onDelete && (
                <button
                    onClick={() => onDelete(skill._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition-all duration-200 ml-1"
                    title="Remove skill"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
