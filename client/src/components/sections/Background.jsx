
export default function Background() {
    return (
        <div
            className="aura-background-component fixed top-0 w-full h-screen -z-10"
            data-alpha-mask="80"
            style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
            }}
        >
            <div className="spline-container absolute top-0 left-0 w-full h-full z-0">
                <iframe
                    src="https://my.spline.design/glowingplanetparticles-HmCVKutonlFn3Oqqe6DI9nWi/"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    title="Spline 3D Background"
                />
            </div>
        </div>
    );
}
