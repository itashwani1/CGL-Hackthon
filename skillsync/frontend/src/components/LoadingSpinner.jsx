export default function LoadingSpinner({ size = 'md', text = '' }) {
    const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className={`${sizes[size]} border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`} />
            {text && <p className="text-gray-400 text-sm">{text}</p>}
        </div>
    );
}
