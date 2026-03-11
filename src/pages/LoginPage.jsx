import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../App";
import LogoIcon from "../icons/LogoIcon";
import AuthBg from "../components/Auth/AuthBg";

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [isHidePass, setIsHidePass] = useState(true);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login,
                    password
                })
            })

            const data = await res.json();

            if (!res.ok) {
                setIsLoading(false);
                // console.log(data.error);
                setError(data.error);
                return;
            }

            if (data.token) localStorage.setItem('token', data.token);
            if (data) setUser({
                id: data.id,
                login: data.login,
                name: data.name,
                lastName: data.lastName,
                patronymic: data.patronymic,
                isAdmin: data.isAdmin
            })
            setIsLoading(false);
            navigate('/');
        } catch (error) {
            setIsLoading(false);
            if (error.message == 'Failed to fetch') {
                setError('Сервер недоступен. Попробуйте позже.');
            } else {
                setError('Произошла неизвестная ошибка.Попробуйте снова.');
            }
        }
    }

    const changePassVisibility = () => {
        setIsHidePass(!isHidePass);
    }

    return (
        <>
            <AuthBg />

            <div className="screen">
                <div className="left">
                    <div className="logo">
                        <div className="logo-icon">
                            <LogoIcon />
                        </div>
                        <div className="logo-wordmark">
                            пульс<span>ар</span>
                        </div>
                    </div>
                    <div className="hero-text">
                        <div className="hero-eyebrow">Система управления тикетами</div>
                        <div className="hero-title">Каждый запрос<br /><span>под контролем.</span></div>
                        <div className="hero-desc">
                            Отслеживайте, приоритизируйте и решайте задачи команды — всё в одном месте. Сигнал всегда чистый.
                        </div>
                    </div>
                    <div className="blank"></div>
                </div>

                <div className="right">
                    <div className="login">

                        <form className="form form-login" onSubmit={handleSubmit}>

                            <h1 className="form-title">Вход</h1>
                            <h3 className="form-desc">Введите данные вашего аккаунта</h3>

                            <label htmlFor="login">Логин</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="user@company.ru"
                                required />

                            <label htmlFor="password">Пароль</label>
                            <div className="password-container">
                                <input
                                    type={isHidePass ? 'password' : 'text'}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    autoComplete="password"
                                    required />
                                <div className="show-pass-btn" onClick={changePassVisibility}>
                                    <img width={24} src={isHidePass ? 'show.png' : 'hide.png'} alt="Иконка показать/скрыть пароль" title={isHidePass ? 'Показать пароль' : 'Скрыть пароль'} />
                                </div>
                            </div>

                            <button className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Вход' : 'Войти'}</button>
                            {error && <p className="error-message">Ошибка: {error}</p>}
                        </form>
                        <div className="form-link">
                            <div className="word-or">
                                <span></span>
                                <p>или</p>
                                <span></span>
                            </div>
                            <div className="or-link">
                                <p>Нет аккаунта?</p>
                                <Link to={'/register'}>Создать</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;