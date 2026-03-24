import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';
import { useContext } from 'react';
import { AppContext } from '../App';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const currentDate = new Date().getTime();

const TodoCard = ({ cardKey, todo, openModal }) => {
    const { title, desc, expireDate, createDate, updateDate, priority, status, creator, responsible } = todo;
    const { getUserFullName, setSelectedTodoId } = useContext(AppContext);

    const expireDateObj = new Date(expireDate.split('.').reverse().join('-')).getTime();
    const createDateString = new Date(createDate).toLocaleDateString('ru-RU');
    const updateDateString = new Date(updateDate).toLocaleDateString('ru-RU');

    function getFullTime(timeString) {
        const hours = new Date(timeString).getHours() < 10 ? `0${new Date(timeString).getHours()}` : new Date(timeString).getHours();
        const minutes = new Date(timeString).getMinutes() < 10 ? `0${new Date(timeString).getMinutes()}` : new Date(timeString).getMinutes();
        const fullTime = `${hours}:${minutes}`;
        return fullTime;
    }

    return (
        <li className={`todo-card ${expireDateObj < currentDate && status != 'Выполнена' && 'expired'}`} key={cardKey} onClick={() => { openModal('edit'); setSelectedTodoId(todo.id) }}>

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
                    <div className='meta-item-header'>
                        <CalendarIcon />
                        <span>Срок выполнения: </span>
                    </div>
                    <span>{expireDate}</span>
                </div>

                <div className="meta-item">
                    <div className='meta-item-header'>
                        <CalendarIcon />
                        <span>Дата создания:</span>
                    </div>
                    <span>{createDateString} - {getFullTime(createDate)}</span>
                </div>

                <div className="meta-item">
                    <div className="meta-item-header">
                        <ClockIcon />
                        <span>Дата обновления:</span>
                    </div>
                    <span>{updateDateString} - {getFullTime(updateDate)}</span>
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