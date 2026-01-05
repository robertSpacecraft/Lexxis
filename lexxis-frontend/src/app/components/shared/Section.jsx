export default function Section({ title, subtitle, children, className = "" }) {
    return (
        <section className={className}>
            {(title || subtitle) && (
                <header style={{ marginBottom: 16 }}>
                    {title && <h2 style={{ margin: 0 }}>{title}</h2>}
                    {subtitle && <p style={{ margin: "8px 0 0", opacity: 0.85 }}>{subtitle}</p>}
                </header>
            )}
            {children}
        </section>
    );
}
