import React from 'react';
import { Link } from 'react-router-dom';
import ThreeVisual from '../../../theme/ThreeVisual';

function WelcomePage() {
    return (
        <>
            <div className="v2-canvas-container">
                <ThreeVisual disableMouse />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                textAlign: 'center',
                padding: '2rem',
                position: 'relative',
                zIndex: 1
            }}>
            <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                fontWeight: '800',
                margin: '0 0 1rem 0',
                letterSpacing: '-0.02em',
                color: 'var(--v2-text-main)'
            }}>
                Welcome to <span style={{ color: 'white' }}>VeriSphere</span>
            </h1>

            <p style={{
                fontSize: '0.95rem',
                color: 'var(--v2-text-muted)',
                maxWidth: '600px',
                lineHeight: '1.5',
                marginBottom: '2.5rem'
            }}>
                The rational public square. Step into an AI-moderated arena where truth takes center stage, and arguments are weighed on their merits, not their volume.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.2rem',
                maxWidth: '900px',
                width: '100%',
                marginBottom: '2.5rem'
            }}>
                {[
                    { title: 'AI-Reasoned', desc: 'Every argument is analyzed to promote clarity, constructive dialogue, and mutual understanding.' },
                    { title: 'Fact-Checked', desc: 'Claims are automatically cross-referenced with verified sources in real-time.' },
                    { title: 'Civil Discourse', desc: 'A protected environment where ideas battle, but personal attacks are filtered out.' }
                ].map(feature => (
                    <div key={feature.title} style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        backdropFilter: 'blur(16px)',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--v2-text-main)', fontSize: '1rem', marginBottom: '0.4rem', marginTop: 0 }}>{feature.title}</h3>
                        <p style={{ color: 'var(--v2-text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{feature.desc}</p>
                    </div>
                ))}
            </div>

            <Link
                to="/verisphere/feed"
                style={{
                    fontSize: '1rem',
                    padding: '12px 32px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    background: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    borderRadius: '100px',
                    color: 'white',
                    fontWeight: '600',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'border-color 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'white'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
            >
                Enter The Sphere
            </Link>
        </div>
        </>
    );
}

export default WelcomePage;
