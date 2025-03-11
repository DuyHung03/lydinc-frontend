import { NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import fallback from '../../assets/course-fallback.jpeg';
import PageHeader from '../../component/page-header/PageHeader';
import { useFetchingModules } from '../../hook/useFetchingModules';
import { Course, Module } from '../../types/types';

function LandingCourse() {
    const location = useLocation();
    const course: Course = location.state;
    const { data } = useFetchingModules(course.courseId);
    const modules = data?.modules
        ?.sort((a, b) => a.index - b.index)
        .filter((module: Module) => module.level == 0);
    const lessons = data?.modules
        ?.sort((a, b) => a.index - b.index)
        .filter((module: Module) => module.level == 1);
    return (
        <div className='w-full flex justify-center items-center py-6 px-4 lg:px-0'>
            <div className='w-full lg:w-1200'>
                <PageHeader title={course.title} />
                <div className='w-full flex flex-row gap-6'>
                    <div className='w-2/3'>
                        <p className='text-gray-700 leading-7'>{course.description}</p>
                        <h1 className='mt-8 mb-3 text-xl font-bold'>Course content:</h1>
                        <ul className='list-none flex gap-4 justify-start items-center text-gray-800'>
                            <li>
                                <strong>{modules?.length} </strong>
                                chapters
                            </li>
                            <li>•</li>
                            <li>
                                <strong>{lessons?.length} </strong>
                                lessons
                            </li>
                        </ul>
                        <div className='my-6'>
                            {modules?.map((module, i) => (
                                <NavLink
                                    key={module.moduleId}
                                    label={`${i + 1}. ${module.moduleTitle}`}
                                    className='font-semibold text-lg py-3 '
                                    bg={'#F5F5F5'}
                                >
                                    {data?.modules
                                        ?.sort((a, b) => a.index - b.index)
                                        .filter(
                                            (lesson) => lesson.parentModuleId == module.moduleId
                                        )
                                        .map((lesson, i) => (
                                            <NavLink
                                                key={lesson.moduleId}
                                                label={`${i + 1}. ${lesson.moduleTitle}`}
                                                className='my-4 text-gray-800 hover:cursor-default'
                                            />
                                        ))}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className='w-1/3'>
                        {course.thumbnail ? (
                            <iframe
                                src={course.thumbnail}
                                className='w-full rounded-xl h-56'
                            ></iframe>
                        ) : (
                            <img src={fallback} className='rounded-xl' alt='' />
                        )}
                        <Link
                            to={`/learning/course/${course.courseId}`}
                            className='primary-btn block m-auto mt-4 py-3 rounded-xl'
                        >
                            Learn this course
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingCourse;
