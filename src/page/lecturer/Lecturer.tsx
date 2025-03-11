import { Alert, Loader, Pagination } from '@mantine/core';
import { Add } from '@mui/icons-material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseItem from '../../component/course-item/CourseItem';
import axiosInstance from '../../network/httpRequest';
import { Course, PaginationResponse } from '../../types/types';

const Lecturer = () => {
    const [pageNo, setPageNo] = useState(1);

    const getCourseByLecturer = async () => {
        const res = await axiosInstance.get('/courses/courses-by-lecturer', {
            params: {
                pageNo: pageNo - 1,
                pageSize: 11,
            },
        });
        return res.data;
    };

    const { data, isLoading, isError } = useQuery<PaginationResponse<Course>>({
        queryKey: ['course', pageNo],
        queryFn: getCourseByLecturer,
        gcTime: 300000,
        staleTime: 0,
        placeholderData: keepPreviousData,
    });

    console.log(data);

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='lg:w-1200 p-4'>
                <h1 className='font-semibold mb-4 text-xl'>Recent courses:</h1>
                <hr />
                {data?.data && (
                    <>
                        <div className='w-full grid grid-cols-2 lg:grid-cols-3 gap-7 mt-6'>
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
                            {data.data.map((course: Course) => (
                                <div key={course.courseId} className='w-full '>
                                    <Link to={`/lecturer/course/edit-course/${course.courseId}/`}>
                                        <CourseItem course={course} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className='w-full my-8 mt-20 flex justify-center items-center'>
                            <Pagination
                                color='#b39858'
                                radius={'xs'}
                                total={data?.total}
                                onChange={(value) => setPageNo(value)}
                                value={pageNo}
                            />
                        </div>
                    </>
                )}
                {isError && (
                    <Alert title='Error' color='red'>
                        Something went wrong, Please try again later!
                    </Alert>
                )}
                {isLoading && (
                    <div className='w-full flex justify-center items-center mt-6'>
                        <Loader />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lecturer;
