export default function Stats() {
    const stats = [
        { value: '12K+', label: 'Apprenants actifs' },
        { value: '100', label: 'Niveaux progressifs' },
        { value: '850+', label: 'Diplômés' },
        { value: '45', label: 'Pays représentés' },
    ];

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-zinc-800/50">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                        <div className="text-3xl font-semibold tracking-tight text-white">{stat.value}</div>
                        <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
