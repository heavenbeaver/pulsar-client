import './style.css';
import Layout from "../../components/Layout";
import AdminPanelIcon from '../../icons/AdminPanelIcon';
import UsersIcon from '../../icons/UsersIcon';
import { NavLink, Outlet } from 'react-router-dom';

const AdminPage = () => {
    return (
        <>
            <Layout>
                <div className="container">
                    <div className="admin-wrapper">
                        <aside className="admin-aside">
                            <ul className="admin-items">
                                <li className="admin-item">
                                    <NavLink to="users" className='admin-item-btn'>
                                        <UsersIcon/>
                                        <span>Управление пользователями</span>
                                    </NavLink>
                                </li>
                                {/* <li className="admin-item">
                                    <NavLink to="projects" className='admin-item-btn'>
                                        <AdminPanelIcon/>
                                        <span>Управление проектами</span>
                                    </NavLink>
                                </li> */}
                                <li className="admin-item">
                                    <NavLink to="tasks" className='admin-item-btn'>
                                        <AdminPanelIcon/>
                                        <span>Управление задачами</span>
                                    </NavLink >
                                </li>
                                {/* <li className="admin-item">
                                    <NavLink to="/admin/users" className='admin-item-btn'>
                                        <AdminPanelIcon/>
                                        <span>Категории</span>
                                    </NavLink >
                                </li> */}
                                <li className="admin-item">
                                    <NavLink to="stat" className='admin-item-btn'>
                                        <AdminPanelIcon/>
                                        <span>Статистика и аналитика</span>
                                    </NavLink >
                                </li>
                            </ul>
                        </aside>

                        <div className="admin-content">
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default AdminPage;