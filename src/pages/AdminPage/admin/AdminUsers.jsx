import { AppContext } from "../../../App";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const AdminUsers = () => {
    const { users, getUserFullName } = useContext(AppContext);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    const handleSearch = (e) => {
        const text = e.target.value.toLowerCase().trim();

        if (text === '') {
            setFilteredUsers(users);
            return;
        }

        if (users) {
            const filtered = users.filter(user => {
                return (
                    user.name?.toLowerCase().includes(text) ||
                    user.lastName?.toLowerCase().includes(text) ||
                    user.patronymic?.toLowerCase().includes(text) ||
                    user.login?.toLowerCase().includes(text)
                )
            });
            setFilteredUsers(filtered);
        }
    }

    return (
        <>
            <div className="admin-content-header">
                <h1 className="content-header-title">Управление пользователями</h1>
                <input className="content-header-search" placeholder="Поиск" onChange={handleSearch} />
            </div>

            <table className="admin-table users-table">
                <thead>
                    <tr>
                        <td>id</td>
                        <td>Имя</td>
                        <td>Фамилия</td>
                        <td>Отчество</td>
                        <td>Логин</td>
                        <td>Руководитель</td>
                        <td>Админ</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers && filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.lastName}</td>
                            <td>{user.patronymic}</td>
                            <td>{user.login}</td>
                            <td>{getUserFullName(user.head)}</td>
                            <td>{user.isAdmin ? 'Да' : 'Нет'}</td>
                            <td><NavLink to={`${user.id}`}>Редактировать</NavLink></td>
                        </tr>
                    )
                    ) :
                        <tr>
                            <td className="search-error" colSpan={8}>Пользователь не найден</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    );
}

export default AdminUsers;