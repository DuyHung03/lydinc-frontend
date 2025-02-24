import { Avatar, Menu } from '@mantine/core';
import { Logout, Notifications } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Noti } from '../../types/types';
import Notification from '../notification/Notification';

function HeaderUserMenu() {
    const { user, logout } = useAuthStore();
    const [notifications, setNotifications] = useState<Noti[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket(`ws://localhost:8080/api/notifications`);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to WebSocket');
            };

            ws.onmessage = (event) => {
                try {
                    const parsedMessage = JSON.parse(event.data);
                    setNotifications((prev) => [...prev, parsedMessage]);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                console.warn('WebSocket closed, attempting to reconnect...', event.reason);
                setTimeout(connectWebSocket, 5000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current.onmessage = null;
                socketRef.current.onclose = null;
                socketRef.current.onerror = null;
            }
        };
    }, [user?.userId]);

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
                        <Notification noti={notifications} />
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
