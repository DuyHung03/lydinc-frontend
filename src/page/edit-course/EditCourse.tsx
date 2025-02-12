import { LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { VideoCallRounded } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TipTapEditor from '../../component/editor/Editor';
import '../../component/editor/Editor.scss';
import { useFetchingModules } from '../../hook/useFetchingModules';
import axiosInstance from '../../network/httpRequest';
import { Lesson, Module } from '../../types/types';

function EditCourse() {
    const [content, setContent] = useState('');
    const { courseId } = useParams();
    const location = useLocation();
    const [video, setVideo] = useState<File | null>(null);
    const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);

    // Active module from sidebar state
    const module = location.state as Module | null;

    const { data } = useFetchingModules(Number(courseId));

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
        if (!module && data?.modules?.length) {
            const firstParentModule = data.modules.find((mod) => mod.level === 0);
            const childLesson = firstParentModule
                ? data.modules.find((mod) => mod.parentModuleId === firstParentModule.moduleId)
                : null;

            if (childLesson) {
                navigate(
                    `/lecturer/course/edit-course/${courseId}/${firstParentModule?.moduleTitle}/${childLesson.moduleTitle}`,
                    { state: childLesson, replace: true }
                );
            }
        }
    }, [data, module, courseId, navigate]);

    function onFileChosen(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    }

    return (
        <div className='p-5 flex flex-col justify-center items-center'>
            <div style={{ width: '900px' }}>
                {isLoading && <LoadingOverlay visible />}
                <div className='w-full flex flex-col justify-center items-center'>
                    <p className='w-full font-semibold text-xl'>{module?.moduleTitle}</p>
                    <hr className='w-full my-6 h-0.5' />
                </div>

                <label className='w-full font-medium text-gray-700'>Lesson's video:</label>
                {/* Video Preview */}
                {video ? (
                    <div className='w-full border border-dashed border-gray-400 rounded-lg p-4 my-4'>
                        <button
                            className='float-right mb-4 rounded-xl bg-slate-200 text-gray-600 px-5 py-2 hover:bg-red-200 hover:text-red-500 duration-150'
                            onClick={() => setVideo(null)}
                        >
                            Remove
                        </button>
                        <video
                            controls
                            src={URL.createObjectURL(video)}
                            className='my-4 w-full max-h-64'
                        />
                    </div>
                ) : (
                    <div className='w-full my-4'>
                        <label
                            htmlFor='addVideo'
                            className='w-full flex justify-center gap-3 bg-gray-100 items-center p-6 cursor-pointer border border-dashed text-gray-400 rounded-lg border-gray-400 mt-3 font-medium'
                        >
                            <VideoCallRounded fontSize='large' />
                            <p>Add Video</p>
                        </label>
                        <input
                            type='file'
                            accept='video/mp4,video/x-m4v,video/*'
                            id='addVideo'
                            className='hidden'
                            onChange={onFileChosen}
                        />
                    </div>
                )}

                <div className='flex flex-col items-center justify-center'>
                    <TipTapEditor setData={setContent} data={lesson?.lessonTitle} />
                    {isError && <p className='text-red-500'>{error.message}</p>}

                    <button
                        className='my-4 primary-btn'
                        onClick={() => {
                            openModal();
                        }}
                    >
                        Preview
                    </button>
                    <button
                        className='my-4 primary-btn'
                        onClick={() => {
                            console.log(content);
                        }}
                    >
                        Save
                    </button>
                    <p>{parse(content)}</p>
                </div>
            </div>
            <Modal
                opened={opened}
                onClose={closeModal}
                size={'960px'}
                title='Preview'
                closeOnClickOutside={false}
            >
                <div className='p-4'>{parse(content)}</div>
            </Modal>
        </div>
    );
}

export default EditCourse;
