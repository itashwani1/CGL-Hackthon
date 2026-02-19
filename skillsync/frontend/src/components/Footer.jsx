import { Link } from 'react-router-dom';

const footerLinks = {
    Product: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Gap Analysis', path: '/gap-analysis' },
        { label: 'Recommendations', path: '/recommendations' },
    ],
    Company: [
        { label: 'About Us', path: '#' },
        { label: 'Blog', path: '#' },
        { label: 'Careers', path: '#' },
    ],
    Support: [
        { label: 'Help Center', path: '#' },
        { label: 'Privacy Policy', path: '#' },
        { label: 'Terms of Service', path: '#' },
    ],
};

const socialLinks = [
    {
        label: 'GitHub',
        href: 'https://github.com',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Twitter',
        href: 'https://twitter.com',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto" style={{
            background: 'linear-gradient(180deg, rgba(10, 13, 44, 0.98) 0%, rgba(7, 9, 30, 1) 100%)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 -4px 40px rgba(79,70,229,0.12)',
        }}>
            {/* Top gradient line */}
            <div className="w-full h-0.5" style={{
                background: 'linear-gradient(to right, transparent, #4f46e5, #a855f7, #ec4899, transparent)'
            }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

                    {/* Brand Column */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #9333ea)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
                                S
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tight"
                                    style={{ background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    SkillSync
                                </span>
                                <span className="text-[9px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">Career Intelligence</span>
                            </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Empowering professionals to bridge skill gaps and accelerate their career journey with AI-driven insights.
                        </p>

                        {/* Stats strip */}
                        <div className="flex gap-4 mt-1">
                            {[['10K+', 'Users'], ['500+', 'Courses'], ['50+', 'Roles']].map(([num, label]) => (
                                <div key={label} className="text-center">
                                    <div className="text-base font-bold"
                                        style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {num}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-medium">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-2 mt-2">
                            {socialLinks.map(({ label, href, icon }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 group"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
                                        e.currentTarget.style.boxShadow = '0 0 12px rgba(99,102,241,0.2)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="flex flex-col gap-3">
                            <h4 className="text-xs font-bold tracking-widest uppercase"
                                style={{ color: 'rgba(129,140,248,0.8)' }}>
                                {category}
                            </h4>
                            <ul className="flex flex-col gap-2">
                                {links.map(({ label, path }) => (
                                    <li key={label}>
                                        <Link to={path}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-px bg-indigo-400 transition-all duration-200 rounded" />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="my-8 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        © {year} <span className="text-gray-400 font-medium">SkillSync</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>Built with</span>
                        <span className="text-red-400 animate-pulse">♥</span>
                        <span>for</span>
                        <span className="font-semibold"
                            style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            CGL Hackathon {year}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                        style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: 'rgba(52,211,153,0.9)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
}
