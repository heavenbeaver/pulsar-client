import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';
import { useContext } from 'react';
import { AppContext } from '../App';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const TodoCard = ({ cardKey, todo, openModal }) => {
    const { title, desc, expireDate, createDate, updateDate, priority, status, creator, responsible } = todo;
    const { getUserFullName, setSelectedTodoId } = useContext(AppContext);

    const currentDate = new Date().toLocaleDateString('ru-RU');
    const expireDateObj = new Date(expireDate).toLocaleDateString('ru-RU');
    const createDateString = new Date(createDate).toLocaleDateString('ru-RU');
    const updateDateString = new Date(updateDate).toLocaleDateString('ru-RU');

    function getFullTime(timeString) {
        const hours = new Date(timeString).getHours() < 10 ? `0${new Date(timeString).getHours()}` : new Date(timeString).getHours();
        const minutes = new Date(timeString).getMinutes() < 10 ? `0${new Date(timeString).getMinutes()}` : new Date(timeString).getMinutes();
        const fullTime = `${hours}:${minutes}`;
        return fullTime;
    }

    return (
        <li className={`todo-card ${expireDateObj < currentDate && status !== 'Выполнена' && 'expired'}`} key={cardKey} onClick={() => {openModal('edit'); setSelectedTodoId(todo.id)}}>
            
            <div className="todo-card-header">
                <div className="todo-badges">
                    <PriorityBadge priority={priority} />
                    <StatusBadge status={status} />
                    {expireDateObj < currentDate && status !== 'Выполнена' && (
                        <span className='badge badge-expired'>Просрочена</span>
                    )}
                </div>
                <h3 className="todo-title">{title}</h3>
            </div>

            <p className="todo-description">{desc ? desc : 'Описание отсутствует'}</p>

            <div className="todo-meta">

                <div className="meta-item">
                    <CalendarIcon />
                    <span>Срок выполнения: {expireDate}</span>
                </div>

                <div className="meta-item">
                    <CalendarIcon />
                    <span>Дата создания: {createDateString} в {getFullTime(createDate)}</span>
                </div>

                <div className="meta-item">
                    <ClockIcon />
                    <span>Дата обновления: {updateDateString} в {getFullTime(updateDate)}</span>
                </div>
            </div>

            <div className="todo-footer">
                <div className="user-info">
                    <span className="info__user-label">Создатель:</span>
                    <span className="info__user-name">{getUserFullName(creator)}</span>
                </div>
                <div className="user-info">
                    <span className="info__user-label">Ответственный:</span>
                    <span className="info__user-name">{getUserFullName(responsible)}</span>
                </div>
            </div>
        </li>
    );
}

export default TodoCard;