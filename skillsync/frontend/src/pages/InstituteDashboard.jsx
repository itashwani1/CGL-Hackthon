import { useState, useEffect } from 'react';
import { instituteAPI } from '../api/api';

function StatCard({ icon, label, value, color }) {
    return (
        <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>{icon}</div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );
}

const TABS = ['Students', 'Analytics', 'Job Board'];

export default function InstituteDashboard() {
    const [activeTab, setActiveTab] = useState('Students');
    const [students, setStudents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [sRes, aRes, jRes] = await Promise.all([
                    instituteAPI.getStudents(),
                    instituteAPI.getAnalytics(),
                    instituteAPI.getJobBoard(),
                ]);
                setStudents(sRes.data.students);
                setAnalytics(aRes.data.analytics);
                setJobs(jRes.data.jobs);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Institute Dashboard</h1>
                <p className="text-gray-400 mt-1">Monitor students, view skill analytics & connect with industry</p>
            </div>

            {/* Stats */}
            {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon="🎓" label="Registered Students" value={analytics.totalStudents} color="#d97706" />
                    <StatCard icon="⚡" label="Skills Being Tracked" value={analytics.totalSkillsTracked} color="#4f46e5" />
                    <StatCard icon="💼" label="Open Job Postings" value={jobs.filter(j => j.isActive).length} color="#059669" />
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', maxWidth: '100%' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={activeTab === tab ? {
                            background: 'linear-gradient(135deg, rgba(217,119,6,0.3), rgba(147,51,234,0.2))',
                            color: '#fff', border: '1px solid rgba(217,119,6,0.4)',
                            boxShadow: '0 2px 12px rgba(217,119,6,0.2)',
                        } : { color: '#9ca3af' }}>
                        {tab === 'Students' ? '🎓' : tab === 'Analytics' ? '📊' : '💼'} {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>
            ) : (
                <>
                    {/* Students Tab */}
                    {activeTab === 'Students' && (
                        <div className="glass-card p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                                <h2 className="text-lg font-bold text-white">Student Roster ({filtered.length})</h2>
                                <input className="glass-input w-full sm:w-64" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            {filtered.length === 0 ? (
                                <div className="text-center py-8"><p className="text-gray-400">No students found</p></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                                {['Student', 'Career Goal', 'Skills', 'Top Skill', 'Joined'].map(h => (
                                                    <th key={h} className="text-left py-2 pr-4 text-gray-400 font-medium">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map(s => {
                                                const topSkill = s.skills.reduce((best, sk) => sk.proficiency > (best?.proficiency || 0) ? sk : best, null);
                                                return (
                                                    <tr key={s._id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                                        <td className="py-3 pr-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                                    style={{ background: 'linear-gradient(135deg,#4f46e5,#9333ea)' }}>
                                                                    {s.name[0]?.toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-white">{s.name}</p>
                                                                    <p className="text-xs text-gray-500">{s.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 pr-4 text-gray-300">{s.careerGoal || <span className="text-gray-600">—</span>}</td>
                                                        <td className="py-3 pr-4">
                                                            <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(79,70,229,0.15)', color: '#a5b4fc' }}>
                                                                {s.skills.length} skills
                                                            </span>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            {topSkill ? (
                                                                <span className="text-xs text-emerald-400">{topSkill.name} <span className="text-gray-500">({topSkill.proficiency}/10)</span></span>
                                                            ) : <span className="text-gray-600">—</span>}
                                                        </td>
                                                        <td className="py-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'Analytics' && analytics && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Skills */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold text-white mb-4">Top Skills Among Students</h2>
                                <div className="space-y-3">
                                    {analytics.topSkills.map((sk, i) => (
                                        <div key={sk.name}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300 font-medium">{sk.name}</span>
                                                <div className="flex gap-3 text-xs text-gray-400">
                                                    <span>{sk.count} students</span>
                                                    <span className="text-indigo-400">avg {sk.avgProficiency}/10</span>
                                                </div>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-700">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${(sk.count / analytics.totalStudents) * 100}%`, background: `hsl(${260 - i * 15}, 70%, 60%)` }} />
                                            </div>
                                        </div>
                                    ))}
                                    {analytics.topSkills.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No skills data yet</p>}
                                </div>
                            </div>

                            {/* Career Goals */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold text-white mb-4">Career Goal Distribution</h2>
                                <div className="space-y-3">
                                    {analytics.careerGoals.map((g, i) => (
                                        <div key={g.goal}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300 font-medium truncate max-w-52">{g.goal}</span>
                                                <span className="text-gray-400 text-xs">{g.count} student{g.count > 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-700">
                                                <div className="h-full rounded-full"
                                                    style={{ width: `${(g.count / analytics.totalStudents) * 100}%`, background: `hsl(${30 + i * 20}, 75%, 55%)` }} />
                                            </div>
                                        </div>
                                    ))}
                                    {analytics.careerGoals.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No career goals set yet</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Board Tab */}
                    {activeTab === 'Job Board' && (
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Industry Job Board</h2>
                                <span className="text-xs text-gray-400 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)', color: '#6ee7b7' }}>
                                    {jobs.length} active postings
                                </span>
                            </div>
                            {jobs.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-3xl mb-2">💼</p>
                                    <p className="text-gray-400 text-sm">No company job postings yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {jobs.map(job => (
                                        <div key={job._id} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-white">{job.jobTitle}</h4>
                                                    <p className="text-xs text-amber-400 font-medium">{job.postedBy?.organizationName || job.postedBy?.name}</p>
                                                    <p className="text-xs text-gray-500">{job.postedBy?.industry} · {job.postedBy?.location}</p>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(5,150,105,0.15)', color: '#6ee7b7', border: '1px solid rgba(5,150,105,0.25)' }}>
                                                    {job.openings} openings
                                                </span>
                                            </div>
                                            {job.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{job.description}</p>}
                                            <div className="flex flex-wrap gap-1.5">
                                                {job.requiredSkills.map((s, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,70,229,0.15)', color: '#a5b4fc', border: '1px solid rgba(79,70,229,0.25)' }}>
                                                        {s.name} ≥{s.minProficiency}
                                                    </span>
                                                ))}
                                            </div>
                                            {job.deadline && (
                                                <p className="text-xs text-gray-500 mt-2">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
