import PlusIcon from "../icons/PlusIcon";

const TodoCreateBtn = ({openModal, setEditMode, theme}) => {
    return (
        <button className="new-todo" onClick={() => {openModal('create'); setEditMode('create')}}><PlusIcon theme={theme} /></button>
    );
}
 
export default TodoCreateBtn;