import TodoCard from "./TodoCard";
import { AppContext } from "../App";
import { useContext, useEffect, useMemo } from "react";


const TodoList = ({ openModal }) => {
    const { todos, setTodos, user, groupTodoList, getUserFullName, subordinates, setSubordinates } = useContext(AppContext);

    useEffect(() => {
        const fetchSubordinates = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users?managerId=${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                console.log(data);
                setSubordinates(data); // Массив подчиненных
            } catch (err) {
                console.error('Ошибка загрузки подчиненных:', err);
            }
        };

        if (user.id) fetchSubordinates();
    }, [])

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
    }

    const groupByResponsible = (todos) => {
        const groups = {};

        // Функция для добавления человека в группы
        const addPerson = (id) => {
            const key = getUserFullName(id);
            if (!groups[key]) {
                groups[key] = [];
            }
        };

        // Добавляем всех подчиненных (если есть)
        if (subordinates) {
            subordinates.forEach(sub => addPerson(sub.id));
        }

        // Добавляем руководителя
        addPerson(user.id);

        // Добавляем всех ответственных из задач
        todos.forEach(todo => addPerson(todo.responsible));

        // Распределяем задачи
        todos.forEach(todo => {
            const key = getUserFullName(todo.responsible);
            groups[key].push(todo);
        });

        // Сортируем группы по алфавиту и возвращаем
        const sortedGroups = {};
        Object.keys(groups)
            .sort((a, b) => a.localeCompare(b, 'ru'))
            .forEach(key => {
                sortedGroups[key] = groups[key];
            });

        return sortedGroups;
    };

    const groupByExpireDate = (todos) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        weekEnd.setHours(0, 0, 0, 0);

        const groups = { 'На сегодня': [], 'На неделю': [], 'Будущее': [] };

        todos.forEach((todo) => {
            const expire = parseDate(todo.expireDate);
            if (!expire || isNaN(expire.getTime())) {
                groups['Будущее'].push(todo);
                return;
            }
            const expireDay = new Date(expire.getFullYear(), expire.getMonth(), expire.getDate());

            if (expireDay.getTime() === today.getTime() || expireDay.getTime() < today.getTime()) {
                groups['На сегодня'].push(todo);
            } else if (expireDay > today && expireDay <= weekEnd) {
                groups['На неделю'].push(todo);
            } else {
                groups['Будущее'].push(todo);
            }
        });

        return groups;
    };

    const groupTodos = (todos) => {
        const sorted = sortTodos(todos);

        switch (groupTodoList) {
            case 'По ответственным':
                return groupByResponsible(sorted);
            case 'По дате завершения':
                return groupByExpireDate(sorted);
            default:
                return { 'Все задачи': sorted };
        }
    }
    
    const grouped = useMemo(() => {
        return todos ? groupTodos(todos) : null;
    }, [todos]);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchTodos = async () => {
            if (!user.id) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos?userId=${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    signal: abortController.signal
                });
                if (!res.ok) {
                    console.error('Ошибка при получении задач');
                    return;
                }
                const data = await res.json();
                setTodos(data);
            } catch (err) {
                console.error(err)
            }
        }

        fetchTodos();

        return () => abortController.abort();

    }, [setTodos, todos, user?.id ]);

    return (
        <div className="todo-wrapper">
            {!grouped ? (
                <p className="empty-message">Загрузка...</p>
            ) : Object.keys(grouped).length === 0 ? (
                <p className="empty-message">Список задач пуст</p>
            ) : (
                Object.entries(grouped).map(([groupName, groupItems]) => {

                    return (
                        <div key={groupName} className="todo-group">

                            <div className="group-title">
                                <div className="group-name">{groupName}</div>
                                <div className="group-line"></div>
                                <span>{groupItems.length}</span>
                            </div>

                            <ul className="todo-list">
                                {groupItems.map(todo => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        openModal={openModal}
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default TodoList;
