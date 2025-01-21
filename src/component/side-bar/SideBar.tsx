import home from '../../assets/home.svg';
import SideBarItem from '../side-bar-item/SideBarItem';
function SideBar() {
    const sideBarItems = [
        {
            title: 'Home',
            icon: home,
            path: '/',
        },
        {
            title: 'Lecturer',
            icon: home,
            path: '/lecturer',
        },
    ];

    return (
        <div className='flex flex-col gap-4 p-4 justify-center items-center'>
            {sideBarItems.map((item, index) => (
                <SideBarItem key={index} title={item.title} icon={item.icon} path={item.path} />
            ))}
        </div>
    );
}

export default SideBar;
