import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import ArrowBackIcon from "../icons/ArrowBackIcon";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

const EditPage = () => {
    const { user, setUser } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        patronymic: '',
        login: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            name: user.name,
            lastName: user.lastName,
            patronymic: user.patronymic,
            login: user.login
        }))
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(prev => !prev);
        setMessage('');
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/${user.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const userUpdates = await response.json();
                setUser(prev => ({
                    ...prev,
                    name: userUpdates.name,
                    lastName: userUpdates.lastName,
                    patronymic: userUpdates.patronymic,
                    login: userUpdates.login
                }));
                setMessage('Пользователь успешно сохранен!');
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
            setTimeout(() => {
                setMessage('')
            }, 1000)
        }
    }

    return (
        <>
            <Layout>
                <div className="container">
                    <div className="admin-content-header">
                        <h1 className="content-header-title">Редактирование профиля</h1>
                        <Link to="/" className="back-link">
                            <ArrowBackIcon />
                            <span>Назад</span>
                        </Link>
                    </div>
                    <form className="form-edit-profile" onSubmit={handleSubmit}>
                        <input type="text" name="lastName" id="lastName" placeholder="Фамилия" value={formData.lastName} onChange={handleChange} />
                        <input type="text" name="name" id="name" placeholder="Имя" value={formData.name} onChange={handleChange} />
                        <input type="text" name="patronymic" id="patronymic" placeholder="Отчество" value={formData.patronymic} onChange={handleChange} />
                        <input type="text" name="login" id="login" placeholder="Логин" value={formData.login} onChange={handleChange} />
                        <button className="btn btn-primary" type="submit">{isLoading ? 'Сохранение' : 'Сохранить'}</button>
                        {message && <p className="success-message">{message}</p>}
                    </form>
                </div>
            </Layout>
        </>
    );
}

export default EditPage;