import CrossIcon from '../../icons/CrossIcon'

const CloseBtn = ({closeModal, theme}) => {
    return (
        <button className="btn-close" onClick={closeModal}><CrossIcon theme={theme} /></button>
    );
}
 
export default CloseBtn;