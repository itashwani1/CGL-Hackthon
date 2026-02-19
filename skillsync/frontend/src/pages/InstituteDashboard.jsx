import { useState, useEffect } from 'react';
import { instituteAPI } from '../api/api';
import { useLocation, Link } from 'react-router-dom';

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

export default function InstituteDashboard() {
    const location = useLocation();

    // Determine current view based on URL
    const isDashboard = location.pathname === '/institute/dashboard';
    const isStudentsPage = location.pathname.includes('/institute/students');
    const isAnalyticsPage = location.pathname.includes('/institute/analytics');
    const isJobsPage = location.pathname.includes('/institute/jobs');

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

    // Reusable Student List Component
    const StudentList = ({ limit }) => {
        const displayStudents = limit ? filtered.slice(0, limit) : filtered;

        return (
            <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <h2 className="text-lg font-bold text-white">
                        {limit ? 'Recent Students' : `Student Roster (${filtered.length})`}
                    </h2>
                    {!limit && (
                        <input className="glass-input w-full sm:w-64" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
                    )}
                    {limit && (
                        <Link to="/institute/students" className="text-sm text-indigo-400 hover:text-indigo-300">View All →</Link>
                    )}
                </div>
                {displayStudents.length === 0 ? (
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
                                {displayStudents.map(s => {
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
        );
    };

    if (loading) return (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            {/* ── DASHBOARD VIEW ────────────────────────────────────── */}
            {isDashboard && (
                <>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Institute Dashboard</h1>
                        <p className="text-gray-400 mt-1">Overview of student performance and engagement</p>
                    </div>

                    {analytics && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard icon="🎓" label="Registered Students" value={analytics.totalStudents} color="#d97706" />
                            <StatCard icon="⚡" label="Skills Being Tracked" value={analytics.totalSkillsTracked} color="#4f46e5" />
                            <StatCard icon="💼" label="Open Job Postings" value={jobs.filter(j => j.isActive).length} color="#059669" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StudentList limit={5} />

                        {/* Mini Analytics Summary */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Top Skills</h2>
                                <Link to="/institute/analytics" className="text-sm text-indigo-400 hover:text-indigo-300">View Analytics →</Link>
                            </div>
                            <div className="space-y-3">
                                {analytics?.topSkills.slice(0, 5).map((sk, i) => (
                                    <div key={sk.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300 font-medium">{sk.name}</span>
                                            <div className="flex gap-3 text-xs text-gray-400">
                                                <span>{sk.count}</span>
                                                <span className="text-indigo-400">avg {sk.avgProficiency}</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-gray-700">
                                            <div className="h-full rounded-full"
                                                style={{ width: `${(sk.count / analytics.totalStudents) * 100}%`, background: `hsl(${260 - i * 15}, 70%, 60%)` }} />
                                        </div>
                                    </div>
                                ))}
                                {(!analytics?.topSkills || analytics.topSkills.length === 0) && <p className="text-gray-500 text-sm">No data available</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── STUDENTS VIEW ─────────────────────────────────────── */}
            {isStudentsPage && (
                <>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Student Management</h1>
                        <p className="text-gray-400 mt-1">Manage and track all registered students</p>
                    </div>
                    <StudentList />
                </>
            )}

            {/* ── ANALYTICS VIEW ────────────────────────────────────── */}
            {isAnalyticsPage && analytics && (
                <>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Skill Analytics</h1>
                        <p className="text-gray-400 mt-1">Deep dive into student skills and career goals</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Skills Full List */}
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
                </>
            )}

            {/* ── JOB BOARD VIEW ────────────────────────────────────── */}
            {isJobsPage && (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Industry Job Board</h1>
                            <p className="text-gray-400 mt-1">View active job postings from partner companies</p>
                        </div>
                        <span className="text-xs text-gray-400 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)', color: '#6ee7b7' }}>
                            {jobs.length} active postings
                        </span>
                    </div>

                    <div className="glass-card p-6">
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
                </>
            )}
        </div>
    );
}
