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
    'Custom': '#14b8a6',
};

const CUSTOM_KEY = '__custom__';

export default function GoalSetup() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('');
    const [days, setDays] = useState(90);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState('');
    const [autoAddedSkills, setAutoAddedSkills] = useState([]);

    // Custom goal state
    const [customTitle, setCustomTitle] = useState('');
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [customSkills, setCustomSkills] = useState([]);

    const isCustom = selected === CUSTOM_KEY;

    useEffect(() => {
        goalAPI.getTemplates()
            .then(r => setTemplates(r.data.templates))
            .catch(() => setError('Failed to load goal templates'))
            .finally(() => setLoading(false));
    }, []);

    const addCustomSkill = () => {
        const trimmed = customSkillInput.trim();
        if (!trimmed || customSkills.includes(trimmed)) return;
        setCustomSkills(prev => [...prev, trimmed]);
        setCustomSkillInput('');
    };

    const removeCustomSkill = (skill) => setCustomSkills(prev => prev.filter(s => s !== skill));

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCustomSkill(); }
    };

    const handleStart = async () => {
        if (!selected) return;
        if (isCustom && !customTitle.trim()) { setError('Please enter a goal title'); return; }
        if (isCustom && customSkills.length === 0) { setError('Add at least one skill'); return; }

        setStarting(true);
        setError('');
        try {
            const payload = isCustom
                ? { goalTitle: customTitle.trim(), timelineDays: days, customSkills }
                : { goalTitle: selected, timelineDays: days };

            const res = await goalAPI.startGoal(payload);
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
    const displayTitle = isCustom ? (customTitle.trim() || 'Custom Goal') : selected;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            {/* Header */}
            <div className="text-center mb-10 animate-fade-in">
                <div className="text-5xl mb-4">🎯</div>
                <h1 className="text-4xl font-black text-white mb-3">
                    Set Your <span className="gradient-text">Career Goal</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Choose a template or create your own custom goal with the skills you want to learn.
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
                    {/* Template Cards */}
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

                    {/* ── Custom Goal Card ─────────────────────── */}
                    <button onClick={() => setSelected(CUSTOM_KEY)}
                        className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${isCustom ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                        style={{
                            background: isCustom ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.04)',
                            borderColor: isCustom ? '#14b8a6' : 'rgba(255,255,255,0.10)',
                            boxShadow: isCustom ? '0 0 20px rgba(20,184,166,0.2)' : 'none',
                            borderStyle: 'dashed',
                        }}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.35)' }}>
                                ✏️
                            </div>
                            {isCustom && <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(20,184,166,0.2)', color: '#14b8a6' }}> ✓ Selected</span>}
                        </div>
                        <h3 className="font-bold text-white text-base mb-1">Custom Goal</h3>
                        <p className="text-xs font-medium mb-3" style={{ color: '#14b8a6' }}>Your Choice</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Define your own career goal and manually add the skills you want to master. Perfect for unique paths!
                        </p>
                    </button>
                </div>

                {/* ── Custom Goal Inline Form ───────────────────── */}
                {isCustom && (
                    <div className="mt-5 animate-fade-in rounded-2xl p-5 space-y-4"
                        style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.25)' }}>
                        <h3 className="text-sm font-bold text-teal-400 mb-1">✏️ Define Your Custom Goal</h3>

                        {/* Goal Title */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">Goal Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={e => setCustomTitle(e.target.value)}
                                placeholder="e.g. Mobile App Developer, Game Developer, DevOps Engineer..."
                                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(20,184,166,0.3)',
                                    focusRingColor: '#14b8a6',
                                }}
                            />
                        </div>

                        {/* Skills Input */}
                        <div>
                            <label className="text-xs text-gray-400 mb-1.5 block">
                                Skills to Learn <span className="text-gray-600">(press Enter or comma to add)</span>
                                <span className="text-red-400 ml-1">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customSkillInput}
                                    onChange={e => setCustomSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="e.g. Python, Docker, Kubernetes..."
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(20,184,166,0.3)' }}
                                />
                                <button onClick={addCustomSkill}
                                    className="px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg,#14b8a6,#0891b2)', color: '#fff' }}>
                                    + Add
                                </button>
                            </div>

                            {/* Skill Tags */}
                            {customSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {customSkills.map(skill => (
                                        <span key={skill} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                                            style={{ background: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.35)' }}>
                                            {skill}
                                            <button onClick={() => removeCustomSkill(skill)}
                                                className="hover:text-red-400 transition-colors font-bold ml-0.5 leading-none">
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            {customSkills.length === 0 && (
                                <p className="text-xs text-gray-600 mt-2">No skills added yet. Add at least one skill to continue.</p>
                            )}
                        </div>

                        {/* Quick-add popular skills */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Quick add popular skills:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {['Python', 'Docker', 'Kubernetes', 'AWS', 'Flutter', 'Swift', 'Kotlin', 'Unity', 'Figma', 'GraphQL', 'Redis', 'Rust'].map(s => (
                                    <button key={s} onClick={() => { if (!customSkills.includes(s)) setCustomSkills(p => [...p, s]); }}
                                        className={`text-[10px] px-2.5 py-1 rounded-full transition-all border ${customSkills.includes(s) ? 'opacity-40 cursor-not-allowed' : 'hover:border-teal-500/50 hover:text-teal-400'}`}
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}
                                        disabled={customSkills.includes(s)}>
                                        {customSkills.includes(s) ? '✓ ' : '+ '}{s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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
                            <h3 className="text-xl font-bold text-white">
                                {displayTitle}
                                {isCustom && customSkills.length > 0 && (
                                    <span className="ml-2 text-sm font-medium text-teal-400">({customSkills.length} skills)</span>
                                )}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                <span style={{ color: selectedTimeline?.color }}>{days} days</span> · 4 levels · ~{Math.round(days * 1)} tasks · Daily adaptive tasks
                            </p>
                            {isCustom && customSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {customSkills.map(s => (
                                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(20,184,166,0.12)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.3)' }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {!isCustom && (
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((lvl, i) => (
                                        <span key={lvl} className="text-xs px-3 py-1 rounded-full text-gray-300"
                                            style={{ background: ['rgba(99,102,241,0.15)', 'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)', 'rgba(168,85,247,0.15)'][i], border: `1px solid ${['rgba(99,102,241,0.3)', 'rgba(16,185,129,0.3)', 'rgba(245,158,11,0.3)', 'rgba(168,85,247,0.3)'][i]}` }}>
                                            {lvl} · ~{Math.round([0.25, 0.30, 0.25, 0.20][i] * days)} days
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={handleStart} disabled={starting || (isCustom && (!customTitle.trim() || customSkills.length === 0))}
                            className="btn-primary whitespace-nowrap px-8 py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                            {starting ? '⏳ Creating Plan...' : '🚀 Start My Journey'}
                        </button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
