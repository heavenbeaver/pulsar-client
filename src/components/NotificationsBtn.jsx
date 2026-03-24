import NotifIcon from "../icons/NotifIcon";

const NotificationsBtn = () => {
    return (
        <button className="notifications-btn" type="button" aria-label="Показать уведомления">
            <NotifIcon />
            <span></span>
        </button>
    );
}
 
export default NotificationsBtn;