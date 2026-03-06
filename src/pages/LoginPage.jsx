import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../App";

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
            // console.error(error);
        }
    }

    const changePassVisibility = () => {
        setIsHidePass(!isHidePass);
    }

    return (
        <div className="login">
            <form className="form form-login" onSubmit={handleSubmit}>
                <h1 className="form-title">Вход</h1>
                <input type="text" name="login" id="login" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин" required />
                <div className="password-container">
                    <input type={isHidePass ? 'password' : 'text'} name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" autoComplete="password" required />
                    <div className="show-pass-btn" onClick={changePassVisibility}>
                        <img width={25} src={isHidePass ? 'show.png' : 'hide.png'} alt="Иконка показать/скрыть пароль" title={isHidePass ? 'Показать пароль' : 'Скрыть пароль'} />
                    </div>
                </div>
                <button className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Вход' : 'Войти'}</button>
                {error && <p className="error-message">Ошибка: {error}</p>}
            </form>
            <Link to={'/register'}>Создать аккаунт</Link>
        </div>

    );
}

export default LoginPage;