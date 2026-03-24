import { Link } from "react-router-dom";

const ForbiddenPage = () => {
    return (
        <div className="not-found">
            <h1>403</h1>
            <p>Доступ запрещен</p>
            <Link to={'/'}>Вернуться на главную</Link>
        </div>
    );
}
 
export default ForbiddenPage;