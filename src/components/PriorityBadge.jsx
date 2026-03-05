const PriorityBadge = ({priority}) => {

    const priorityConfig = [
        {text: 'Низкий', class: 'priority-low'},
        {text: 'Средний', class: 'priority-medium'},
        {text: 'Высокий', class: 'priority-high'}
    ];

    const priorityBadge = priorityConfig.find(item => item.text === priority);
    

    return (
        <span className={`badge ${priorityBadge ? priorityBadge.class : ''}`}>{priorityBadge ? priorityBadge.text : 'Неизвестный статус'}</span>
    );
}
 
export default PriorityBadge;