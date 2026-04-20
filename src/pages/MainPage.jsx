import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../App";
import { useNavigate, Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import TodoList from "../components/TodoList";
import TodoSort from "../components/TodoSort";
import TodoCreateBtn from "../components/TodoCreateBtn";
import Modal from "../components/Modal/Modal";
import ScrollTopBtn from "../components/ScrollTopBtn";

const scrollTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
};

const MainPage = () => {
    const { setEditMode, setSelectedTodoId, setTodoData, theme } = useContext(AppContext);
    const [showButton, setShowButton] = useState(false);
    const modal = useRef('');
    const overlay = useRef('');
    const navigate = useNavigate();

    const openModal = (mode) => {
        setEditMode(mode)
        modal.current.classList.add('active');
        overlay.current.classList.add('active');
        document.body.classList.add('modal-open');
    }

    const closeModal = () => {
        setEditMode(null);
        setSelectedTodoId(null);
        setTodoData(null);
        modal.current.classList.remove('active');
        overlay.current.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Отслеживание скролла
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        <>
            <Layout>
                <div className="container">
                    <TodoSort />
                    <Outlet context={{openModal, closeModal}} />
                </div>

                <TodoCreateBtn theme={theme} openModal={openModal} setEditMode={setEditMode} />
                <div ref={overlay} className="modal-overlay" onClick={closeModal}></div>
                <Modal ref={modal} closeModal={closeModal} />
                {showButton && <ScrollTopBtn theme={theme} scrollTop={scrollTop} />}
            </Layout>
        </>
    );
}

export default MainPage;