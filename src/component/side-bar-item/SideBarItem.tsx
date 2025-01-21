import { Link, useLocation } from 'react-router-dom';

function SideBarItem({ title, icon, path }: { title: string; icon: string; path: string }) {
    const location = useLocation();

    const isActive = location.pathname.includes(path);

    return (
        <Link to={path} style={{ width: '100%' }}>
            <div
                className={`flex flex-col w-full items-center justify-center rounded-lg p-2 cursor-pointer ${
                    isActive ? 'bg-gray-200 text-primary' : 'hover:bg-gray-100'
                }`}
            >
                <div className='flex'>
                    <img src={icon} className='bg-gray-200' />
                </div>
                <p className='text-sm font-semibold'>{title}</p>
            </div>
        </Link>
    );
}

export default SideBarItem;
