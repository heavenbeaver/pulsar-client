const AuthBg = () => {
    return (
        <div className="bg-radar">
            <svg viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className="br1">
                    <circle cx="450" cy="450" r="400" stroke="#4DFFD2" strokeWidth="1"></circle>
                    <circle cx="450" cy="450" r="300" stroke="#4DFFD2" strokeWidth="1"></circle>
                    <circle cx="450" cy="450" r="200" stroke="#4DFFD2" strokeWidth="1"></circle>
                    <circle cx="450" cy="450" r="100" stroke="#4DFFD2" strokeWidth="1"></circle>
                    <line x1="450" y1="50" x2="450" y2="850" stroke="#4DFFD2" strokeWidth="0.5"></line>
                    <line x1="50" y1="450" x2="850" y2="450" stroke="#4DFFD2" strokeWidth="0.5"></line>
                </g>
                <g className="br2">
                    <line x1="450" y1="50" x2="450" y2="850" stroke="#4DFFD2" strokeWidth="0.5" transform="rotate(45 450 450)"></line>
                    <line x1="50" y1="450" x2="850" y2="450" stroke="#4DFFD2" strokeWidth="0.5" transform="rotate(45 450 450)"></line>
                </g>
            </svg>
        </div>
    );
}

export default AuthBg;