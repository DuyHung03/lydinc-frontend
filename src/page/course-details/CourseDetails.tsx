import { Alert } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CourseDocument from '../../component/course-document/CourseDocument';
import { useFetchingModules } from '../../hook/useFetchingModules';
import { useFetchLessonData } from '../../hook/useFetchLessonData';
import axiosInstance from '../../network/httpRequest';
import { Module } from '../../types/types';

function CourseDetails() {
    const { courseId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<string>('');
    const { data } = useFetchingModules(Number(courseId));
    const parentModule = location.state?.parentModule as Module | null;
    const childModule = location.state?.childModule as Module | null;
    console.log(parentModule?.index + '.' + childModule?.index);

    useEffect(() => {
        if (!childModule && data?.modules?.length) {
            const firstParentModule = data.modules.find((mod) => mod.level === 0);
            const childLesson = firstParentModule
                ? data.modules
                      .filter((mod) => mod.parentModuleId === firstParentModule.moduleId)
                      .sort((a, b) => a.index - b.index)[0]
                : null;

            if (firstParentModule && childLesson) {
                navigate(
                    `/learning/course/${courseId}/${encodeURIComponent(
                        firstParentModule.moduleTitle
                    )}/${encodeURIComponent(childLesson.moduleTitle)}`,
                    {
                        state: { parentModule: firstParentModule, childModule: childLesson },
                        replace: true,
                    }
                );
            }
        }
    }, [data, childModule, courseId, navigate]);

    const {
        data: lessonData,
        isError,
        error,
    } = useFetchLessonData({
        module: childModule,
        courseId: Number(courseId),
    });

    const handleGetPracticeLink = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get('/practice-link/get-practice-link', {
                params: {
                    courseId: Number(courseId),
                    moduleId: parentModule?.moduleId,
                    lessonId: childModule?.moduleId,
                    moduleIndex: parentModule?.index,
                    lessonIndex: childModule?.index,
                },
            });

            if (res.status === 200 && res.data != '') {
                console.log(res);

                window.open(res.data, '_blank');
            } else {
                setErrors('File not found!.');
                console.error('Error fetching practice link');
            }
        } catch (error) {
            console.error('Failed to get practice link:', error);
            setErrors('Something went wrong!.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isError && error.message === "You're not allowed to access the course") {
            navigate('/not-allowed');
        }
    }, [isError, navigate, error]);

    return (
        <div className='p-4 mb-28'>
            <h1 className='w-full text-2xl font-semibold text-red-800'>
                {childModule?.moduleTitle || 'N/A'}
            </h1>
            <hr className='my-5' />

            {isError && (
                <Alert title='Error' color='red'>
                    Something went wrong!.
                </Alert>
            )}

            {lessonData && lessonData?.length > 0 ? (
                <>
                    <div className='flex flex-col gap-6'>
                        {lessonData
                            .filter((c) => c.type !== 4)
                            .sort((a, b) => a.index - b.index)
                            .map((c) =>
                                c.type === 1 ? (
                                    <p key={c.lessonId} className='w-full text-gray-800 leading-6'>
                                        {c.text}
                                    </p>
                                ) : (
                                    <div key={c.lessonId} className='px-11'>
                                        <iframe
                                            src={c.url!}
                                            className='w-full h-96 rounded-lg'
                                            allow={c.type === 3 ? 'autoplay' : undefined}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )
                            )}
                    </div>
                    <hr className='my-6' />
                    {lessonData && (
                        <CourseDocument component={lessonData.filter((c) => c.type == 4)} />
                    )}
                    <button
                        className='primary-btn my-6'
                        onClick={handleGetPracticeLink}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Practice here'}
                    </button>
                </>
            ) : (
                <div className='w-full text-center italic text-gray-600'>
                    Lesson's data is empty!
                </div>
            )}
            {errors && (
                <Alert title='Error' color='red'>
                    {errors}
                </Alert>
            )}
        </div>
    );
}

export default CourseDetails;
