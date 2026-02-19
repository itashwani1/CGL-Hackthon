import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GapAnalysis from './pages/GapAnalysis';
import Recommendations from './pages/Recommendations';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
    const { user } = useAuth();
    return (
        <>
            {user && <Navbar />}
            <Routes>
                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/gap-analysis" element={<ProtectedRoute><GapAnalysis /></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
