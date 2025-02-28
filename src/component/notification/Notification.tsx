import { Badge, Tooltip } from '@mantine/core';
import clsx from 'clsx';
import { Noti } from '../../types/types';

const Notification = ({ noti }: { noti: Noti[] }) => {
    return (
        <div className='w-96 min-h-36 max-h-96 py-4 overflow-y-scroll'>
            <h2 className='font-bold ml-4'>Notifications</h2>
            <hr className='mt-4' />
            {noti.length <= 0 ? (
                <p className='text-gray-400 text-center italic'>No notifications.</p>
            ) : (
                <div className='flex flex-col justify-start'>
                    {noti.map((n, index) => (
                        <Tooltip key={index} label={n.message} openDelay={2000} bg={'gray'}>
                            <div className='cursor-pointer hover:bg-slate-100 duration-150 border-b pl-6 py-4 border-solid border-gray-200'>
                                <div className='flex justify-start items-center gap-4'>
                                    <h1
                                        className={` mb-1 text-base ${clsx(
                                            !n.isSeen && 'font-semibold'
                                        )}`}
                                    >
                                        {n.title}
                                    </h1>
                                    {!n.isSeen && <Badge size={'8'} circle></Badge>}
                                </div>
                                <p className='overflow-hidden text-ellipsis text-sm'>{n.message}</p>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notification;
