import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { path: '/gap-analysis', label: 'Gap Analysis', icon: '📊' },
    { path: '/recommendations', label: 'Recommendations', icon: '🎯' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                        S
                    </div>
                    <span className="text-lg font-bold gradient-text">SkillSync</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ path, label, icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === path
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>{icon}</span>
                            {label}
                        </Link>
                    ))}
                </div>

                {/* User + Logout */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 glass-card rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-300 font-medium">{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <span>→</span>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
