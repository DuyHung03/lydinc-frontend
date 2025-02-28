import { Avatar, Indicator, Menu } from '@mantine/core';
import { Logout, Notifications } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { Noti } from '../../types/types';
import Notification from '../notification/Notification';

function HeaderUserMenu() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const [notifications, setNotifications] = useState<Noti[]>([]);
    const [unseenNotifications, setUnseenNotifications] = useState<Noti[]>([]);
    const socketsRef = useRef<{ [key: string]: WebSocket | null }>({});
    const cookies = new Cookies();
    const token = cookies.get('accessToken');
    const [opened, setOpened] = useState(false);
    const [isBadgeVisible, setIsBadgeVisible] = useState(true);

    const getAllNotifications = async () => {
        const res = await axiosInstance.get('notification/get-by-user');
        return res.data;
    };

    const { data: notiData } = useQuery<Noti[]>({
        queryKey: ['notifications', user?.username],
        queryFn: getAllNotifications,
        enabled: isAuthenticated,
        gcTime: 600000,
    });

    useEffect(() => {
        if (notiData) {
            setNotifications(notiData);
            setUnseenNotifications(notiData.filter((noti) => !noti.isSeen));
        }
    }, [notiData]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const connectWebSocket = (type: string, path: string) => {
            if (socketsRef.current[path]) return;

            const ws = new WebSocket(`ws://localhost:8080/api/notifications/${type}/${path}`);
            socketsRef.current[path] = ws;

            ws.onopen = () => {
                console.log(`Connected to WebSocket: ${type}`);
            };

            ws.onmessage = (event) => {
                try {
                    const notification: Noti = JSON.parse(event.data);
                    setNotifications((prev) => [notification, ...prev]);
                    setUnseenNotifications((prev) => [notification, ...prev]);
                } catch (error) {
                    console.error(`Error parsing WebSocket message for ${path}:`, error);
                }
            };

            ws.onclose = (event) => {
                console.warn(`WebSocket ${path} closed, attempting to reconnect...`, event.reason);
                socketsRef.current[path] = null;
                // setTimeout(() => connectWebSocket(type, path), 5000);
            };

            ws.onerror = (error) => {
                console.error(`WebSocket error for ${type}:`, error);
            };
        };

        connectWebSocket('user', token);
        if (user?.universityId != null) {
            connectWebSocket('university', user.universityId.toString());
        }

        return () => {
            Object.keys(socketsRef.current).forEach((path) => {
                if (socketsRef.current[path]) {
                    socketsRef.current[path]?.close();
                    socketsRef.current[path] = null;
                }
            });
        };
    }, [isAuthenticated, token, user?.universityId]);

    const handleLogout = () => {
        logout();
        window.location.replace('/login');
    };

    const onNotificationClicked = (e: boolean) => {
        setOpened(e);
        setIsBadgeVisible(false);
    };

    return (
        <div className='flex gap-6 items-center cursor-pointer'>
            <Menu
                opened={opened}
                onChange={(e) => onNotificationClicked(e)}
                trigger='click'
                shadow='md'
            >
                <Menu.Target>
                    <Indicator
                        size={20}
                        color='red'
                        label={unseenNotifications.length}
                        disabled={!isBadgeVisible || !unseenNotifications.length}
                    >
                        <Notifications
                            htmlColor={
                                isBadgeVisible && unseenNotifications.length > 0
                                    ? '#FF5252'
                                    : 'gray'
                            }
                        />
                    </Indicator>
                </Menu.Target>
                <Menu.Dropdown>
                    <Notification noti={notifications} />
                </Menu.Dropdown>
            </Menu>

            <Menu trigger='hover' shadow='md'>
                <Menu.Target>
                    <div className='flex gap-2 items-center'>
                        <p>{user?.username}</p>
                        <Avatar size='md' src={user?.photoUrl ?? user?.username} />
                    </div>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item>
                        <p>User</p>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        leftSection={<Logout style={{ fontSize: '16px' }} />}
                        c='red'
                        onClick={handleLogout}
                    >
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}

export default HeaderUserMenu;
