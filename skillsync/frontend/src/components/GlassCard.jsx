export default function GlassCard({ children, className = '', hover = false }) {
    return (
        <div
            className={`glass-card p-6 animate-fade-in ${hover ? 'hover:border-indigo-500/30 hover:bg-white/8 transition-all duration-300 cursor-default' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
