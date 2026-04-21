import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useCallback, useEffect, useState } from "react";

import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import EditPage from "./pages/EditPage";
import AdminUsers from "./pages/AdminPage/admin/AdminUsers";
import AdminTasks from "./pages/AdminPage/admin/AdminTasks";
import AdminStat from "./pages/AdminPage/admin/AdminStat";
import ForbiddenPage from "./pages/ForbiddenPage";
import EditUser from "./pages/AdminPage/admin/EditUser";
import ArchivePage from "./pages/ArchivePage";
import TodoListPage from "./pages/TodoListPage";

import './App.css';
import './media.css';

export const AppContext = createContext();

const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [subordinates, setSubordinates] = useState(null);
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [todoData, setTodoData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [groupTodoList, setGroupTodoList] = useState(localStorage.getItem('groupTodoList') || 'Без группировок');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || getSystemTheme();
  });

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData); // сохраняем пользователя в контексте
        }
      } catch (error) {
        console.error('Fetch /auth/me error:', error);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error)
    };
  }, []);

  const fetchAllTodos = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const todoData = await response.json();
      setAllTodos(todoData);
    } catch (error) {
      console.error(error);
    }
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
    if (user) {
      fetchAllTodos();
    }
  }, [user, refetch])

  if (authLoading) {
    return (
      <div className="loader-wrapper">
        <Loader />
      </div>
    )
  }

  return (
      <AppContext.Provider value={{ user, setUser, authLoading, todos, setTodos, allTodos, setAllTodos, users, setUsers, getUserFullName, editMode, setEditMode, selectedTodoId, setSelectedTodoId, todoData, setTodoData, groupTodoList, setGroupTodoList, subordinates, setSubordinates, refetch, setRefetch, theme, setTheme }}>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>}>
              <Route index element={<TodoListPage />} />
              <Route path="archive" element={<ArchivePage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<EditUser />} />
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
