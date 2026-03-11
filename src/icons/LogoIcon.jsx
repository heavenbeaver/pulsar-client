const LogoIcon = () => {
    return (
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="ring" cx="36" cy="36" r="28" stroke="#4DFFD2" strokeWidth="1"></circle>
            <circle className="ring" cx="36" cy="36" r="20" stroke="#4DFFD2" strokeWidth="1.5"></circle>
            <circle className="ring" cx="36" cy="36" r="12" stroke="#4DFFD2" strokeWidth="2"></circle>
            <circle className="dot-pulse" cx="36" cy="36" r="5" fill="#4DFFD2"></circle>
            <line x1="36" y1="4" x2="36" y2="14" stroke="#4DFFD2" strokeWidth="1.5" opacity="0.4"></line>
            <line x1="36" y1="58" x2="36" y2="68" stroke="#4DFFD2" strokeWidth="1.5" opacity="0.4"></line>
            <line x1="4" y1="36" x2="14" y2="36" stroke="#4DFFD2" strokeWidth="1.5" opacity="0.4"></line>
            <line x1="58" y1="36" x2="68" y2="36" stroke="#4DFFD2" strokeWidth="1.5" opacity="0.4"></line>
        </svg>
    );
}
 
export default LogoIcon;