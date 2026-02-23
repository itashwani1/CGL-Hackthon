import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GapAnalysis from './pages/GapAnalysis';
import Recommendations from './pages/Recommendations';
import CompanyDashboard from './pages/CompanyDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import GoalSetup from './pages/GoalSetup';
import GoalDashboard from './pages/GoalDashboard';

// Full-screen initial loader — shown ONCE on app boot
function InitialLoader() {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'radial-gradient(ellipse at center, rgba(13,15,45,1) 0%, rgba(3,7,18,1) 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 900, color: '#fff',
                boxShadow: '0 0 30px rgba(99,102,241,0.5)',
                animation: 'pulse 1.5s ease-in-out infinite',
            }}>S</div>
            <p style={{ color: 'rgba(129,140,248,0.8)', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>
                Loading…
            </p>
        </div>
    );
}

// Role-based protected route
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRole && user.role !== allowedRole) {
        // Redirect to their correct dashboard
        if (user.role === 'company') return <Navigate to="/company/dashboard" replace />;
        if (user.role === 'institute') return <Navigate to="/institute/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return children;
    if (user.role === 'company') return <Navigate to="/company/dashboard" replace />;
    if (user.role === 'institute') return <Navigate to="/institute/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
};

// Fade wrapper — smooth transition between pages
function PageFade({ children }) {
    const { pathname } = useLocation();
    return (
        <div key={pathname} style={{ animation: 'fadeIn 0.18s ease-out' }}>
            {children}
        </div>
    );
}

// Smart root redirect based on role
function RootRedirect() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'company') return <Navigate to="/company/dashboard" replace />;
    if (user.role === 'institute') return <Navigate to="/institute/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) return <InitialLoader />;

    return (
        <div className="flex flex-col min-h-screen">
            {user && <Navbar />}
            <main className="flex-1">
                <PageFade>
                    <Routes>
                        {/* Root */}
                        <Route path="/" element={<RootRedirect />} />

                        {/* Auth */}
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                        {/* Student Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute allowedRole="student"><Dashboard /></ProtectedRoute>} />
                        <Route path="/gap-analysis" element={<ProtectedRoute allowedRole="student"><GapAnalysis /></ProtectedRoute>} />
                        <Route path="/recommendations" element={<ProtectedRoute allowedRole="student"><Recommendations /></ProtectedRoute>} />
                        <Route path="/goals" element={<ProtectedRoute allowedRole="student"><GoalDashboard /></ProtectedRoute>} />
                        <Route path="/goals/setup" element={<ProtectedRoute allowedRole="student"><GoalSetup /></ProtectedRoute>} />

                        {/* Company Routes */}
                        <Route path="/company/dashboard" element={<ProtectedRoute allowedRole="company"><CompanyDashboard /></ProtectedRoute>} />
                        <Route path="/company/jobs" element={<ProtectedRoute allowedRole="company"><CompanyDashboard /></ProtectedRoute>} />
                        <Route path="/company/talent" element={<ProtectedRoute allowedRole="company"><CompanyDashboard /></ProtectedRoute>} />

                        {/* Institute Routes */}
                        <Route path="/institute/dashboard" element={<ProtectedRoute allowedRole="institute"><InstituteDashboard /></ProtectedRoute>} />
                        <Route path="/institute/students" element={<ProtectedRoute allowedRole="institute"><InstituteDashboard /></ProtectedRoute>} />
                        <Route path="/institute/analytics" element={<ProtectedRoute allowedRole="institute"><InstituteDashboard /></ProtectedRoute>} />
                        <Route path="/institute/jobs" element={<ProtectedRoute allowedRole="institute"><InstituteDashboard /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<RootRedirect />} />
                    </Routes>
                </PageFade>
            </main>
            {user && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
