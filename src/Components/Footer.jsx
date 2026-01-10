import './footer.css';

export const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo gradient-text">DietLog</span>
                    </div>

                    <nav className="footer-nav">
                        <a href="/">Home</a>
                        <a href="/profile">Profile</a>
                        <a href="/voice-companion">Voice Companion</a>
                    </nav>

                    <div className="footer-copyright">
                        <span>© {new Date().getFullYear()} DietLog. Eat Healthy, Stay Fit <span className="heart">♥</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
