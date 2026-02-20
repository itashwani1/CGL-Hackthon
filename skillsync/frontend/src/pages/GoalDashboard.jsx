import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { goalAPI } from '../api/api';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import QuizModal from '../components/QuizModal';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';

/* ── Helper Functions ─────────────────────────────────── */
const LEVEL_COLORS = {
    beginner: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)', text: '#818cf8', dot: '#6366f1' },
    intermediate: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399', dot: '#10b981' },
    advanced: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24', dot: '#f59e0b' },
    professional: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#c084fc', dot: '#a855f7' },
};

const TYPE_CONFIG = {
    concept: { icon: '📖', label: 'Concept Learning', color: '#6366f1' },
    practice: { icon: '💻', label: 'Practice Exercise', color: '#10b981' },
    project: { icon: '🛠️', label: 'Mini Project', color: '#f59e0b' },
    assessment: { icon: '📝', label: 'Skill Assessment', color: '#a855f7' },
    revision: { icon: '🔄', label: 'Revision Task', color: '#ef4444' },
};

function CircleProgress({ value, size = 100, strokeWidth = 9, color = '#6366f1' }) {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
    );
}

function TaskCard({ task, onStartQuiz }) {
    const cfg = TYPE_CONFIG[task.type] || TYPE_CONFIG.concept;
    const lvlCfg = LEVEL_COLORS[task.level] || LEVEL_COLORS.beginner;
    const isDone = task.status === 'completed';
    const isMissed = task.status === 'missed';

    return (
        <div className={`p-4 rounded-2xl border transition-all duration-200 ${isDone ? 'opacity-60' : ''}`}
            style={{
                background: isDone ? 'rgba(16,185,129,0.06)' : isMissed ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
                borderColor: isDone ? 'rgba(16,185,129,0.25)' : isMissed ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
            }}>
            {/* Top row */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}35` }}>
                    {isDone ? '✅' : isMissed ? '❌' : cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h4 className="font-semibold text-white text-sm leading-snug">{task.title}</h4>
                        <div className="flex gap-1.5 flex-shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ background: lvlCfg.bg, color: lvlCfg.text, border: `1px solid ${lvlCfg.border}` }}>
                                {task.level}
                            </span>
                            {task.type === 'revision' && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                                    +Revision
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>⏱ {task.estimatedMinutes}min</span>
                        <span>🎯 Difficulty: {task.difficulty}/10</span>
                        {task.score && <span className="text-green-400 font-medium">Score: {task.score}%</span>}
                    </div>
                </div>
            </div>

            {/* Assessment Button */}
            {!isDone && !isMissed && (
                <button onClick={() => onStartQuiz(task._id)}
                    className="mt-3 w-full py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                    style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)' }}>
                    Start Assessment 📝
                </button>
            )}

            {isDone && (
                <div className="mt-2 text-center text-xs text-green-400 font-medium bg-green-500/10 py-1.5 rounded-lg border border-green-500/20">
                    Assessment Passed ✅
                </div>
            )}
        </div>
    );
}

/* ── Main Dashboard ───────────────────────────────────── */
export default function GoalDashboard() {
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [todayTasks, setTodayTasks] = useState([]);
    const [progress, setProgress] = useState(null);
    const [notifs, setNotifs] = useState([]);
    const [discipline, setDiscipline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Today');
    const [showNotifs, setShowNotifs] = useState(false);
    const [quizTask, setQuizTask] = useState(null);

    const TABS = ['Today', 'Progress', 'Levels'];

    const fetchAll = useCallback(async () => {
        try {
            const [planRes, progRes, discRes] = await Promise.all([
                goalAPI.getMyPlan(), goalAPI.getProgress(), goalAPI.getDiscipline()
            ]);
            if (!planRes.data.plan) { navigate('/goals/setup'); return; }
            setPlan(planRes.data.plan);
            setTodayTasks(planRes.data.todayTasks || []);
            setNotifs(planRes.data.unreadNotifs || []);
            setProgress(progRes.data.progress);
            setDiscipline(discRes.data.discipline);
        } catch {
            navigate('/goals/setup');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleQuizStart = (taskId) => {
        setQuizTask(taskId);
    };

    const handleQuizSuccess = async (result) => {
        setQuizTask(null);
        await fetchAll();
    };

    const handleDismissNotifs = async () => {
        await goalAPI.markNotificationsRead();
        setNotifs([]);
        setShowNotifs(false);
    };

    const handleReset = async () => {
        if (!window.confirm('Reset your goal plan? This cannot be undone.')) return;
        await goalAPI.resetGoal();
        navigate('/goals/setup');
    };

    if (loading) return <LoadingSpinner text="Loading your goal dashboard..." />;

    const lvlCfg = LEVEL_COLORS[plan?.currentLevel] || LEVEL_COLORS.beginner;
    const todayDone = todayTasks.filter(t => t.status === 'completed').length;
    const todayTotal = todayTasks.length;
    const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;
    const daysLeft = progress?.daysLeft || 0;
    const overallPct = Math.round(((progress?.currentDay || 1) / (progress?.timelineDays || 90)) * 100);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">

            <QuizModal
                taskId={quizTask}
                isOpen={!!quizTask}
                onClose={() => setQuizTask(null)}
                onSuccess={handleQuizSuccess}
            />

            {/* ── Notification Banner ─────────────────────── */}
            {notifs.length > 0 && (
                <div className="mb-4 animate-fade-in">
                    <button onClick={() => setShowNotifs(!showNotifs)}
                        className="w-full p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-indigo-300 font-medium">
                            🔔 {notifs.length} new notification{notifs.length > 1 ? 's' : ''}
                        </span>
                        <span className="text-gray-400">{showNotifs ? '▲ Hide' : '▼ View'}</span>
                    </button>
                    {showNotifs && (
                        <div className="mt-2 space-y-2 animate-fade-in">
                            {notifs.map((n, i) => (
                                <div key={i} className="p-3 rounded-xl text-sm glass-card" style={{ padding: '12px 16px' }}>
                                    {n.message}
                                </div>
                            ))}
                            <button onClick={handleDismissNotifs} className="text-xs text-gray-500 hover:text-gray-300 ml-1">
                                Dismiss all
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Header ─────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-black text-white">{plan?.goalTitle}</h1>
                        <span className="text-sm px-3 py-1 rounded-full font-bold capitalize"
                            style={{ background: lvlCfg.bg, color: lvlCfg.text, border: `1px solid ${lvlCfg.border}` }}>
                            {plan?.currentLevel}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Day <span className="text-white font-bold">{plan?.currentDay}</span> of <span className="text-white font-bold">{plan?.timelineDays}</span>
                        · <span className="text-amber-400 font-medium">{daysLeft} days left</span>
                        · Deadline: {progress?.deadline ? new Date(progress.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/goals/setup" onClick={handleReset}
                        className="btn-secondary text-xs px-4 py-2">
                        🔄 Reset Goal
                    </Link>
                </div>
            </div>

            {/* ── Stats Row (now 4 cards) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Streak', value: `🔥 ${plan?.streak}d`, sub: `Best: ${plan?.longestStreak}d`, color: '#f59e0b' },
                    { label: 'Completion', value: `${progress?.completionRate || 0}%`, sub: `${progress?.totalCompleted || 0} tasks done`, color: '#10b981' },
                    { label: 'Skill Score', value: `+${progress?.skillImprovementScore || 0}`, sub: 'Improvement pts', color: '#6366f1' },
                    { label: 'Performance', value: `${progress?.performanceScore || 0}%`, sub: progress?.difficultyMultiplier >= 1.2 ? '📈 Hard mode' : progress?.difficultyMultiplier <= 0.8 ? '📉 Easy mode' : '⚖️ Normal', color: '#a855f7' },
                ].map(({ label, value, sub, color }) => (
                    <GlassCard key={label} className="text-center" style={{ padding: '16px' }}>
                        <p className="text-xl sm:text-2xl font-black" style={{ color }}>{value}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>
                    </GlassCard>
                ))}
            </div>

            {/* ── Overall Progress Bar ──────────────────── */}
            <GlassCard className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Overall Journey Progress</span>
                    <span className="text-sm font-bold text-indigo-400">{overallPct}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5 relative overflow-hidden">
                    <div className="h-2.5 rounded-full transition-all duration-1000"
                        style={{ width: `${overallPct}%`, background: 'linear-gradient(to right, #4f46e5, #9333ea, #ec4899)' }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((lvl, i) => {
                        const pct = [0, 25, 55, 80][i];
                        return <span key={lvl} className="capitalize">{lvl}</span>;
                    })}
                </div>
            </GlassCard>

            {/* ── Tab Navigation ──────────────────────────── */}
            <div className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap"
                        style={activeTab === tab ? { background: 'linear-gradient(135deg,#4f46e5,#9333ea)', color: '#fff', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' } : { color: '#9ca3af' }}>
                        {tab === 'Today' ? `📅 ${tab} (${todayDone}/${todayTotal})` : tab === 'Progress' ? `📊 ${tab}` : `🏆 ${tab}`}
                    </button>
                ))}
            </div>

            {/* ══ TAB: TODAY'S TASKS ═══════════════════════ */}
            {activeTab === 'Today' && (
                <div className="space-y-4 animate-fade-in">

                    {/* ── FREEZE WALL — shown when account is frozen ── */}
                    {discipline?.isFrozen && (
                        <div className="rounded-2xl p-6 text-center animate-fade-in"
                            style={{
                                background: discipline.penaltyLevel === 'critical'
                                    ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.1))'
                                    : 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))',
                                border: `2px solid ${discipline.penaltyLevel === 'critical' ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.5)'}`,
                            }}>
                            <div className="text-5xl mb-3">
                                {discipline.penaltyLevel === 'critical' ? '❌' : '🧊'}
                            </div>
                            <h2 className="text-xl font-black mb-1"
                                style={{ color: discipline.penaltyLevel === 'critical' ? '#ef4444' : '#f97316' }}>
                                {discipline.penaltyLevel === 'critical' ? 'CRITICAL — Goal At Risk!' : 'Account Frozen'}
                            </h2>
                            <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto">
                                You missed <span className="font-bold text-white">{discipline.consecutiveMissedDays} consecutive days</span>.
                                You must complete <span className="font-bold text-white">{discipline.penaltyTasksRequired} penalty revision task(s)</span> below
                                before you can continue your normal plan.
                            </p>
                            <div className="flex justify-center gap-4 mb-4">
                                <div className="rounded-xl px-4 py-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <p className="text-2xl font-black" style={{ color: discipline.penaltyLevel === 'critical' ? '#ef4444' : '#f97316' }}>
                                        {discipline.disciplineScore}/100
                                    </p>
                                    <p className="text-[10px] text-gray-400">Discipline Score</p>
                                </div>
                                <div className="rounded-xl px-4 py-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <p className="text-2xl font-black text-amber-400">{discipline.penaltyTasksRequired}</p>
                                    <p className="text-[10px] text-gray-400">Tasks to Unfreeze</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
                                💡 <strong>How to recover:</strong> Complete all penalty tasks (🔴 marked below) to unfreeze your account.
                                Each revision task completed restores 5 discipline points.
                            </div>
                        </div>
                    )}

                    {/* ── Warning Banner (not frozen, but close) ── */}
                    {discipline && !discipline.isFrozen && discipline.penaltyLevel === 'warning' && (
                        <div className="rounded-xl p-4 animate-fade-in"
                            style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.35)' }}>
                            <p className="text-yellow-400 text-sm font-semibold">
                                ⚠️ WARNING: {discipline.consecutiveMissedDays} consecutive missed days! Complete today's tasks to avoid an account freeze.
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                Discipline Score: <span className="font-bold text-yellow-400">{discipline.disciplineScore}/100</span>
                                &nbsp;· {discipline.penaltyTasksRequired} extra revision task(s) added.
                                &nbsp;Missing {2 - discipline.consecutiveMissedDays + 2} more days will freeze your account.
                            </p>
                        </div>
                    )}

                    {/* Today's completion ring */}
                    <GlassCard>
                        <div className="flex items-center gap-6">
                            <div className="relative flex-shrink-0">
                                <CircleProgress value={todayPct} size={90} color={lvlCfg.dot} />
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-lg font-black text-white">{todayPct}%</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Day {plan?.currentDay} Tasks</h2>
                                <p className="text-gray-400 text-sm mt-0.5">{todayDone} of {todayTotal} completed</p>
                                {todayDone === todayTotal && todayTotal > 0 && (
                                    <p className="text-green-400 text-sm mt-1 font-semibold">🎉 All tasks complete! Streak maintained!</p>
                                )}
                                {todayDone < todayTotal && (
                                    <p className="text-amber-400 text-xs mt-1">{todayTotal - todayDone} task{todayTotal - todayDone > 1 ? 's' : ''} remaining today</p>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {todayTasks.length === 0 ? (
                        <GlassCard className="text-center py-10">
                            <div className="text-4xl mb-3">🎉</div>
                            <p className="text-white font-bold">No tasks for today!</p>
                            <p className="text-gray-400 text-sm mt-1">You're all caught up. Come back tomorrow.</p>
                        </GlassCard>
                    ) : (
                        <div className="space-y-3">
                            {todayTasks.map(task => (
                                <TaskCard key={task._id} task={task} onStartQuiz={handleQuizStart} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ══ TAB: PROGRESS CHARTS ════════════════════ */}
            {activeTab === 'Progress' && progress && (
                <div className="space-y-6 animate-fade-in">
                    {/* Daily completion chart */}
                    <GlassCard>
                        <h3 className="text-base font-bold text-white mb-4">Daily Completion Rate (14 days)</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={progress.dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} label={{ value: 'Day', position: 'insideBottomRight', fill: '#6b7280', fontSize: 10 }} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <Tooltip contentStyle={{ background: 'rgba(15,20,60,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#fff' }}
                                    formatter={(v) => [`${v}%`, 'Completion']} />
                                <Bar dataKey="rate" name="Completion %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </GlassCard>

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <GlassCard className="text-center">
                            <div className="mx-auto w-fit relative mb-2">
                                <CircleProgress value={progress.completionRate} size={80} color="#10b981" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-black text-white">{progress.completionRate}%</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Completion Rate</p>
                        </GlassCard>
                        <GlassCard className="text-center">
                            <div className="mx-auto w-fit relative mb-2">
                                <CircleProgress value={progress.performanceScore} size={80} color="#a855f7" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-black text-white">{progress.performanceScore}%</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Performance</p>
                        </GlassCard>
                        <GlassCard className="text-center">
                            <div className="mx-auto w-fit relative mb-2">
                                <CircleProgress value={Math.min(100, overallPct)} size={80} strokeWidth={8} color="#f59e0b" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-black text-white">{overallPct}%</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Journey Done</p>
                        </GlassCard>
                    </div>

                    <GlassCard>
                        <h3 className="text-base font-bold text-white mb-3">Adaptive Difficulty</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Easy (0.7×)</span>
                                    <span className="font-bold text-indigo-300">Current: {progress.difficultyMultiplier.toFixed(2)}×</span>
                                    <span>Hard (1.5×)</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3 relative">
                                    <div className="h-3 rounded-full transition-all duration-700 relative"
                                        style={{ width: `${((progress.difficultyMultiplier - 0.7) / 0.8) * 100}%`, background: 'linear-gradient(to right,#10b981,#f59e0b,#ef4444)' }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            System auto-adjusts task difficulty based on your average performance score. Score ≥85% → tasks get harder. Score &lt;60% → tasks get easier.
                        </p>
                    </GlassCard>

                    {/* ── Discipline Score Panel ── */}
                    {discipline && (
                        <GlassCard>
                            <h3 className="text-base font-bold text-white mb-4">🛡️ Discipline Score</h3>
                            <div className="flex items-center gap-6">
                                <div className="relative flex-shrink-0">
                                    <CircleProgress
                                        value={discipline.disciplineScore}
                                        size={90}
                                        color={discipline.penaltyLevel === 'critical' ? '#ef4444' : discipline.penaltyLevel === 'freeze' ? '#f97316' : discipline.penaltyLevel === 'warning' ? '#eab308' : '#10b981'}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-black text-white">{discipline.disciplineScore}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-white">Status:</span>
                                        <span className="text-sm px-3 py-0.5 rounded-full font-bold"
                                            style={{
                                                background: discipline.penaltyLevel === 'critical' ? 'rgba(239,68,68,0.15)' : discipline.penaltyLevel === 'freeze' ? 'rgba(249,115,22,0.15)' : discipline.penaltyLevel === 'warning' ? 'rgba(234,179,8,0.15)' : 'rgba(16,185,129,0.15)',
                                                color: discipline.penaltyLevel === 'critical' ? '#ef4444' : discipline.penaltyLevel === 'freeze' ? '#f97316' : discipline.penaltyLevel === 'warning' ? '#eab308' : '#10b981',
                                                border: `1px solid ${discipline.penaltyLevel === 'critical' ? 'rgba(239,68,68,0.4)' : discipline.penaltyLevel === 'freeze' ? 'rgba(249,115,22,0.4)' : discipline.penaltyLevel === 'warning' ? 'rgba(234,179,8,0.4)' : 'rgba(16,185,129,0.4)'}`,
                                            }}>
                                            {discipline.penaltyLabel}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-gray-400">
                                        <p>🔥 Streak: <span className="text-white font-semibold">{discipline.streak} days</span></p>
                                        <p>❌ Total Missed: <span className="text-red-400 font-semibold">{discipline.totalMissed} tasks</span></p>
                                        <p>⚠️ Consecutive Missed Days: <span className="text-amber-400 font-semibold">{discipline.consecutiveMissedDays}</span></p>
                                        {discipline.isFrozen && <p>🧊 Penalty Tasks to Unfreeze: <span className="text-orange-400 font-semibold">{discipline.penaltyTasksRequired}</span></p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/8">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    <strong className="text-gray-300">Penalty Levels:</strong><br />
                                    🟢 Normal (0–1 missed) → 🟡 Warning (2–3) → 🟠 Freeze (4–5, account locked) → 🔴 Critical (6+, goal at risk)
                                </p>
                            </div>
                        </GlassCard>
                    )}
                </div>
            )}

            {/* ══ TAB: LEVELS ═════════════════════════════ */}
            {activeTab === 'Levels' && progress && (
                <div className="space-y-4 animate-fade-in">
                    {['beginner', 'intermediate', 'advanced', 'professional'].map(lvl => {
                        const cfg = LEVEL_COLORS[lvl];
                        const stat = progress.levelStats[lvl] || { total: 0, completed: 0, avgScore: 0, rate: 0 };
                        const bounds = progress.levelBoundaries[lvl] || {};
                        const isCurrentLvl = plan?.currentLevel === lvl;
                        const isPast = plan?.currentDay > (bounds.endDay || 0);

                        return (
                            <GlassCard key={lvl} style={{ borderColor: isCurrentLvl ? cfg.border : 'rgba(255,255,255,0.08)' }}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                                        style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
                                        {lvl === 'beginner' ? '🌱' : lvl === 'intermediate' ? '🌿' : lvl === 'advanced' ? '🌳' : '🏆'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-bold text-white capitalize text-base">{lvl}</h3>
                                            {isCurrentLvl && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>● Current</span>}
                                            {isPast && !isCurrentLvl && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">✓ Completed</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Days {bounds.startDay}–{bounds.endDay} · {stat.total} tasks
                                            {stat.completed > 0 && ` · Avg score: ${stat.avgScore}%`}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-800 rounded-full h-2">
                                                <div className="h-2 rounded-full transition-all duration-700"
                                                    style={{ width: `${stat.rate}%`, background: `linear-gradient(to right, ${cfg.dot}, #9333ea)` }} />
                                            </div>
                                            <span className="text-xs font-bold flex-shrink-0" style={{ color: cfg.text }}>{stat.rate}%</span>
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-1">{stat.completed} of {stat.total} tasks done</p>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
