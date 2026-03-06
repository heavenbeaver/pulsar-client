const FormEditSkeleton = () => {
    return (
        <div className="todo-form">
            <div className="skeleton" style={{ width: '50%', height: '30px', margin: '0 auto' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: '30px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '200px', marginTop: '30px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: '30px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: '30px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: '30px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px', marginTop: '30px' }}></div>
        </div>
    );
}
 
export default FormEditSkeleton;