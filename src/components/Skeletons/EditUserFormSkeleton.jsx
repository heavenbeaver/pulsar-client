const EditUserFormSkeleton = () => {
    return (
        <div className="user-edit-form">
            <div className="skeleton" style={{ width: '100%', height: '44px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '44px' }}></div>

            <div className="skeleton" style={{ width: '100%', height: '50px', marginTop: '40px' }}></div>

            <div className="action-btns">
                <div className="skeleton" style={{ width: '150px', height: '44px', marginTop: '30px' }}></div>
                <div className="skeleton" style={{ width: '150px', height: '44px', marginTop: '30px' }}></div>
            </div>
        </div>
    );
}
 
export default EditUserFormSkeleton;