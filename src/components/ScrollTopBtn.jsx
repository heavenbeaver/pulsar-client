import ArrowUp from "../icons/ArrowUp";

const ScrollTopBtn = ({scrollTop, theme}) => {
    return (
        <button className="btn-up" onClick={scrollTop}><ArrowUp theme={theme} /></button>
    );
};
 
export default ScrollTopBtn;