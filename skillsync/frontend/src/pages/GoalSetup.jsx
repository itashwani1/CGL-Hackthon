import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalAPI } from '../api/api';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TIMELINE_OPTIONS = [
    { days: 30, label: '30 Days', desc: 'Intensive sprint', color: '#ef4444', emoji: '⚡' },
    { days: 60, label: '60 Days', desc: 'Balanced pace', color: '#f59e0b', emoji: '🎯' },
    { days: 90, label: '90 Days', desc: 'Steady growth', color: '#10b981', emoji: '🚀' },
    { days: 120, label: '120 Days', desc: 'Deep mastery', color: '#6366f1', emoji: '💎' },
];

const CATEGORY_COLORS = {
    'Frontend': '#6366f1',
    'Data Science': '#10b981',
    'Backend': '#f59e0b',
    'Full Stack': '#a855f7',
    'AI/ML': '#ec4899',
};

export default function GoalSetup() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('');
    const [days, setDays] = useState(90);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState('');
    const [autoAddedSkills, setAutoAddedSkills] = useState([]);

    useEffect(() => {
        goalAPI.getTemplates()
            .then(r => setTemplates(r.data.templates))
            .catch(() => setError('Failed to load goal templates'))
            .finally(() => setLoading(false));
    }, []);

    const handleStart = async () => {
        if (!selected) return;
        setStarting(true);
        setError('');
        try {
            const res = await goalAPI.startGoal({ goalTitle: selected, timelineDays: days });
            // Show which skills were auto-added briefly then navigate
            if (res.data.autoAddedSkills?.length > 0) {
                setAutoAddedSkills(res.data.autoAddedSkills);
                setTimeout(() => navigate('/goals'), 2200);
            } else {
                navigate('/goals');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start goal');
        } finally {
            setStarting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading goal templates..." />;

    const selectedTemplate = templates.find(t => t.name === selected);
    const selectedTimeline = TIMELINE_OPTIONS.find(t => t.days === days);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            {/* Header */}
            <div className="text-center mb-10 animate-fade-in">
                <div className="text-5xl mb-4">🎯</div>
                <h1 className="text-4xl font-black text-white mb-3">
                    Set Your <span className="gradient-text">Career Goal</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Choose your target role and timeline. We'll build a personalized day-by-day plan to get you industry-ready.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Auto-skill toast */}
            {autoAddedSkills.length > 0 && (
                <div className="fixed top-20 right-4 z-50 animate-fade-in" style={{ maxWidth: 340 }}>
                    <div className="p-4 rounded-2xl border border-green-500/40" style={{ background: 'rgba(16,185,129,0.12)', backdropFilter: 'blur(20px)' }}>
                        <p className="text-green-400 font-bold text-sm mb-2">✅ Skills Auto-Added to Your Profile!</p>
                        <div className="flex flex-wrap gap-1.5">
                            {autoAddedSkills.map(s => (
                                <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/25">{s}</span>
                            ))}
                        </div>
                        <p className="text-gray-400 text-xs mt-2">Redirecting to your Goal Dashboard...</p>
                    </div>
                </div>
            )}

            {/* Step 1 — Choose Goal */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h2 className="text-lg font-bold text-white">Choose Your Career Goal</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map(t => {
                        const color = CATEGORY_COLORS[t.category] || '#6366f1';
                        const isSelected = selected === t.name;
                        return (
                            <button key={t.name} onClick={() => setSelected(t.name)}
                                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                                style={{
                                    background: isSelected ? `${color}15` : 'rgba(255,255,255,0.04)',
                                    borderColor: isSelected ? color : 'rgba(255,255,255,0.10)',
                                    boxShadow: isSelected ? `0 0 20px ${color}25` : 'none',
                                }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                                        {t.category === 'Frontend' ? '🎨' : t.category === 'Data Science' ? '📊' : t.category === 'Backend' ? '⚙️' : t.category === 'Full Stack' ? '🌐' : '🤖'}
                                    </div>
                                    {isSelected && <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${color}25`, color }}> ✓ Selected</span>}
                                </div>
                                <h3 className="font-bold text-white text-base mb-1">{t.name}</h3>
                                <p className="text-xs font-medium mb-3" style={{ color }}>{t.category}</p>
                                <div className="flex flex-wrap gap-1">
                                    {t.skills.slice(0, 4).map(s => (
                                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full text-gray-400"
                                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            {s}
                                        </span>
                                    ))}
                                    {t.skills.length > 4 && <span className="text-[10px] text-gray-500">+{t.skills.length - 4} more</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step 2 — Choose Timeline */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h2 className="text-lg font-bold text-white">Choose Your Timeline</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIMELINE_OPTIONS.map(opt => {
                        const isActive = days === opt.days;
                        return (
                            <button key={opt.days} onClick={() => setDays(opt.days)}
                                className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                                style={{
                                    background: isActive ? `${opt.color}15` : 'rgba(255,255,255,0.04)',
                                    borderColor: isActive ? opt.color : 'rgba(255,255,255,0.10)',
                                    boxShadow: isActive ? `0 0 16px ${opt.color}25` : 'none',
                                }}>
                                <div className="text-2xl mb-2">{opt.emoji}</div>
                                <div className="font-bold text-white text-lg">{opt.label}</div>
                                <div className="text-xs text-gray-400 mt-1">{opt.desc}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Preview + Start */}
            {selected && (
                <GlassCard className="border-indigo-500/20 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Your goal plan</p>
                            <h3 className="text-xl font-bold text-white">{selected}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                <span style={{ color: selectedTimeline?.color }}>{days} days</span> · 4 levels · ~{Math.round(days * 1)} tasks · Daily adaptive tasks
                            </p>
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((lvl, i) => (
                                    <span key={lvl} className="text-xs px-3 py-1 rounded-full text-gray-300"
                                        style={{ background: ['rgba(99,102,241,0.15)', 'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)', 'rgba(168,85,247,0.15)'][i], border: `1px solid ${['rgba(99,102,241,0.3)', 'rgba(16,185,129,0.3)', 'rgba(245,158,11,0.3)', 'rgba(168,85,247,0.3)'][i]}` }}>
                                        {lvl} · ~{Math.round([0.25, 0.30, 0.25, 0.20][i] * days)} days
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleStart} disabled={starting}
                            className="btn-primary whitespace-nowrap px-8 py-4 text-base font-bold">
                            {starting ? '⏳ Creating Plan...' : '🚀 Start My Journey'}
                        </button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
