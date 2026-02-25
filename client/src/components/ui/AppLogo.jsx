/**
 * AppLogo — Reusable logo component used across the entire app.
 *
 * Renders the custom SVG icon alongside "promptacademy" text.
 * Adapts colors based on the `variant` prop:
 *   - "dark"  → for dark backgrounds (sidebar, auth pages, footer)
 *   - "light" → for light backgrounds (navbar on landing page)
 *
 * @param {{ size?: 'sm' | 'md' | 'lg', variant?: 'dark' | 'light', className?: string }} props
 */
export default function AppLogo({ size = 'md', variant = 'dark', className = '' }) {
    const sizes = {
        sm: { icon: 20, text: 'text-base' },
        md: { icon: 24, text: 'text-lg' },
        lg: { icon: 32, text: 'text-2xl' },
    };

    const { icon: iconSize, text: textClass } = sizes[size] || sizes.md;

    // Colors adapt to the background
    const textColor = variant === 'light' ? 'text-zinc-900' : 'text-white';
    const accentColor = variant === 'light' ? 'text-violet-600' : 'text-violet-500';
    const svgFill = variant === 'light' ? '#7C3AED' : '#8B5CF6'; // violet-600 vs violet-500

    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                <g transform="translate(106, 106) scale(0.6)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M250 460L50 360V200L250 300L450 200V360L250 460Z"
                        fill={svgFill}
                    />
                    <path
                        d="M250 0L285.355 106.645L392 142L285.355 177.355L250 284L214.645 177.355L108 142L214.645 106.645L250 0Z"
                        fill={svgFill}
                    />
                </g>
            </svg>
            <span className={`${textClass} font-semibold tracking-tight ${textColor}`}>
                prompt<span className={accentColor}>academy</span>
            </span>
        </span>
    );
}
