import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../api/api';

const SKILL_CATEGORIES = ['Programming', 'Data Science', 'Design', 'Marketing', 'Management', 'DevOps', 'General'];

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

function JobModal({ onClose, onSave, editJob }) {
    const [form, setForm] = useState(editJob || { jobTitle: '', description: '', openings: 1, deadline: '', requiredSkills: [] });
    const [skill, setSkill] = useState({ name: '', minProficiency: 5, category: 'General' });
    const [saving, setSaving] = useState(false);

    const addSkill = () => {
        if (!skill.name.trim()) return;
        setForm(f => ({ ...f, requiredSkills: [...f.requiredSkills, { ...skill }] }));
        setSkill({ name: '', minProficiency: 5, category: 'General' });
    };

    const removeSkill = (i) => setForm(f => ({ ...f, requiredSkills: f.requiredSkills.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        if (!form.jobTitle || form.requiredSkills.length === 0) return;
        setSaving(true);
        await onSave(form);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-xl glass-card p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">{editJob ? 'Edit' : 'Post New'} Job Requirement</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Job Title *</label>
                        <input className="glass-input" placeholder="e.g. Senior React Developer" value={form.jobTitle}
                            onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Description</label>
                        <textarea className="glass-input resize-none h-20" placeholder="Role description..." value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Openings</label>
                            <input type="number" min={1} className="glass-input" value={form.openings}
                                onChange={e => setForm(f => ({ ...f, openings: +e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Deadline</label>
                            <input type="date" className="glass-input" value={form.deadline}
                                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Required Skills *</label>
                        <div className="flex gap-2 mb-2">
                            <input className="glass-input flex-1" placeholder="Skill name" value={skill.name}
                                onChange={e => setSkill(s => ({ ...s, name: e.target.value }))} />
                            <select className="glass-input w-28" value={skill.category}
                                onChange={e => setSkill(s => ({ ...s, category: e.target.value }))}>
                                {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="number" min={1} max={10} className="glass-input w-16 text-center" value={skill.minProficiency}
                                onChange={e => setSkill(s => ({ ...s, minProficiency: +e.target.value }))} />
                            <button onClick={addSkill} className="btn-primary px-3 py-2 text-sm" style={{ background: 'linear-gradient(to right,#059669,#0d9488)' }}>+</button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Min proficiency: 1–10 scale</p>
                        <div className="flex flex-wrap gap-2">
                            {form.requiredSkills.map((s, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm" style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)' }}>
                                    <span className="text-emerald-300">{s.name}</span>
                                    <span className="text-xs text-gray-400">(≥{s.minProficiency})</span>
                                    <button onClick={() => removeSkill(i)} className="text-gray-500 hover:text-red-400 ml-1">✕</button>
                                </div>
                            ))}
                        </div>
                        {form.requiredSkills.length === 0 && <p className="text-xs text-amber-500 mt-1">Add at least one required skill</p>}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                    <button onClick={handleSave} disabled={saving || !form.jobTitle || form.requiredSkills.length === 0}
                        className="btn-primary flex-1" style={{ background: 'linear-gradient(to right,#059669,#0d9488)' }}>
                        {saving ? 'Saving…' : 'Save Job'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CompanyDashboard() {
    const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalStudents: 0 });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [matches, setMatches] = useState([]);
    const [matchLoading, setMatchLoading] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [sRes, jRes] = await Promise.all([companyAPI.getStats(), companyAPI.getJobs()]);
            setStats(sRes.data.stats);
            setJobs(jRes.data.jobs);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSave = async (form) => {
        try {
            if (editJob) await companyAPI.updateJob(editJob._id, form);
            else await companyAPI.createJob(form);
            setShowModal(false); setEditJob(null);
            fetchAll();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job posting?')) return;
        await companyAPI.deleteJob(id);
        fetchAll();
    };

    const handleMatchView = async (job) => {
        setSelectedJob(job); setMatchLoading(true);
        try {
            const res = await companyAPI.getMatches(job._id);
            setMatches(res.data.matches);
        } catch (e) { setMatches([]); }
        setMatchLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
                    <p className="text-gray-400 mt-1">Post job requirements and discover matching talent</p>
                </div>
                <button onClick={() => { setEditJob(null); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2" style={{ background: 'linear-gradient(to right,#059669,#0d9488)' }}>
                    <span className="text-lg">+</span> Post Job
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon="📋" label="Total Postings" value={stats.totalJobs} color="#059669" />
                <StatCard icon="✅" label="Active Postings" value={stats.activeJobs} color="#4f46e5" />
                <StatCard icon="🎓" label="Students on Platform" value={stats.totalStudents} color="#d97706" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Postings */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-white mb-4">My Job Postings</h2>
                    {loading ? (
                        <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="text-gray-400 text-sm">No job postings yet.</p>
                            <button onClick={() => setShowModal(true)} className="mt-3 text-emerald-400 text-sm hover:underline">Post your first requirement →</button>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                            {jobs.map(job => (
                                <div key={job._id} className="p-4 rounded-xl transition-all duration-200 cursor-pointer"
                                    style={{ background: selectedJob?._id === job._id ? 'rgba(5,150,105,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedJob?._id === job._id ? 'rgba(5,150,105,0.4)' : 'rgba(255,255,255,0.08)'}` }}
                                    onClick={() => handleMatchView(job)}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white">{job.jobTitle}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{job.openings} opening{job.openings > 1 ? 's' : ''} · {job.requiredSkills.length} skills required</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {job.requiredSkills.slice(0, 3).map((s, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(5,150,105,0.15)', color: '#6ee7b7' }}>{s.name}</span>
                                                ))}
                                                {job.requiredSkills.length > 3 && <span className="text-[10px] text-gray-500">+{job.requiredSkills.length - 3}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button onClick={(e) => { e.stopPropagation(); setEditJob(job); setShowModal(true); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors">✏️</button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(job._id); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Matched Students */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-white mb-1">Matched Talent</h2>
                    <p className="text-xs text-gray-500 mb-4">Click a job posting to see matching students</p>
                    {!selectedJob ? (
                        <div className="text-center py-10">
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="text-gray-400 text-sm">Select a job posting to see matched students</p>
                        </div>
                    ) : matchLoading ? (
                        <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>
                    ) : matches.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-3xl mb-2">😔</p>
                            <p className="text-gray-400 text-sm">No students match this posting yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                            <p className="text-xs text-gray-400 mb-2">Matches for: <span className="text-white font-medium">{selectedJob.jobTitle}</span></p>
                            {matches.map((s, i) => (
                                <div key={s._id} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                            style={{ background: `linear-gradient(135deg, #4f46e5, #9333ea)` }}>
                                            {s.name[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-white text-sm">{s.name}</p>
                                                <span className="text-sm font-bold" style={{ color: s.matchScore >= 80 ? '#6ee7b7' : s.matchScore >= 50 ? '#fbbf24' : '#f87171' }}>
                                                    {s.matchScore}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">{s.email}</p>
                                            <div className="mt-1.5 h-1.5 rounded-full bg-gray-700">
                                                <div className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${s.matchScore}%`, background: s.matchScore >= 80 ? '#059669' : s.matchScore >= 50 ? '#d97706' : '#dc2626' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && <JobModal onClose={() => { setShowModal(false); setEditJob(null); }} onSave={handleSave} editJob={editJob} />}
        </div>
    );
}
