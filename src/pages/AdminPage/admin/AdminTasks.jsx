import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../App";
import { Link } from "react-router-dom";

const AdminTasks = () => {
    const { allTodos, getUserFullName } = useContext(AppContext);
    const [filteredTodos, setFilteredTodos] = useState([]);

    useEffect(() => {
        setFilteredTodos(allTodos);
    }, [allTodos]);

    const handleSearchTodos = (e) => {
        const text = e.target.value.toLowerCase().trim();

        if (text === '') {
            setFilteredTodos(allTodos);
            return;
        }

        if (allTodos) {
            const filtered = allTodos.filter(todo => {
                return (
                    todo.id?.toString().toLowerCase().includes(text) ||
                    todo.title?.toString().toLowerCase().includes(text) ||
                    todo.status?.toString().toLowerCase().includes(text) ||
                    todo.creator?.toString().toLowerCase().includes(text) ||
                    todo.response?.toString().toLowerCase().includes(text)
                )
            });
            setFilteredTodos(filtered);
        }
    }

    return (
        <>
            <div className="admin-content-header">
                <h1 className="content-header-title">Управление задачами</h1>
                <input className="content-header-search" placeholder="Поиск" onChange={handleSearchTodos} />
            </div>

            <table className="admin-table tasks-table">
                <thead>
                    <tr>
                        <td>id</td>
                        <td>Название</td>
                        <td>Статус</td>
                        <td>Постановщик</td>
                        <td>Ответсвенный</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {filteredTodos && filteredTodos.length > 0 ? filteredTodos.map(todo => (
                        <tr key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.title}</td>
                            <td>{todo.status}</td>
                            <td>{getUserFullName(todo.creator)}</td>
                            <td>{getUserFullName(todo.responsible)}</td>
                            <td><Link to={`${todo.id}`}>Редактировать</Link></td>
                        </tr>
                    )
                    ) :
                        <tr>
                            <td className="search-error" colSpan={6}>Задачи не найдены</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    );
}

export default AdminTasks;