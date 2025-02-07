import { Avatar, Menu } from '@mantine/core';
import { Logout, Notifications } from '@mui/icons-material';
import useAuthStore from '../../store/useAuthStore';

function HeaderUserMenu() {
    const { user, logout } = useAuthStore();
    const handleLogout = () => {
        logout();
        window.location.replace('/login');
    };
    return (
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
                    <button className='w-full h-full' onClick={handleLogout}>
                        <Menu.Item leftSection={<Logout style={{ fontSize: '16px' }} />} c={'red'}>
                            Logout
                        </Menu.Item>
                    </button>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}

export default HeaderUserMenu;
