import { Progress } from '@mantine/core';
import { VideoCallRounded } from '@mui/icons-material';
import { ChangeEvent, useState } from 'react';
import axiosInstance from '../../network/httpRequest';
import { Lesson } from '../../types/types';

function Video({
    component,
    setComponents,
    errors,
}: {
    component: Lesson;
    setComponents: (components: (prev: Lesson[]) => Lesson[]) => void;
    errors: Record<string, string>;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);

    async function onFileChosen(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            const res = await axiosInstance.post('drive/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setProgress(percentCompleted);
                },
            });

            setComponents((prev) =>
                prev.map((comp) =>
                    comp.lessonId === component.lessonId
                        ? { ...comp, url: res.data.fileUrl, fileName: res.data.fileName }
                        : comp
                )
            );
        }
    }

    const onRemoveVideo = () => {
        setFile(null);
        setComponents((prev) =>
            prev.map((comp) =>
                comp.lessonId === component.lessonId ? { ...comp, url: null } : comp
            )
        );
        setProgress(0);
    };

    return (
        <div className='w-full mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Video:</label>
            {component.url || file ? (
                <div className='w-full border border-dashed border-gray-400 rounded-lg p-4 mb-2'>
                    <button
                        className='float-right mb-4 rounded-xl bg-slate-200 text-gray-600 px-5 py-2 hover:bg-red-200 hover:text-red-500 duration-150'
                        onClick={onRemoveVideo}
                    >
                        Remove
                    </button>
                    {/* <video
                        controls
                        src={component.url ?? (file ? URL.createObjectURL(file) : '')}
                        className='mb-6 w-full max-h-64 rounded-lg'
                    /> */}
                    <iframe
                        src={component.url ?? (file ? URL.createObjectURL(file) : '')}
                        className='mb-6 w-full h-96 rounded-lg'
                        allow='autoplay'
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <label
                    htmlFor={`addVideo-${component.lessonId}`}
                    className='w-full flex justify-center gap-3 bg-gray-100 items-center p-6 cursor-pointer border border-dashed text-gray-400 rounded-lg mt-3 font-medium'
                >
                    <VideoCallRounded fontSize='small' />
                    <p>Add Video</p>
                    <input
                        type='file'
                        accept='video/*'
                        id={`addVideo-${component.lessonId}`}
                        className='hidden'
                        onChange={onFileChosen}
                    />
                </label>
            )}
            {progress > 0 && (
                <div className='flex gap-3 items-center'>
                    <Progress w={300} color='lime' value={progress} transitionDuration={200} />
                    {progress === 100 ? (
                        <p className='text-sm italic text-green-700'>Upload successfully</p>
                    ) : (
                        <p className='text-sm italic text-gray-400'>Uploading: {progress}%</p>
                    )}
                </div>
            )}
            {errors[component.lessonId] && (
                <p className='text-red-500 text-sm mt-1'>{errors[component.lessonId]}</p>
            )}
        </div>
    );
}

export default Video;
