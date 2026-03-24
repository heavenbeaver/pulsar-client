import TodoCard from "./TodoCard";
import { AppContext } from "../App";
import { useContext, useEffect, useMemo, useCallback } from "react";

const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const str = String(dateStr).trim();
    const parts = str.split(/[.\-/]/);
    if (parts.length === 3) {
        const [a, b, c] = parts.map(Number);
        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            const parsed = new Date(str);
            return isNaN(parsed.getTime()) ? null : parsed;
        }
        const isIso = parts[0].length === 4;
        const year = isIso ? a : (c < 100 ? 2000 + c : c);
        const month = isIso ? b - 1 : b - 1;
        const day = isIso ? c : a;
        return new Date(year, month, day);
    }
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
};

const sortTodos = (todos) => {
    return [...todos].sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
};

const groupByExpireDate = (todos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    const groups = { 'На сегодня': [], 'На неделю': [], 'Будущее': [] };

    todos.forEach((todo) => {
        const expire = parseDate(todo.expireDate);
        if (!expire || isNaN(expire.getTime())) {
            groups['Будущее'].push(todo);
            return;
        }
        const expireDay = new Date(expire.getFullYear(), expire.getMonth(), expire.getDate());

        if (expireDay <= today) {
            groups['На сегодня'].push(todo);
        } else if (expireDay <= weekEnd) {
            groups['На неделю'].push(todo);
        } else {
            groups['Будущее'].push(todo);
        }
    });

    return groups;
};


const TodoList = ({ openModal }) => {
    const { todos, setTodos, user, groupTodoList, getUserFullName, subordinates, setSubordinates, refetch } = useContext(AppContext);

    const groupByResponsible = useCallback((todos) => {
        const groups = {};

        const addPerson = (id) => {
            const key = getUserFullName(id);
            if (!groups[key]) groups[key] = [];
        };

        if (subordinates) subordinates.forEach(sub => addPerson(sub.id));
        addPerson(user.id);
        todos.forEach(todo => addPerson(todo.responsible));
        todos.forEach(todo => {
            const key = getUserFullName(todo.responsible);
            groups[key].push(todo);
        });

        return Object.keys(groups)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .reduce((acc, key) => ({ ...acc, [key]: groups[key] }), {});
    }, [subordinates, getUserFullName, user.id]);

    useEffect(() => {
        if (!user.id) return;

        const fetchSubordinates = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users?managerId=${user.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (!res.ok) throw new Error('Ошибка загрузки подчиненных')
                const data = await res.json();
                setSubordinates(data);
            } catch (err) {
                console.error('Ошибка загрузки подчиненных:', err);
            }
        };

        fetchSubordinates();
    }, [user.id]);

    useEffect(() => {
        if (!user.id) return;

        const abortController = new AbortController();

        const fetchTodos = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos?userId=${user.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    signal: abortController.signal
                });
                if (!res.ok) throw new Error('Ошибка при получении задач');
                const data = await res.json();
                setTodos(data);
            } catch (err) {
                if (err.name !== 'AbortError') console.error(err);
            }
        };

        fetchTodos();
        return () => abortController.abort();

    }, [user.id, refetch]);

    const grouped = useMemo(() => {
        if (!todos) return null;

        const sorted = sortTodos(todos);

        switch (groupTodoList) {
            case 'По ответственным':
                return groupByResponsible(sorted);
            case 'По дате завершения':
                return groupByExpireDate(sorted);
            default:
                return { 'Все задачи': sorted };
        }
    }, [todos, groupTodoList, groupByResponsible]);

    const toggleList = (e) => {
        const title = e.target.parentElement;
        const list = title.nextElementSibling;

        if (title.nextElementSibling.classList.contains('empty-todo-list')) {
            return;
        }
        title.classList.toggle('collapsed');
        list.classList.toggle('collapsed');
    }

    return (
        <div className="todo-wrapper">
            {!grouped ? (
                <p className="empty-message">Загрузка...</p>
            ) : Object.keys(grouped).length === 0 ? (
                <p className="empty-message">Список задач пуст</p>
            ) : (
                Object.entries(grouped).map(([groupName, groupItems]) => (
                    <div key={groupName} className="todo-group">
                        <div className="group-title">
                            <div className="group-name">{groupName}</div>
                            <div className="group-line"></div>
                            <span onClick={toggleList}>{groupItems.length}</span>
                        </div>
                        {groupItems.length > 0 ? (
                            <ul className="todo-list">
                                {groupItems.map(todo => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        openModal={openModal}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-todo-list">Нет задач</div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default TodoList;