import { Alert, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import CourseItem from '../../component/course-item/CourseItem';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { Course } from '../../types/types';

function Student() {
    const { user } = useAuthStore();

    const getCourseByStudent = async () => {
        const res = await axiosInstance.get('/courses/courses-by-student', {
            params: {
                universityId: user?.universityId,
            },
        });

        return res.data;
    };

    const {
        data: courses,
        isLoading,
        error,
    } = useQuery<Course[]>({
        queryKey: ['course', user?.userId],
        queryFn: getCourseByStudent,
        gcTime: 300000,
        retry: false,
    });

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-1200 py-4'>
                <div className='mb-6'>
                    <p className='font-semibold text-2xl mb-3'>My courses</p>
                    <hr />
                </div>
                {isLoading && (
                    <div className='w-full flex justify-center items-center'>
                        <Loader />
                    </div>
                )}
                {error && (
                    <Alert title='Error' w={300} color='red'>
                        {error.message || 'An error occured'}
                    </Alert>
                )}
                <div className='w-full grid grid-cols-3 gap-7'>
                    {courses &&
                        courses?.map((course) => (
                            <Link key={course.courseId} to={`/student/course/${course.courseId}/`}>
                                <CourseItem course={course} />
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Student;
