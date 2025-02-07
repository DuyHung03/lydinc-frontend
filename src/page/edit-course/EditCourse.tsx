import { LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TipTapEditor from '../../component/editor/Editor';
import '../../component/editor/Editor.scss';
import { useFetchingModules } from '../../hook/useFetchingModules';
import axiosInstance from '../../network/httpRequest';
import { Lesson, Module } from '../../types/types';

function EditCourse() {
    const [data, setData] = useState('');
    const { courseId } = useParams();
    const location = useLocation();

    //This module is state when active on sidebar
    const module = location.state as Module | null;

    const { data: modules } = useFetchingModules(courseId);

    const navigate = useNavigate();

    const getLesson = async (moduleId: string) => {
        const res = await axiosInstance.get(`/lesson/get-data`, {
            params: { moduleId },
        });
        return res.data;
    };

    const {
        data: lesson,
        isLoading,
        isError,
        error,
    } = useQuery<Lesson>({
        queryKey: module ? ['lesson', module.moduleId] : [],
        queryFn: () => getLesson(module!.moduleId),
        enabled: !!module,
        staleTime: 0,
        gcTime: 0,
    });

    useEffect(() => {
        if (module == null && modules?.length) {
            // Find the first module with level 0 (root module) and the first lesson within it.
            const firstModule = modules.find((mod) => mod.level === 0);
            if (firstModule) {
                const firstLesson = modules.find(
                    (mod) => mod.parentModuleId === firstModule.moduleId
                );
                if (firstLesson) {
                    navigate(
                        `/lecturer/course/edit-course/${courseId}/${firstModule.moduleTitle}/${firstLesson.moduleTitle}`,
                        { state: firstLesson, replace: true }
                    );
                }
            }
        }
    }, [modules, module, courseId, navigate]);

    return (
        <div className='p-5'>
            {isLoading && <LoadingOverlay visible />}
            <div className='flex flex-col items-center justify-center'>
                <TipTapEditor setData={setData} data={lesson?.lessonTitle} />
                {isError && <p className='text-red-500'>{error.message}</p>}
                <button
                    className='my-4 primary-btn'
                    onClick={() => {
                        console.log(data);
                    }}
                >
                    Save
                </button>
                <p>{parse(data)}</p>
            </div>
        </div>
    );
}

export default EditCourse;
