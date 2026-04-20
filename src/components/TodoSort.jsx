import { Link } from "react-router-dom";
import { AppContext } from "../App";
import { useContext, useMemo } from "react";

const TodoSort = ({ openModal, setEditMode }) => {
    const { groupTodoList, setGroupTodoList, todos } = useContext(AppContext);

    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('.');
        return new Date(year, month - 1, day);
    }

    const currentDate = new Date().toLocaleDateString('ru-RU');
    const currentDateObj = parseDate(currentDate);

    const counts = useMemo(() => {
        if (!todos) {
            return {
                total: 0,
                expired: 0,
                inwork: 0
            }
        }

        return todos.reduce((acc, todo) => {
            // общее кол-во
            acc.total++;

            // к выполнению
            if (todo.status === 'К выполнению') acc.inwork++;

            // просрочено
            if (todo.expireDate) {
                const expireDate = parseDate(todo.expireDate);
                if (expireDate && expireDate < currentDateObj && todo.status !== 'Выполнена') acc.expired++;
            }

            return acc;
        }, { total: 0, expired: 0, inwork: 0 });

    }, [todos])

    const inworkTodos = [];
    const expiredTodos = [];
    todos && todos.forEach(todo => {
        if (todo.status === 'К выполнению') inworkTodos.push(todo);
        if (parseDate(todo.expireDate) < parseDate(currentDate)) expiredTodos.push(todo);
    });

    return (
        <div className="toolbar">
            <div className="todo-sort">
                <div className="todo-sort-select">
                    <select name="group" id="group" value={groupTodoList} onChange={(e) => { setGroupTodoList(e.target.value); localStorage.setItem('groupTodoList', e.target.value) }}>
                        <option value="Без группировок">Без группировок</option>
                        <option value="По дате завершения">По дате завершения</option>
                        <option value="По ответственным">По ответственным</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={() => {openModal('create'); setEditMode('create')}}>Новая задача</button>
            </div>
            <div className="todo-counter">
                <Link to={'/archive'} className="counter__bage bage-all">
                    Архив
                </Link>
                <Link to={'/'} className="counter__bage bage-all">
                    Всего: <span>{counts && counts.total}</span>
                </Link>
                <div className="counter__bage bage-expired">
                    Просрочено: <span>{counts && counts.expired}</span>
                </div>
                <div className="counter__bage bage-inwork">
                    К выполнению: <span>{counts && counts.inwork}</span>
                </div>
            </div>
        </div>
    );
}

export default TodoSort;