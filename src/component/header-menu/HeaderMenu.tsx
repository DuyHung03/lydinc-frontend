import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

interface MenuItem {
    label: string;
    path: string;
    role?: string;
}

function HeaderMenu() {
    const location = useLocation();
    const { user } = useAuthStore();

    const menuItems: MenuItem[] = [
        { label: 'Home', path: '/' },
        { label: 'Lecturer', path: '/lecturer', role: 'LECTURER' },
        { label: 'My courses', path: '/student', role: 'STUDENT' },
        { label: 'Admin', path: '/admin', role: 'ADMIN' },
    ];
    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className='flex flex-row items-center'>
            {menuItems.map((item, index) => {
                const isVisible = !item.role || (user?.roles && user.roles.includes(item.role));
                return (
                    isVisible && (
                        <div key={index}>
                            <Link to={item.path}>
                                <p
                                    className={`menu-header-item ${
                                        isActive(item.path)
                                            ? 'text-primary duration-200 underline'
                                            : ''
                                    }`}
                                >
                                    {item.label}
                                </p>
                            </Link>
                        </div>
                    )
                );
            })}
        </div>
    );
}

export default HeaderMenu;
