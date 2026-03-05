const StatusBadge = ({status}) => {

    const statusConfig = [
        { text: 'К выполнению', class: 'status-new' },
        { text: 'Выполняется', class: 'status-inwork' },
        { text: 'Выполнена', class: 'status-complete' },
        { text: 'Отменена', class: 'status-discard' },
    ];

    const statusBadge = statusConfig.find(item => item.text === status);
    return (
        <span className={`badge ${statusBadge ? statusBadge.class : ''}`}>{statusBadge ? statusBadge.text : 'Неизвестно'}</span>
    );
}
 
export default StatusBadge;