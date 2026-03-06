import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../icons/UserAvatar";
import SettingsIcon from "../icons/SettingsIcon";
import ExitIcon from "../icons/ExitIcon";
const URL = import.meta.env.VITE_SERVER_URL;

const Header = () => {
    const { user, setUser, setTodos } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showContext, setShowContext] = useState(false);

    const contextRef = useRef(null); // ref для контекстного меню
    const userTopRef = useRef(null); // ref для кнопки открытия

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
                setUser(null);
                setTodos(null);
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
            // Если клик был не по меню и не по кнопке открытия
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

    const avatarName = `${user.lastName ? user.lastName[0] : ''}${user.name ? user.name[0] : ''}`;

    return (
        <div className="header">
            <div className="logo">
                <div className="logo-icon">✓</div>
                ToDo App
            </div>

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
        </div>
    );
}

export default Header;