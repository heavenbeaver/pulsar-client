import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useCallback, useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';
import './media.css';
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import EditPage from "./pages/EditPage";
import AdminUsers from "./pages/AdminPage/admin/AdminUsers";
import AdminProjects from "./pages/AdminPage/admin/AdminProjects";
import AdminTasks from "./pages/AdminPage/admin/AdminTasks";
import AdminStat from "./pages/AdminPage/admin/AdminStat";
import ForbiddenPage from "./pages/ForbiddenPage";
import EditUser from "./pages/AdminPage/admin/EditUser";

export const AppContext = createContext();



function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [subordinates, setSubordinates] = useState(null);
  const [todos, setTodos] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [todoData, setTodoData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [groupTodoList, setGroupTodoList] = useState(localStorage.getItem('groupTodoList') || 'Без группировок');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setAuthLoading(false)
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); // сохраняем пользователя в контексте
      }

    } catch (err) {
      console.error('Fetch /auth/me error:', err);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    document.body.classList.toggle('light', theme === 'light')
  }, [theme])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        method: 'GET'
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err)
    };
  }, []);

  // Функция для получения ФИО по ID
  const getUserFullName = (userId) => {
    if (!userId) return 'Не назначен';

    const user = users?.find(u => u.id === userId);
    if (!user) return `ID: ${userId}`;

    const fullName = [
      user.lastName,
      user.name,
      user.patronymic
    ].filter(Boolean).join(' ');

    return fullName;
  };

  useEffect(() => {
    fetchUsers();
  }, [user, refetch]);

  useEffect(() => {
    checkAuth();
  }, []);

  if (authLoading) {
    return (
      <div className="loader-wrapper">
        <Loader />
      </div>
    )
  }

  const contextValues = { user, setUser, todos, setTodos, users, setUsers, getUserFullName, editMode, setEditMode, selectedTodoId, setSelectedTodoId, todoData, setTodoData, groupTodoList, setGroupTodoList, subordinates, setSubordinates, refetch, setRefetch, theme, setTheme }

  return (
    <AppContext.Provider value={contextValues}>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<EditUser />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="stat" element={<AdminStat />} />

            {/* Редирект с /admin на /admin/users */}
            <Route index element={<Navigate to="users" replace />} />
          </Route>

          <Route path="/edit" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
          <Route path="/403" element={<ForbiddenPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  )
}

export default App
