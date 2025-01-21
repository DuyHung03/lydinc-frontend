import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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

    const { data } = useQuery<Course[]>({
        queryKey: ['course'],
        queryFn: getCourseByLecturer,
    });

    return (
        <div>
            {data ? (
                <div>
                    {data.map((course: Course) => (
                        <div key={course.courseId}>
                            <Link to={`/lecturer/course/${course.courseId}`} state={{ course }}>
                                <h2 className='m-3 p-3 rounded-md shadow-lg cursor-pointer w-fit text-white bg-primary'>
                                    {course.title}
                                </h2>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <Link to='/lecturer/new-course'>
                <button>Create new course</button>
            </Link>
        </div>
    );
};

export default Lecturer;
