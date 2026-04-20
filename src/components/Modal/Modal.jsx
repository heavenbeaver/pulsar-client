import { forwardRef, useState, useContext, useEffect, useMemo } from "react";
import { AppContext } from "../../App";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { Russian } from "flatpickr/dist/l10n/ru";
import FormSkeleton from "../Skeletons/FormSkeleton";
import CloseBtn from "./CloseBtn";

const Modal = forwardRef(({ closeModal }, ref) => {
    const { user, users, getUserFullName, editMode, selectedTodoId, todoData, setTodoData, refetch, setRefetch, theme } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [priority, setPriority] = useState('Низкий');
    const [responsible, setResponsible] = useState('');
    const [status, setStatus] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [loadingTodo, setLoadingTodo] = useState(false);

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            title,
            desc,
            expireDate,
            priority,
            status: 'К выполнению',
            creator: user.id,
            responsible: responsible || user.id
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                console.log(res)
            }

            // сброс формы
            setLoading(false);
            setTitle('');
            setDesc('');
            setExpireDate('');
            setPriority('Высокий');
            setResponsible(user.id);
            setRefetch(!refetch);
            closeModal();
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteTodo = async (e) => {
        e.preventDefault();
        setDeleting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/${selectedTodoId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) {
                setDeleting(false)
                console.error('Ошибка при удалении задачи');
                return;
            }

            setDeleting(false);
            setRefetch(!refetch);
            closeModal();
        } catch (err) {
            setDeleting(false)
            console.error(err)
        }
    }

    useEffect(() => {
        if (!selectedTodoId) return;

        const fetchTodoData = async () => {
            setLoadingTodo(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/${selectedTodoId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    console.error('Ошибка при получении задачи');
                    return;
                }

                const data = await res.json();
                setTodoData(data);
                setRefetch(!refetch);
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingTodo(false);
            }
        }

        fetchTodoData();
    }, [selectedTodoId]);

    useEffect(() => {
        if (editMode === 'edit') {
            setTitle(todoData.title);
            setDesc(todoData.desc);
            setExpireDate(todoData.expireDate);
            setPriority(todoData.priority);
            setResponsible(todoData.responsible);
            setStatus(todoData.status);
        }
    }, [todoData]);

    useEffect(() => {
        if (editMode === 'create') {
            setTitle('');
            setDesc('');
            setExpireDate('');
            setPriority('Низкий');
            setResponsible(user?.id || '');
            setStatus('К выполнению');
        }
    }, [editMode, user]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentDate = new Date().toISOString(); // текущая дата

        const formData = {
            title,
            desc,
            expireDate,
            updateDate: currentDate,
            priority,
            status,
            responsible: responsible || user.id
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/${todoData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                console.log(res)
            }
            setLoading(false);
            setRefetch(!refetch);
            closeModal();
        } catch (error) {
            console.log(error)
        }
    }

    const handleComplete = async (e) => {
        e.preventDefault();
        setLoading(true);

        let newStatus = '';

        if (todoData.status === 'К выполнению') {
            newStatus = 'Выполняется';
        } else if (todoData.status === 'Выполняется') {
            newStatus = 'Выполнена';
        } else {
            newStatus = 'К выполнению';
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/${todoData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (!res.ok) {
                console.log(res)
            }
            setLoading(false);
            setRefetch(prev => !prev);
            closeModal();
        } catch (error) {
            console.log(error)
        }
        
    }

    const canEditFields = () => {
        if (!todoData || !user) return false;

        return (
            todoData.creator === user.id ||
            todoData.creator === user.head
        );
    };

    const canEdit = canEditFields();

    const pickerOptions = useMemo(() => ({
        locale: Russian,
        dateFormat: "d.m.Y"
    }), []);

    return (
        <div ref={ref} className="modal">
            {editMode === 'create' ? (
                <form className="todo-form" onSubmit={handleSubmit}>
                    <h2 className="form-title">Создание задачи</h2>
                    <input type="text" name="title" id="title" value={title} placeholder="Название" onChange={(e) => setTitle(e.target.value)} required />

                    <textarea placeholder="Описание задачи" name="desc" id="desc" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>

                    <label htmlFor="date">Срок выполнения до:</label>
                    {isMobile ? (
                        <>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={expireDate ? expireDate.split('.').reverse().join('-') : ''} // dd.mm.yyyy → yyyy-mm-dd
                                onChange={(e) => {
                                    const [y, m, d] = e.target.value.split('-');
                                    setExpireDate(`${d}.${m}.${y}`); // обратно в dd.mm.yyyy
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Flatpickr
                                id="date"
                                name="date"
                                value={expireDate}
                                options={pickerOptions}
                                placeholder="Выбрать дату..."
                                onChange={(selectedDates, dateStr) => setExpireDate(dateStr)}
                            />
                        </>
                    )}
                    <label htmlFor="priority">Приоритет:</label>
                    <select name="priority" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="Высокий">Высокий</option>
                        <option value="Средний">Средний</option>
                        <option value="Низкий">Низкий</option>
                    </select>
                    <label htmlFor="responsible">Ответственный за выполнение:</label>
                    <select name="responsible" id="responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)}>
                        <option value={user.id}>{getUserFullName(user.id)}</option>

                        {users && users.filter(item => item.head === user.id).map(user => {
                            return <option key={user.id} value={user.id}>{getUserFullName(user.id)}</option>
                        })}
                    </select>
                    <button className="btn btn-primary" disabled={loading}>{loading ? 'Создание' : 'Создать задачу'}</button>
                </form>
            ) : loadingTodo ? (
                <FormSkeleton />
            ) : (
                <form className="todo-form" onSubmit={handleEditSubmit}>
                    <h2 className="form-title">Редактирование</h2>
                    <textarea disabled={!canEdit} type="text" name="title" id="title" value={title} placeholder="Название" onChange={(e) => setTitle(e.target.value)}></textarea>
                    <textarea disabled={!canEdit} placeholder="Описание задачи" name="desc" id="desc" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                    {isMobile ? (
                        <>
                            <label htmlFor="date">Срок выполнения до:</label>
                            <input
                                disabled={!canEdit}
                                type="date"
                                id="date"
                                name="date"
                                value={expireDate ? expireDate.split('.').reverse().join('-') : ''} // dd.mm.yyyy → yyyy-mm-dd
                                onChange={(e) => {
                                    const [y, m, d] = e.target.value.split('-');
                                    setExpireDate(`${d}.${m}.${y}`); // обратно в dd.mm.yyyy
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <label htmlFor="date">Срок выполнения до:</label>
                            <Flatpickr
                                disabled={!canEdit}
                                id="date"
                                name="date"
                                value={expireDate}
                                options={pickerOptions}
                                placeholder="Выбрать дату..."
                                onChange={(selectedDates, dateStr) => setExpireDate(dateStr)}
                            />
                        </>
                    )}
                    <label htmlFor="priority">Приоритет:</label>
                    <select disabled={!canEdit} name="priority" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="Высокий">Высокий</option>
                        <option value="Средний">Средний</option>
                        <option value="Низкий">Низкий</option>
                    </select>

                    {canEdit && (
                        <>
                            <label htmlFor="responsible">Ответственный за выполнение:</label>
                            <select disabled={!canEdit} name="responsible" id="responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)}>
                                <option value={user.id}>{getUserFullName(user.id)}</option>
                                {users && users.filter(item => item.head == user.id).map(user => {
                                    return <option key={user.id} value={user.id}>{getUserFullName(user.id)}</option>
                                })}
                            </select>
                        </>
                    )}

                    {canEdit && (
                        <>
                            <label htmlFor="status">Статус:</label>
                            <select name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value='К выполнению'>К выполнению</option>
                                <option value='Выполняется'>Выполняется</option>
                                <option value='Выполнена'>Выполнена</option>
                                <option value='Отменена'>Отменена</option>
                            </select>
                        </>
                    )}

                    {canEdit &&
                        <button className="btn btn-primary" disabled={loading}>{loading ? 'Сохранение' : 'Сохранить'}</button>
                    }
                    {!canEdit &&
                        <button className="btn btn-primary" disabled={loading} onClick={handleComplete}>{
                            todoData && todoData.status === 'К выполнению' ? 'Начать выполнение' : 'Завершить задачу'
                        }</button>
                    }
                    {canEdit &&
                        <button className="btn btn-delete" disabled={deleting} onClick={handleDeleteTodo}>{deleting ? 'Удаление' : 'Удалить'}</button>
                    }
                </form>
            )
            }

            <CloseBtn closeModal={closeModal} theme={theme} />
        </div>
    );
})

export default Modal;