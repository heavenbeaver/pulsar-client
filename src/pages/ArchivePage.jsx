import { useEffect, useContext, useState } from "react";
import { AppContext } from "../App";

const ArchivePage = () => {
    const [archivedTodos, setArchivedTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState(null);
    const { user, getUserFullName } = useContext(AppContext);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchArchivedTodos = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/todos/archived?userId=${user.id}&page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const result = await res.json();

            if (page === 1) {
                setArchivedTodos(result.data);
            } else {
                setArchivedTodos(prev => [...prev, ...result.data]);
            }

            setHasMore(page < result.pagination.totalPages);
            setPagination(result.pagination);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!user) return;
        fetchArchivedTodos();
    }, [user, page]);

    return (
        <>
            <div className="archived-todo-counter">Всего задач в архиве: {pagination && pagination.totalItems}</div>
            <ul className="archived-todo-list">
                {isLoading && <p className="empty-message">Загрузка...</p>}
                {!isLoading && archivedTodos.length === 0 && <p className="empty-message">В архиве пусто</p>}

                {archivedTodos && archivedTodos.map(todo => {
                    return (
                        <li className="archived-todo-item" key={todo.id}>
                            <div className="archived-todo-header">
                                <h3 className="todo-item__title">{todo.title}</h3>
                            </div>

                            {todo.desc && <p className="todo-item__desc">{todo.desc}</p>}

                            <div className="archived-todo-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Срок:</span>
                                    <span>{todo.expireDate}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Создал:</span>
                                    <span>{getUserFullName(todo.creator)}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Исполнитель:</span>
                                    <span>{getUserFullName(todo.responsible)}</span>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {!isLoading && 
                <div className="pagination">
                    <span className="pagination-info">Страница {page} из {pagination && pagination.totalPages}</span>
                    {hasMore && <button className="pagination-btn" onClick={() => setPage(prev => prev + 1)}>{isLoading ? 'Загрузка' : 'Загрузить еще'}</button>}
                </div>
            }
        </>

    );
}

export default ArchivePage;