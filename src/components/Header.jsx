import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import ExitIcon from "../icons/ExitIcon";
import LogoIcon from "../icons/LogoIcon";
import ThemeSwitchButton from "./ColorSchemeSwitch/ThemeSwitchButton";
const URL = import.meta.env.VITE_SERVER_URL;

const Header = () => {
    const { user, setUser, setTodos, theme, setTheme } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const contextRef = useRef(null);
    const userTopRef = useRef(null);

    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${URL}/auth/logout`, {
                method: 'POST'
            });

            if (!res.ok) {
                return
            }

            if (res.status == 204) {
                localStorage.removeItem('token');
                localStorage.removeItem('theme');
                setUser(null);
                setTodos(null);
                setTheme('dark');
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextRef.current &&
                !contextRef.current.contains(event.target) &&
                userTopRef.current &&
                !userTopRef.current.contains(event.target)) {
                setShowContext(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    const toggleContext = () => {
        setShowContext(!showContext);
    }

    const switchTheme = (currentTheme) => {
        if (currentTheme === 'dark') {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    const avatarName = `${user.lastName ? user.lastName[0] : ''}${user.name ? user.name[0] : ''}`;

    return (
        <div className="header">
            <div className="header-container">
                <div className="logo">
                    <div className="logo-icon">
                        <LogoIcon />
                    </div>
                    <div className="logo-wordmark">
                        пульс<span>ар</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="user-pill" onClick={toggleContext} ref={userTopRef}>
                        <div className="avatar">{`${avatarName}`}</div>
                        {user && <span className="user-name">{`${user.lastName} ${user.name} ${user.patronymic}`}</span>}

                        {showContext && <div className="user__context" ref={contextRef}>
                            <ul className="context-list">
                                {/* {user.isAdmin && <li className="context-item">
                                <SettingsIcon />
                                <a href="#">Администрирование</a>
                                </li>} */}
                                <li className="context-item">
                                    <ExitIcon />
                                    <button disabled={isLoading} onClick={handleLogout}>{isLoading ? 'Выход...' : 'Выйти'}</button>
                                </li>
                            </ul>
                        </div>}
                    </div>

                    <ThemeSwitchButton theme={theme} switchTheme={() => switchTheme(theme)} />
                </div>

            </div>
        </div>
    );
}

export default Header;