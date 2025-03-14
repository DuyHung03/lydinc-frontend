import { Avatar } from '@mantine/core';
import { Lock, Public } from '@mui/icons-material';
import clsx from 'clsx';
import { Course } from '../../types/types';
function CourseItem({ course }: { course: Course }) {
    return (
        <div
            className='w-full rounded-lg'
            style={{
                boxShadow:
                    'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
            }}
        >
            {course.thumbnail ? (
                <iframe
                    src={course.thumbnail}
                    className='w-full h-44 rounded-t-lg object-contain '
                ></iframe>
            ) : (
                <img
                    src={
                        course.thumbnail ||
                        'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2Fcourse-fallback.jpeg?alt=media&token=3afa227a-f1a8-4fec-89d4-e2688f7acb8f'
                    }
                    className='w-full h-44 rounded-t-lg object-cover'
                    alt=''
                />
            )}
            <div className='p-4' style={{ background: '#FAFAFA' }}>
                <p className='font-semibold  mb-4 text-black text-base overflow-ellipsis overflow-hidden text-nowrap'>
                    {course.title}
                </p>

                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 items-center'>
                        <Avatar size={'md'} src={course.lecturerPhoto || course.lecturerName} />
                        <p className='text-sm'>{course.lecturerName || 'Hehe'}</p>
                    </div>
                    {course?.privacy && (
                        <div
                            className={`flex flex-row items-center gap-2 ${
                                course.status == 'ACTIVE' ? 'text-green-400' : 'text-red-500'
                            }`}
                        >
                            {course.privacy == 'public' ? (
                                <Public color='success' />
                            ) : (
                                <Lock color='info' />
                            )}
                            <p
                                className={`text-sm ${clsx(
                                    course.privacy == 'public' ? 'text-green-700' : 'text-blue-500'
                                )}`}
                            >
                                {course?.privacy?.toUpperCase()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseItem;
