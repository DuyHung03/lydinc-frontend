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
                studentId: user?.userId,
            },
        });

        return res.data;
    };

    const { data: courses } = useQuery<Course[]>({
        queryKey: ['course', user?.userId],
        queryFn: getCourseByStudent,
    });
    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-1200 py-4'>
                <p className='font-semibold text-2xl mb-6'>My courses</p>
                {courses &&
                    courses?.map((course) => (
                        <div className='w-fit' key={course.courseId}>
                            <Link to={`/student/course/${course.courseId}`} state={{ course }}>
                                <CourseItem course={course} />
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Student;
