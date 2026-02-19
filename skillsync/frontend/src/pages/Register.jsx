import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
    {
        id: 'student',
        label: 'Student',
        icon: '🎓',
        desc: 'Track skills & get career guidance',
        color: '#4f46e5',
    },
    {
        id: 'company',
        label: 'Company / HR',
        icon: '🏢',
        desc: 'Post job requirements & find talent',
        color: '#059669',
    },
    {
        id: 'institute',
        label: 'Institute',
        icon: '🏫',
        desc: 'Monitor students & connect with industry',
        color: '#d97706',
    },
];

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('student');
    const [form, setForm] = useState({ name: '', email: '', password: '', organizationName: '', industry: '', location: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if ((selectedRole === 'company' || selectedRole === 'institute') && !form.organizationName) {
            setError('Organization name is required'); return;
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, selectedRole, {
                organizationName: form.organizationName,
                industry: form.industry,
                location: form.location,
            });
            if (selectedRole === 'company') navigate('/company/dashboard');
            else if (selectedRole === 'institute') navigate('/institute/dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isOrg = selectedRole === 'company' || selectedRole === 'institute';
    const activeRole = ROLES.find(r => r.id === selectedRole);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-lg relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${activeRole?.color || '#4f46e5'}, #9333ea)`, transition: 'background 0.3s' }}>
                        <span className="text-2xl">{activeRole?.icon}</span>
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">SkillSync</h1>
                    <p className="text-gray-400 mt-1 text-sm">Create your account</p>
                </div>

                <div className="glass-card p-8">
                    {/* Role Selector */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-3 font-medium">I am joining as a…</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {ROLES.map(role => (
                                <button key={role.id} type="button"
                                    onClick={() => setSelectedRole(role.id)}
                                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 text-center"
                                    style={{
                                        background: selectedRole === role.id ? `rgba(${role.id === 'student' ? '79,70,229' : role.id === 'company' ? '5,150,105' : '217,119,6'},0.15)` : 'rgba(255,255,255,0.04)',
                                        borderColor: selectedRole === role.id ? role.color : 'rgba(255,255,255,0.08)',
                                        boxShadow: selectedRole === role.id ? `0 0 12px ${role.color}30` : 'none',
                                    }}>
                                    <span className="text-xl">{role.icon}</span>
                                    <span className="text-xs font-semibold text-white leading-tight">{role.label}</span>
                                    <span className="text-[10px] text-gray-400 leading-tight">{role.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} className="glass-input" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Email address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} className="glass-input" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} className="glass-input" placeholder="Min. 6 characters" required />
                        </div>

                        {/* Org fields — only for company / institute */}
                        {isOrg && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1.5">
                                        {selectedRole === 'company' ? 'Company Name' : 'Institute / College Name'} <span className="text-red-400">*</span>
                                    </label>
                                    <input type="text" name="organizationName" value={form.organizationName} onChange={handleChange}
                                        className="glass-input" placeholder={selectedRole === 'company' ? 'Acme Corp' : 'ABC University'} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1.5">Industry</label>
                                        <input type="text" name="industry" value={form.industry} onChange={handleChange}
                                            className="glass-input" placeholder="e.g. Technology" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1.5">Location</label>
                                        <input type="text" name="location" value={form.location} onChange={handleChange}
                                            className="glass-input" placeholder="e.g. Bangalore" />
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full mt-2"
                            style={!loading ? { background: `linear-gradient(to right, ${activeRole?.color || '#4f46e5'}, #9333ea)` } : {}}>
                            {loading ? 'Creating account…' : `Create ${activeRole?.label} Account`}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
