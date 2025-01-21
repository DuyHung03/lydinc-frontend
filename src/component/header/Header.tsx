import { Avatar, Menu } from '@mantine/core';
import { Logout, Notifications } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo_2.png';
import useAuthStore from '../../store/useAuthStore';
import HeaderMenu from '../header-menu/HeaderMenu';

function Header() {
    const { isAuthenticated, logout, user } = useAuthStore();
    const handleLogout = () => {
        logout();
        window.location.replace('/login');
    };
    return (
        <div
            className='flex justify-between align-middle bg-white h-headerHeight w-screen px-10'
            style={{ borderBottom: '1px solid #e0e0e0' }}
        >
            <a href='/' className='h-full flex items-center'>
                <img src={logo} alt='logo' className='w-316' />
            </a>

            <HeaderMenu />

            {!isAuthenticated ? (
                <div className='flex gap-2 items-center'>
                    <p className='italic text-gray-500'>Please login</p>
                    <Link to='/login' className='text-primary'>
                        <button className='primary-btn '>Login</button>
                    </Link>
                </div>
            ) : (
                <div className='flex gap-6 items-center cursor-pointer'>
                    <Menu trigger='hover' shadow='md'>
                        <Menu.Target>
                            <Notifications color='action' />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <p>Empty!</p>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <Menu trigger='hover' shadow='md'>
                        <Menu.Target>
                            <div className='flex gap-2 items-center'>
                                <p>{user?.username}</p>
                                <Avatar size={'md'} src={user?.photoUrl ?? user?.username} />
                            </div>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item>
                                <p>User</p>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                leftSection={<Logout style={{ fontSize: '16px' }} />}
                                c={'red'}
                            >
                                <button className='w-full h-full' onClick={handleLogout}>
                                    Logout
                                </button>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            )}
        </div>
    );
}

export default Header;
