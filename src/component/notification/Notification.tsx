import { Noti } from '../../types/types';

const Notification = ({ noti }: { noti: Noti[] }) => {
    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {noti.map((n, index) => (
                    <li key={index}>
                        {n.title} - {n.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;
