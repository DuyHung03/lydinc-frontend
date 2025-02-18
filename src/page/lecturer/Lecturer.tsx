import { Loader } from '@mantine/core';
import { Add } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import CourseItem from '../../component/course-item/CourseItem';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { Course } from '../../types/types';

const Lecturer = () => {
    const { user } = useAuthStore();

    const getCourseByLecturer = async () => {
        const res = await axiosInstance.get('/courses/courses-by-lecturer', {
            params: {
                lecturerId: user?.userId,
            },
        });

        return res.data;
    };

    const { data: courses } = useQuery<Course[]>({
        queryKey: ['course'],
        queryFn: getCourseByLecturer,
        gcTime: 300000,
    });

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-1200 p-4'>
                <h1 className='font-semibold mb-4 text-xl'>Recent courses ({courses?.length}):</h1>
                <hr />
                <div>
                    {courses ? (
                        <div className='w-full grid grid-cols-3 gap-7'>
                            <div className='flex flex-col w-full justify-center items-center gap-1'>
                                <Link to='/lecturer/new-course'>
                                    <button className='p-14 border border-primary border-dashed hover:bg-gray-200 duration-150'>
                                        <Add htmlColor='#b39858' style={{ fontSize: '46px' }} />
                                    </button>
                                    <p className='text-gray-700 text-center font-semibold'>
                                        Create new course
                                    </p>
                                </Link>
                            </div>
                            {courses.map((course: Course) => (
                                <div key={course.courseId} className='w-full '>
                                    <Link to={`/lecturer/course/edit-course/${course.courseId}/`}>
                                        <CourseItem course={course} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='w-full flex justify-center items-center'>
                            <Loader />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lecturer;
