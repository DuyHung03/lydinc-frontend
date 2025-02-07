import { Avatar } from '@mantine/core';
import { Circle } from '@mui/icons-material';
import fallback from '../../assets/course-fallback.jpeg';
import { Course } from '../../types/types';
function CourseItem({ course }: { course: Course }) {
    console.log(course);

    return (
        <div className='w-full rounded-lg shadow-xl'>
            <img
                src={course.image || fallback}
                className='w-full h-44 rounded-t-lg object-cover'
                alt=''
            />
            <div className='p-4' style={{ background: '#FAFAFA' }}>
                <p className='font-semibold  mb-4 text-black text-base'>{course.title}</p>

                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 items-center'>
                        <Avatar size={'md'} src={course.lecturerPhoto || course.lecturerName} />
                        <p className='text-sm'>{course.lecturerName || 'Hehe'}</p>
                    </div>
                    <div
                        className={`flex flex-row items-center gap-2 ${
                            course.status == 'ACTIVE' ? 'text-green-400' : 'text-red-500'
                        }`}
                    >
                        <Circle style={{ fontSize: '8px' }} />
                        <p className='text-sm'>{course.status || 'ACTIVE'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseItem;
