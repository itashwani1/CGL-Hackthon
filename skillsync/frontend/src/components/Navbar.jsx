import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinksByRole = {
    student: [
        { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
        { path: '/gap-analysis', label: 'Gap Analysis', icon: '📊' },
        { path: '/recommendations', label: 'Recommendations', icon: '🎯' },
        { path: '/goals', label: 'Goal Plan', icon: '🚀' },
    ],
    company: [
        { path: '/company/dashboard', label: 'Dashboard', icon: '⚡' },
        { path: '/company/jobs', label: 'Job Postings', icon: '📋' },
        { path: '/company/talent', label: 'Find Talent', icon: '🔍' },
    ],
    institute: [
        { path: '/institute/dashboard', label: 'Dashboard', icon: '⚡' },
        { path: '/institute/students', label: 'Students', icon: '🎓' },
        { path: '/institute/analytics', label: 'Analytics', icon: '📊' },
        { path: '/institute/jobs', label: 'Job Board', icon: '💼' },
    ],
};

const roleBadge = { student: { label: 'Student', color: '#4f46e5' }, company: { label: 'Company', color: '#059669' }, institute: { label: 'Institute', color: '#d97706' } };

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [spinning, setSpinning] = useState(false);

    const handleToggleTheme = () => {
        setSpinning(true);
        toggleTheme();
        setTimeout(() => setSpinning(false), 400);
    };

    const navLinks = navLinksByRole[user?.role] || navLinksByRole.student;
    const badge = roleBadge[user?.role] || roleBadge.student;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-2xl shadow-black/40' : 'py-3'}`}
            style={{
                background: scrolled
                    ? (theme === 'dark' ? 'rgba(13, 15, 45, 0.98)' : 'rgba(241,245,249,0.98)')
                    : (theme === 'dark' ? 'rgba(13, 15, 45, 0.92)' : 'rgba(241,245,249,0.92)'),
                backdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(99,102,241,0.25)',
                boxShadow: scrolled ? '0 4px 30px rgba(79,70,229,0.15), 0 1px 0 rgba(168,85,247,0.15)' : '0 1px 0 rgba(99,102,241,0.12)',
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                {/* Logo */}
                <Link to={navLinks[0]?.path || '/dashboard'} className="flex items-center gap-3 group">
                    <div className="relative w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 p-1 shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                        <img
                            src="/logo.png"
                            alt="SkillSync Logo"
                            className="w-full h-full object-contain rounded-xl"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="absolute inset-0 w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-transform duration-200 group-hover:scale-110"
                            style={{ background: `linear-gradient(135deg, ${badge.color}, #9333ea)`, display: 'none' }}>
                            <span className="text-white font-black tracking-tighter text-base">S</span>
                        </div>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tight"
                            style={{ background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            SkillSync
                        </span>
                        <span className="text-[9px] font-medium tracking-widest uppercase mt-0.5" style={{ color: badge.color }}>{badge.label} Portal</span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {navLinks.map(({ path, label, icon }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link key={path} to={path}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                style={isActive ? {
                                    background: `linear-gradient(135deg, rgba(${badge.color === '#4f46e5' ? '79,70,229' : badge.color === '#059669' ? '5,150,105' : '217,119,6'},0.3), rgba(147,51,234,0.2))`,
                                    boxShadow: `0 2px 12px ${badge.color}30`,
                                    border: `1px solid ${badge.color}40`,
                                } : {}}>
                                <span className="text-base">{icon}</span>
                                <span>{label}</span>
                                {isActive && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: badge.color }} />}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${badge.color}, #9333ea)`, boxShadow: `0 0 10px ${badge.color}60` }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xs text-gray-300 font-medium max-w-[90px] truncate">{user?.name}</span>
                            <span className="text-[9px] font-semibold tracking-wide uppercase" style={{ color: badge.color }}>{badge.label}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={handleToggleTheme}
                        title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-all duration-200 hover:scale-110 ${spinning ? 'theme-toggle-spin' : ''}`}
                        style={{ border: '1px solid rgba(99,102,241,0.25)', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.1)' }}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    <button onClick={handleLogout}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 transition-all duration-200"
                        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span className="hidden sm:inline font-medium">Logout</span>
                    </button>

                    {/* Mobile Hamburger */}
                    <button className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl"
                        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                        onClick={() => setMobileOpen(!mobileOpen)}>
                        <span className={`block w-5 h-0.5 bg-gray-300 rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-gray-300 rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-gray-300 rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-3 flex flex-col gap-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {navLinks.map(({ path, label, icon }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link key={path} to={path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400'}`}
                                style={isActive ? { background: `rgba(${badge.color === '#4f46e5' ? '79,70,229' : '5,150,105'},0.2)`, border: `1px solid ${badge.color}30` } : {}}>
                                <span>{icon}</span>{label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
