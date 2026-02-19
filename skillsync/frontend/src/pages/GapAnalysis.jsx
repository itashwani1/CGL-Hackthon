import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../api/api';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const FIT_LABEL = (score) => {
    if (score >= 80) return { label: 'Strong Fit', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' };
    if (score >= 55) return { label: 'Moderate Fit', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
    return { label: 'Needs Work', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' };
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        return (
            <div className="glass-card px-3 py-2 text-xs">
                <p className="font-semibold text-white">{payload[0].payload.skill}</p>
                <p className="text-indigo-400">You: {payload[0].payload.user}/10</p>
                <p className="text-purple-400">Required: {payload[0].payload.required}/10</p>
            </div>
        );
    }
    return null;
};

export default function GapAnalysis() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.careerGoal) { setLoading(false); return; }
        analysisAPI.getGapAnalysis()
            .then(res => setData(res.data))
            .catch(err => setError(err.response?.data?.message || 'Could not load analysis'))
            .finally(() => setLoading(false));
    }, [user?.careerGoal]);

    if (!user?.careerGoal) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 text-center">
                <GlassCard className="max-w-md mx-auto">
                    <div className="text-5xl mb-4">🎯</div>
                    <h2 className="text-xl font-bold text-white mb-2">No Career Goal Set</h2>
                    <p className="text-gray-400 text-sm mb-6">Set a career goal on your dashboard to run gap analysis</p>
                    <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
                </GlassCard>
            </div>
        );
    }

    if (loading) return <LoadingSpinner text="Running gap analysis..." />;
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 pt-16 text-center">
                <GlassCard className="max-w-md mx-auto">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-red-400 font-medium">{error}</p>
                    <Link to="/dashboard" className="btn-secondary mt-4 inline-block">← Back to Dashboard</Link>
                </GlassCard>
            </div>
        );
    }

    const { role, analysis } = data || {};
    const fitInfo = FIT_LABEL(analysis?.fitScore || 0);

    // Build radar chart data from all required skills
    const radarData = [
        ...analysis.matchedSkills.map(s => ({ skill: s.skill, user: s.userProficiency, required: s.requiredProficiency, status: 'matched' })),
        ...analysis.lowProficiencySkills.map(s => ({ skill: s.skill, user: s.userProficiency, required: s.requiredProficiency, status: 'low' })),
        ...analysis.missingSkills.map(s => ({ skill: s.skill, user: 0, required: s.minimumProficiency, status: 'missing' })),
    ];

    // Bar chart data
    const barData = radarData.map(d => ({
        skill: d.skill.length > 10 ? d.skill.slice(0, 9) + '…' : d.skill,
        fullSkill: d.skill,
        user: d.user,
        required: d.required,
        gap: Math.max(0, d.required - d.user),
        status: d.status,
    }));

    const getBarColor = (status) => {
        if (status === 'matched') return '#4ade80';
        if (status === 'low') return '#facc15';
        return '#f87171';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gap Analysis</h1>
                    <p className="text-gray-400 mt-1">
                        You vs <span className="text-indigo-300 font-medium">{role?.name}</span>
                    </p>
                </div>
                <Link to="/recommendations" className="btn-primary text-center">
                    View Recommendations →
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Fit Score', value: `${analysis.fitScore}%`, icon: '🏆', extra: fitInfo.label, textColor: fitInfo.color },
                    { label: 'Skills Matched', value: analysis.totalMatched, icon: '✅', textColor: 'text-green-400' },
                    { label: 'Low Proficiency', value: analysis.totalLow, icon: '⚡', textColor: 'text-yellow-400' },
                    { label: 'Missing Skills', value: analysis.totalMissing, icon: '❌', textColor: 'text-red-400' },
                ].map(({ label, value, icon, extra, textColor }) => (
                    <GlassCard key={label} className="text-center">
                        <div className="text-2xl mb-1">{icon}</div>
                        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                        <p className="text-xs text-gray-400">{label}</p>
                        {extra && <p className={`text-xs font-semibold mt-1 ${textColor}`}>{extra}</p>}
                    </GlassCard>
                ))}
            </div>

            {/* Fit Score Bar */}
            <GlassCard className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-lg font-bold text-white">Overall Fit Score</h2>
                        <p className="text-xs text-gray-400">Weighted skill match against {role?.name}</p>
                    </div>
                    <span className={`badge border text-sm font-bold px-4 py-1.5 ${fitInfo.bg} ${fitInfo.color}`}>
                        {analysis.fitScore}%
                    </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-1000 ${analysis.fitScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                : analysis.fitScore >= 55 ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                                    : 'bg-gradient-to-r from-red-500 to-rose-400'
                            }`}
                        style={{ width: `${analysis.fitScore}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span><span>50%</span><span>100%</span>
                </div>
            </GlassCard>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Radar Chart */}
                <GlassCard>
                    <h2 className="text-lg font-bold text-white mb-4">Skill Radar</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                            <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                            <Radar name="Required" dataKey="required" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.1} strokeDasharray="6 3" />
                            <Radar name="You" dataKey="user" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 justify-center mt-2 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-400 inline-block rounded" /> Your Level</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 inline-block rounded border-dashed border-t border-purple-400" /> Required</span>
                    </div>
                </GlassCard>

                {/* Bar Chart */}
                <GlassCard>
                    <h2 className="text-lg font-bold text-white mb-4">Skill Comparison</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 9 }} angle={-35} textAnchor="end" />
                            <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="user" name="Your Level" radius={[4, 4, 0, 0]}>
                                {barData.map((entry, i) => (
                                    <Cell key={i} fill={getBarColor(entry.status)} fillOpacity={0.8} />
                                ))}
                            </Bar>
                            <Bar dataKey="required" name="Required" fill="rgba(167,139,250,0.25)" stroke="#a78bfa" strokeWidth={1} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* Skills Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Missing Skills */}
                <GlassCard className="border-red-500/15">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Missing Skills ({analysis.totalMissing})
                    </h3>
                    {analysis.missingSkills.length ? analysis.missingSkills.map(s => (
                        <div key={s.skill} className="py-2.5 border-b border-white/5 last:border-0">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-white font-medium">{s.skill}</span>
                                <span className="badge bg-red-500/15 text-red-400 border border-red-500/30 text-xs">Need {s.minimumProficiency}/10</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Weight: {(s.weight * 100).toFixed(0)}% · {s.category}</p>
                        </div>
                    )) : <p className="text-green-400 text-sm">🎉 No missing skills!</p>}
                </GlassCard>

                {/* Low Proficiency Skills */}
                <GlassCard className="border-yellow-500/15">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Needs Improvement ({analysis.totalLow})
                    </h3>
                    {analysis.lowProficiencySkills.length ? analysis.lowProficiencySkills.map(s => (
                        <div key={s.skill} className="py-2.5 border-b border-white/5 last:border-0">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-white font-medium">{s.skill}</span>
                                <span className="badge bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-xs">
                                    {s.userProficiency} → {s.requiredProficiency}
                                </span>
                            </div>
                            <div className="mt-1.5 w-full bg-gray-800 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: `${(s.userProficiency / s.requiredProficiency) * 100}%` }} />
                            </div>
                        </div>
                    )) : <p className="text-green-400 text-sm">✓ All skills meet minimum level!</p>}
                </GlassCard>

                {/* Matched Skills */}
                <GlassCard className="border-green-500/15">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Skills Matched ({analysis.totalMatched})
                    </h3>
                    {analysis.matchedSkills.length ? analysis.matchedSkills.map(s => (
                        <div key={s.skill} className="py-2.5 border-b border-white/5 last:border-0 flex justify-between items-center">
                            <span className="text-sm text-white font-medium">{s.skill}</span>
                            <span className="badge bg-green-500/15 text-green-400 border border-green-500/30 text-xs">{s.userProficiency}/10</span>
                        </div>
                    )) : <p className="text-gray-400 text-sm">Add skills to see matches</p>}
                </GlassCard>
            </div>

            {/* Role Info Banner */}
            {role && (
                <GlassCard className="border-indigo-500/20">
                    <div className="flex flex-wrap gap-6 items-center">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Target Role</p>
                            <p className="text-white font-bold text-lg">{role.name}</p>
                            <p className="text-indigo-300 text-sm">{role.category} · {role.experienceLevel}</p>
                        </div>
                        <div className="flex gap-6 flex-wrap">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Salary Range</p>
                                <p className="text-white font-semibold">${role.salaryRange.min.toLocaleString()} – ${role.salaryRange.max.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Market Demand</p>
                                <p className="text-green-400 font-semibold">{role.demandIndex}% High</p>
                            </div>
                            {role.topCompanies?.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Top Companies</p>
                                    <p className="text-gray-300 text-sm">{role.topCompanies.slice(0, 3).join(', ')}</p>
                                </div>
                            )}
                        </div>
                        <div className="ml-auto">
                            <Link to="/recommendations" className="btn-primary">Get Course Recommendations →</Link>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
