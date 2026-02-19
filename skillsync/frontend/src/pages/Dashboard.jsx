import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, roleAPI, goalAPI } from '../api/api';
import GlassCard from '../components/GlassCard';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const SKILL_CATEGORIES = ['Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'Data Science', 'AI/ML', 'Design', 'Tools', 'Systems', 'Security', 'Soft Skills', 'General'];

export default function Dashboard() {
    const { user, updateUser } = useAuth();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skillForm, setSkillForm] = useState({ name: '', proficiency: 5, category: 'General' });
    const [careerGoal, setCareerGoal] = useState(user?.careerGoal || '');
    const [savingGoal, setSavingGoal] = useState(false);
    const [addingSkill, setAddingSkill] = useState(false);
    const [toast, setToast] = useState('');
    const [goalPlan, setGoalPlan] = useState(undefined); // undefined = loading, null = no plan

    useEffect(() => {
        roleAPI.getRoles().then(r => setRoles(r.data.roles));
        goalAPI.getMyPlan()
            .then(r => setGoalPlan(r.data.plan || null))
            .catch(() => setGoalPlan(null));
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!skillForm.name.trim()) return;
        setAddingSkill(true);
        try {
            const res = await userAPI.addSkill(skillForm);
            updateUser({ ...user, skills: res.data.skills });
            setSkillForm({ name: '', proficiency: 5, category: 'General' });
            showToast('Skill added successfully!');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error adding skill');
        } finally {
            setAddingSkill(false);
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            const res = await userAPI.deleteSkill(skillId);
            updateUser({ ...user, skills: res.data.skills });
            showToast('Skill removed');
        } catch {
            showToast('Error removing skill');
        }
    };

    const handleSaveGoal = async () => {
        setSavingGoal(true);
        try {
            const res = await userAPI.updateCareerGoal(careerGoal);
            updateUser({ ...user, careerGoal: res.data.user.careerGoal });
            showToast('Career goal updated!');
        } catch {
            showToast('Error saving goal');
        } finally {
            setSavingGoal(false);
        }
    };

    const profAvg = user?.skills?.length
        ? Math.round(user.skills.reduce((s, sk) => s + sk.proficiency, 0) / user.skills.length)
        : 0;

    const selectedRole = roles.find(r => r.name === careerGoal);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            {/* Toast */}
            {toast && (
                <div className="fixed top-20 right-4 z-50 glass-card px-5 py-3 text-sm text-green-400 border-green-500/30 animate-slide-up">
                    ✓ {toast}
                </div>
            )}

            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="text-gray-400 mt-1">Manage your skills and career goals</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Skills Added', value: user?.skills?.length || 0, icon: '⚡', color: 'from-indigo-500 to-purple-600' },
                    { label: 'Avg Proficiency', value: `${profAvg}/10`, icon: '📈', color: 'from-purple-500 to-pink-600' },
                    { label: 'Career Goal', value: user?.careerGoal ? '✓ Set' : 'Not Set', icon: '🎯', color: 'from-pink-500 to-rose-600' },
                    { label: 'Demand Index', value: selectedRole ? `${selectedRole.demandIndex}%` : 'N/A', icon: '🔥', color: 'from-amber-500 to-orange-600' },
                ].map(({ label, value, icon, color }) => (
                    <GlassCard key={label} hover className="text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${color} mb-3 text-lg`}>
                            {icon}
                        </div>
                        <p className="text-2xl font-bold text-white">{value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* ── Goal Plan Section ─────────────────────────────── */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">🚀</span>
                    <h2 className="text-lg font-bold text-white">Goal-Driven Learning Plan</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">NEW</span>
                </div>

                {goalPlan === undefined ? (
                    // Loading state
                    <div className="glass-card flex items-center gap-3 text-gray-400 text-sm" style={{ padding: '20px 24px' }}>
                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        Loading your goal plan...
                    </div>
                ) : goalPlan === null ? (
                    // No plan — CTA to start
                    <div className="rounded-2xl border-2 border-dashed p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <div>
                            <p className="text-white font-bold text-base mb-1">Start Your Personalized Career Roadmap</p>
                            <p className="text-gray-400 text-sm">Choose a goal (Frontend Dev, Data Analyst...) and get a day-by-day plan with tasks, assessments & milestones.</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {['30 Days', '60 Days', '90 Days'].map(t => (
                                    <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">{t}</span>
                                ))}
                                {['Frontend Dev', 'Data Analyst', 'Full Stack'].map(g => (
                                    <span key={g} className="text-[10px] px-2 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/25">{g}</span>
                                ))}
                            </div>
                        </div>
                        <Link to="/goals/setup"
                            className="btn-primary whitespace-nowrap text-sm px-6 py-3 flex items-center gap-2">
                            🚀 Start Goal Plan
                        </Link>
                    </div>
                ) : (
                    // Active plan — show snapshot
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Main info card */}
                        <div className="sm:col-span-2 rounded-2xl p-5 flex items-center gap-4"
                            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.18) 0%, rgba(147,51,234,0.12) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}>
                                {goalPlan.currentLevel === 'beginner' ? '🌱' : goalPlan.currentLevel === 'intermediate' ? '🌿' : goalPlan.currentLevel === 'advanced' ? '🌳' : '🏆'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-white text-base">{goalPlan.goalTitle}</h3>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                                        {goalPlan.currentLevel}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Day <span className="text-white font-semibold">{goalPlan.currentDay}</span> of <span className="text-white font-semibold">{goalPlan.timelineDays}</span>
                                    &nbsp;· <span className="text-amber-400">{Math.max(0, goalPlan.timelineDays - goalPlan.currentDay)} days left</span>
                                </p>
                                {/* Progress bar */}
                                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                                    <div className="h-1.5 rounded-full"
                                        style={{ width: `${Math.round((goalPlan.currentDay / goalPlan.timelineDays) * 100)}%`, background: 'linear-gradient(to right,#4f46e5,#9333ea)' }} />
                                </div>
                            </div>
                        </div>

                        {/* Streak + completion + CTA */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                                    <p className="text-xl font-black text-amber-400">🔥 {goalPlan.streak}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Day Streak</p>
                                </div>
                                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                    <p className="text-xl font-black text-emerald-400">{goalPlan.completionRate}%</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Done</p>
                                </div>
                            </div>
                            <Link to="/goals"
                                className="btn-primary w-full text-center text-sm py-2.5">
                                📅 View Today's Tasks
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column – Skills */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Add Skill Form */}
                    <GlassCard>
                        <h2 className="section-title">Add a Skill</h2>
                        <p className="section-subtitle">Track your technical and soft skills with proficiency levels</p>
                        <form onSubmit={handleAddSkill} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={skillForm.name}
                                    onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                                    className="glass-input flex-1"
                                    placeholder="e.g. React, Python, Docker..."
                                />
                                <select
                                    value={skillForm.category}
                                    onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                                    className="glass-input sm:w-40"
                                >
                                    {SKILL_CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm text-gray-400">Proficiency Level</label>
                                    <span className="text-sm font-semibold text-indigo-400">{skillForm.proficiency} / 10</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={skillForm.proficiency}
                                    onChange={e => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                                    className="w-full accent-indigo-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>Beginner</span><span>Intermediate</span><span>Advanced</span>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" disabled={addingSkill}>
                                {addingSkill ? 'Adding...' : '+ Add Skill'}
                            </button>
                        </form>
                    </GlassCard>

                    {/* Skills List */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="section-title mb-0">My Skills</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{user?.skills?.length || 0} skills tracked</p>
                            </div>
                            {user?.careerGoal && (
                                <Link to="/gap-analysis" className="btn-secondary text-xs px-3 py-1.5 rounded-lg">
                                    View Gap Analysis →
                                </Link>
                            )}
                        </div>
                        {!user?.skills?.length ? (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-3xl mb-2">🛠️</p>
                                <p>No skills added yet. Add your first skill above!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {user.skills.map(skill => (
                                    <SkillBadge key={skill._id} skill={skill} onDelete={handleDeleteSkill} />
                                ))}
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Right Column – Career Goal */}
                <div className="space-y-6">
                    <GlassCard>
                        <h2 className="section-title">Career Goal</h2>
                        <p className="section-subtitle">Select your target role</p>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {roles.map(role => (
                                <button
                                    key={role._id}
                                    onClick={() => setCareerGoal(role.name)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${careerGoal === role.name
                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                                        : 'bg-white/3 border-white/8 text-gray-300 hover:bg-white/6 hover:text-white'
                                        }`}
                                >
                                    <p className="font-medium text-sm">{role.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{role.category} • Demand: {role.demandIndex}%</p>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveGoal}
                            className="btn-primary w-full mt-4"
                            disabled={savingGoal || !careerGoal}
                        >
                            {savingGoal ? 'Saving...' : 'Save Career Goal'}
                        </button>
                    </GlassCard>

                    {/* Selected Role Info */}
                    {selectedRole && (
                        <GlassCard className="border-indigo-500/20">
                            <h3 className="text-sm font-semibold text-indigo-300 mb-3">Role Overview</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Salary Range</span>
                                    <span className="text-white font-medium">
                                        ${selectedRole.salaryRange.min.toLocaleString()} – ${selectedRole.salaryRange.max.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Market Demand</span>
                                    <span className="text-green-400 font-medium">{selectedRole.demandIndex}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Level</span>
                                    <span className="text-white">{selectedRole.experienceLevel}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Skills Required</span>
                                    <span className="text-white">{selectedRole.requiredSkills ? selectedRole.requiredSkills.length : '—'}</span>
                                </div>
                            </div>
                            <Link to="/gap-analysis" className="btn-primary w-full mt-4 block text-center text-sm">
                                Run Gap Analysis →
                            </Link>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}
