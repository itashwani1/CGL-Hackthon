import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../api/api';
import GlassCard from '../components/GlassCard';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const priorityConfig = {
    high: { label: 'Missing Skill', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', dot: 'bg-red-400' },
    medium: { label: 'Low Proficiency', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30', dot: 'bg-yellow-400' },
};

export default function Recommendations() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSkill, setActiveSkill] = useState(null);

    useEffect(() => {
        if (!user?.careerGoal) { setLoading(false); return; }
        analysisAPI.getRecommendations()
            .then(res => {
                setData(res.data);
                if (res.data.recommendations?.length) setActiveSkill(res.data.recommendations[0].skill);
            })
            .catch(err => setError(err.response?.data?.message || 'Could not load recommendations'))
            .finally(() => setLoading(false));
    }, [user?.careerGoal]);

    if (!user?.careerGoal) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 text-center">
                <GlassCard className="max-w-md mx-auto">
                    <div className="text-5xl mb-4">🎯</div>
                    <h2 className="text-xl font-bold text-white mb-2">No Career Goal Set</h2>
                    <p className="text-gray-400 text-sm mb-5">Set your career goal first to get personalized recommendations</p>
                    <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
                </GlassCard>
            </div>
        );
    }

    if (loading) return <LoadingSpinner text="Fetching course recommendations..." />;
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 pt-16 text-center">
                <GlassCard className="max-w-md mx-auto">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-red-400 font-medium mb-4">{error}</p>
                    <Link to="/dashboard" className="btn-secondary inline-block">← Back to Dashboard</Link>
                </GlassCard>
            </div>
        );
    }

    const { recommendations = [], careerGoal } = data || {};
    const activeRec = recommendations.find(r => r.skill === activeSkill);
    const highPriority = recommendations.filter(r => r.priority === 'high');
    const mediumPriority = recommendations.filter(r => r.priority === 'medium');

    if (!recommendations.length) {
        return (
            <div className="max-w-7xl mx-auto px-4 pt-16 text-center">
                <GlassCard className="max-w-md mx-auto">
                    <div className="text-5xl mb-4">🏆</div>
                    <h2 className="text-xl font-bold text-white mb-2">You're All Caught Up!</h2>
                    <p className="text-gray-400 text-sm mb-5">No skill gaps found for <span className="text-indigo-300">{careerGoal}</span>. You meet all requirements!</p>
                    <Link to="/gap-analysis" className="btn-primary">View Full Analysis</Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white">Recommendations</h1>
                    <p className="text-gray-400 mt-1">
                        Curated courses to become a <span className="text-indigo-300 font-medium">{careerGoal}</span>
                    </p>
                </div>
                <Link to="/gap-analysis" className="btn-secondary text-sm">
                    ← Back to Gap Analysis
                </Link>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Skills to Learn', value: recommendations.length, icon: '📚', color: 'from-indigo-500 to-purple-600' },
                    { label: 'High Priority', value: highPriority.length, icon: '🔴', color: 'from-red-500 to-rose-600' },
                    { label: 'Improve', value: mediumPriority.length, icon: '🟡', color: 'from-yellow-500 to-amber-500' },
                ].map(({ label, value, icon, color }) => (
                    <GlassCard key={label} className="text-center">
                        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${color} mb-2 text-base`}>{icon}</div>
                        <p className="text-2xl font-bold text-white">{value}</p>
                        <p className="text-xs text-gray-400">{label}</p>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skill Sidebar */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Skill Gaps</h2>

                    {highPriority.length > 0 && (
                        <div className="space-y-1.5 mb-4">
                            <p className="text-xs text-red-400 font-medium px-1 mb-2">🔴 Missing Skills</p>
                            {highPriority.map(rec => (
                                <button
                                    key={rec.skill}
                                    onClick={() => setActiveSkill(rec.skill)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${activeSkill === rec.skill
                                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                            : 'bg-white/3 border-white/8 text-gray-300 hover:bg-white/6 hover:text-white'
                                        }`}
                                >
                                    <p className="font-medium text-sm">{rec.skill}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{rec.courses.length} courses · {rec.category}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {mediumPriority.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs text-yellow-400 font-medium px-1 mb-2">🟡 Needs Improvement</p>
                            {mediumPriority.map(rec => (
                                <button
                                    key={rec.skill}
                                    onClick={() => setActiveSkill(rec.skill)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${activeSkill === rec.skill
                                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                            : 'bg-white/3 border-white/8 text-gray-300 hover:bg-white/6 hover:text-white'
                                        }`}
                                >
                                    <p className="font-medium text-sm">{rec.skill}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-gray-800 rounded-full h-1">
                                            <div
                                                className="h-1 rounded-full bg-yellow-400"
                                                style={{ width: `${(rec.userProficiency / rec.requiredProficiency) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{rec.userProficiency}/{rec.requiredProficiency}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Course Panel */}
                <div className="lg:col-span-2">
                    {activeRec ? (
                        <GlassCard>
                            {/* Skill Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-xl font-bold text-white">{activeRec.skill}</h2>
                                        <span className={`badge border text-xs ${priorityConfig[activeRec.priority]?.bg} ${priorityConfig[activeRec.priority]?.color}`}>
                                            {priorityConfig[activeRec.priority]?.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Category: <span className="text-gray-300">{activeRec.category}</span>
                                        {activeRec.type === 'low_proficiency' && (
                                            <> · Current: <span className="text-yellow-400">{activeRec.userProficiency}/10</span> · Target: <span className="text-indigo-400">{activeRec.requiredProficiency}/10</span></>
                                        )}
                                        {activeRec.type === 'missing' && (
                                            <> · Target: <span className="text-indigo-400">{activeRec.requiredProficiency}/10</span></>
                                        )}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Importance</p>
                                    <p className="text-lg font-bold text-indigo-400">{(activeRec.weight * 100).toFixed(0)}%</p>
                                </div>
                            </div>

                            {/* Courses */}
                            {activeRec.courses.length > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-400 mb-2">
                                        {activeRec.courses.length} recommended courses
                                    </p>
                                    {activeRec.courses.map((course, idx) => (
                                        <CourseCard key={idx} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-2xl mb-2">🔍</p>
                                    <p className="text-sm">No specific courses available yet for this skill.</p>
                                    <p className="text-xs mt-1 text-gray-600">Try searching on Coursera or Udemy</p>
                                </div>
                            )}
                        </GlassCard>
                    ) : (
                        <GlassCard className="text-center py-12">
                            <p className="text-gray-400">Select a skill from the sidebar to see course recommendations</p>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}
