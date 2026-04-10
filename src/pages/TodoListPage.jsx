import TodoList from "../components/TodoList";
import { useOutletContext } from "react-router-dom";

const TodoListPage = () => {
    const { openModal, closeModal } = useOutletContext();
    
    return (
        <TodoList openModal={openModal} closeModal={closeModal} />
    );
}
 
export default TodoListPage;