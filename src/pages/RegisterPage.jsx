import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import LogoIcon from "../icons/LogoIcon";
import AuthBg from "../components/Auth/AuthBg";


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [head, setHead] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const { user, users, getUserFullName, setUser } = useContext(AppContext);
    const [isHidePass, setIsHidePass] = useState(true);

    const changePassVisibility = () => {
        setIsHidePass(!isHidePass);
    }

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    lastName,
                    patronymic,
                    login,
                    password,
                    head,
                    isAdmin: false
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setIsLoading(false);
                console.error(res.error)
                return;
            }

            if (data) {
                localStorage.setItem('token', data.token);
                setUser({
                    id: data.id,
                    login: data.login,
                    name: data.name,
                    lastName: data.lastName,
                    patronymic: data.patronymic,
                    isAdmin: data.isAdmin
                });
            }
            setIsLoading(false);
            navigate('/');
        } catch (error) {
            setIsLoading(false);
            setError(error);
            console.error(error);
        }
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
                        <div className="hero-title">Каждая задача<br /><span>под контролем.</span></div>
                        <div className="hero-desc">
                            Отслеживайте, приоритизируйте и решайте задачи команды — всё в одном месте. Сигнал всегда чистый.
                        </div>
                    </div>
                    <div className="waveform">
                        <div className="wave-bar" style={{ height: '40%' }}></div>
                        <div className="wave-bar" style={{ height: '70%' }}></div>
                        <div className="wave-bar" style={{ height: '55%' }}></div>
                        <div className="wave-bar" style={{ height: '90%' }}></div>
                        <div className="wave-bar" style={{ height: '65%' }}></div>
                        <div className="wave-bar" style={{ height: '45%' }}></div>
                        <div className="wave-bar" style={{ height: '80%' }}></div>
                        <div className="wave-bar" style={{ height: '60%' }}></div>
                        <div className="wave-bar" style={{ height: '75%' }}></div>
                        <div className="wave-bar" style={{ height: '50%' }}></div>
                        <div className="wave-bar" style={{ height: '35%' }}></div>
                        <div className="wave-bar" style={{ height: '85%' }}></div>
                        <div className="wave-bar" style={{ height: '55%' }}></div>
                        <div className="wave-bar" style={{ height: '70%' }}></div>
                        <div className="wave-bar" style={{ height: '40%' }}></div>
                        <div className="wave-bar" style={{ height: '95%' }}></div>
                        <div className="wave-bar" style={{ height: '60%' }}></div>
                        <div className="wave-bar" style={{ height: '45%' }}></div>
                        <div className="wave-bar" style={{ height: '80%' }}></div>
                        <div className="wave-bar" style={{ height: '65%' }}></div>
                    </div>
                </div>

                <div className="right">

                    <div className="logo">
                        <div className="logo-icon">
                            <LogoIcon />
                        </div>
                        <div className="logo-wordmark">
                            пульс<span>ар</span>
                        </div>
                    </div>
                    <div className="hero-eyebrow">Система управления тикетами</div>

                    <div className="login">
                        <form className="form form-login" onSubmit={handleSubmit}>
                            <h1 className="form-title">Регистрация</h1>
                            <h3 className="form-desc">Введите данные для регистрации</h3>

                            <label htmlFor="lastName">Фамилия</label>
                            <input type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="" required />

                            <label htmlFor="name">Имя</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="" required />

                            <label htmlFor="patronymic">Отчество</label>
                            <input type="text" name="patronymic" id="patronymic" value={patronymic} onChange={(e) => setPatronymic(e.target.value)} placeholder="" required />

                            <label htmlFor="email">Почта</label>
                            <input type="email" name="email" id="email" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="user@company.ru" required />

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

                            <label htmlFor="password">Подтверждение пароля</label>
                            <div className="password-container">
                                <input
                                    type={isHidePass ? 'password' : 'text'}
                                    name="password"
                                    id="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    autoComplete="password"
                                    required />
                            </div>
                            {password && confirmPassword && (
                                <span className={password === confirmPassword ? 'match' : 'no-match'}>
                                    {password === confirmPassword ? 'Пароли совпадают' : 'Пароли не совпадают'}
                                </span>
                            )}

                            <label htmlFor="head">Руководитель</label>
                            <select name="head" id="head" onChange={(e) => setHead(e.target.value)}>
                                <option>Нет</option>
                                {users && users.map(user => {
                                    return <option key={user.id} value={user.id}>{getUserFullName(user.id)}</option>
                                })}
                            </select>
                            <button className="btn btn-primary">{isLoading ? 'Отправка данных' : 'Зарегистрироваться'}</button>
                            {error && <p className="error-message">Ошибка: {error}</p>}
                        </form>

                        <div className="form-link">
                            <div className="word-or">
                                <span></span>
                                <p>или</p>
                                <span></span>
                            </div>
                            <div className="or-link">
                                <p>Есть аккаунт?</p>
                                <Link to={'/login'}>Войти</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;