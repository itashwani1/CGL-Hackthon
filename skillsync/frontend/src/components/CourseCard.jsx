const platformIcons = {
    Coursera: '🎓',
    Udemy: '🎯',
    edX: '📚',
    Pluralsight: '💻',
    YouTube: '▶️',
    FreeCodeCamp: '🔥',
    'LinkedIn Learning': '💼',
    Scrimba: '⚡',
    'Frontend Masters': '🚀',
    DataCamp: '📊',
};

const difficultyColors = {
    Beginner: 'text-green-400 bg-green-500/15 border-green-500/30',
    Intermediate: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
    Advanced: 'text-red-400 bg-red-500/15 border-red-500/30',
};

export default function CourseCard({ course }) {
    return (
        <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block glass-card p-4 hover:border-indigo-500/40 hover:bg-white/8 transition-all duration-300 group animate-slide-up"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {platformIcons[course.platform] || '📖'}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {course.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{course.platform}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`badge border text-xs ${difficultyColors[course.difficulty]}`}>
                            {course.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{course.duration}</span>
                        {course.isPaid ? (
                            <span className="badge bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs">Paid</span>
                        ) : (
                            <span className="badge bg-green-500/15 text-green-400 border border-green-500/30 text-xs">Free</span>
                        )}
                        <span className="text-xs text-yellow-400 ml-auto">⭐ {course.rating}</span>
                    </div>
                </div>
            </div>
        </a>
    );
}
