import './footer.css';

export const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-copyright">
                        <span>© {new Date().getFullYear()} DietLog. Eat Healthy, Stay Fit <span className="heart">♥</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
