import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CourseDocument from '../../component/course-document/CourseDocument';
import { useFetchingModules } from '../../hook/useFetchingModules';
import { useFetchLessonData } from '../../hook/useFetchLessonData';
import { Module } from '../../types/types';

function CourseDetails() {
    const { courseId } = useParams();
    const location = useLocation();
    const { data } = useFetchingModules(Number(courseId));
    const module = location.state as Module | null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!module && data?.modules?.length) {
            const firstParentModule = data.modules.find((mod) => mod.level === 0);
            const childLesson = firstParentModule
                ? data.modules.find((mod) => mod.parentModuleId === firstParentModule.moduleId)
                : null;

            if (childLesson) {
                navigate(
                    `/student/course/${courseId}/${firstParentModule?.moduleTitle}/${childLesson.moduleTitle}`,
                    { state: childLesson, replace: true }
                );
            }
        }
    }, [data, module, courseId, navigate]);

    const { data: lessonData } = useFetchLessonData({ module });

    console.log(lessonData);
    const handleGetPracticeLink = async () => {};

    return (
        <div className='p-4 mb-28'>
            <h1 className='w-full text-2xl font-semibold text-gray-600'>{module?.moduleTitle}</h1>
            <hr className='my-5' />
            {lessonData && lessonData?.length > 0 ? (
                <>
                    <div className='flex flex-col gap-6'>
                        {lessonData
                            ?.filter((c) => c.type !== 4)
                            .map((c) =>
                                c.type === 1 ? (
                                    <p key={c.lessonId} className='w-full text-gray-800 leading-6'>
                                        {c.text}
                                    </p>
                                ) : c.type === 2 ? (
                                    <div key={c.lessonId} className='px-11'>
                                        <iframe
                                            src={c.url!}
                                            className='w-full h-96 rounded-lg'
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div key={c.lessonId} className='px-11'>
                                        <iframe
                                            src={c.url!}
                                            className='w-full h-96 rounded-lg'
                                            allow='autoplay'
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )
                            )}
                    </div>
                    <hr className='my-6' />
                    {lessonData && (
                        <CourseDocument component={lessonData?.filter((c) => c.type == 4)} />
                    )}
                    <button className='primary-btn my-6' onClick={handleGetPracticeLink}>
                        Practice here
                    </button>
                </>
            ) : (
                <div className='w-full text-center italic text-gray-600'>
                    Lesson's data is empty!
                </div>
            )}
        </div>
    );
}

export default CourseDetails;
