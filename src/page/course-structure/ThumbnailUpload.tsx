import { Progress } from '@mantine/core';
import { AddAPhoto } from '@mui/icons-material';
import { ChangeEvent, useState } from 'react';
import axiosInstance from '../../network/httpRequest';

function ThumbnailUpload({
    thumb,
    setThumbnail,
}: {
    thumb: string | undefined;
    setThumbnail: (thumb: string) => void;
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
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    console.log('Upload progress:', progressEvent.loaded, progressEvent.total);
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setProgress(percentCompleted);
                },
            });
            console.log(res);

            setThumbnail(res.data.fileUrl);
        }
    }

    const onRemoveFile = () => {
        setFile(null);
        setThumbnail('');
    };

    return (
        <div className='w-full mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Photo:</label>
            {thumb || file ? (
                <div className='w-full border border-dashed border-gray-400 rounded-lg p-4 mb-2'>
                    <button
                        className='float-right mb-4 rounded-xl bg-slate-200 text-gray-600 px-5 py-2 hover:bg-red-200 hover:text-red-500 duration-150'
                        onClick={onRemoveFile}
                    >
                        Remove
                    </button>
                    <iframe
                        src={thumb ?? (file ? URL.createObjectURL(file) : '')}
                        className='mb-6 w-full object-contain block m-auto h-96'
                    ></iframe>
                </div>
            ) : (
                <div className='w-full mb-6'>
                    <label
                        htmlFor='addPhoto'
                        className='w-full flex justify-center gap-3 bg-gray-100 items-center p-6 cursor-pointer border border-dashed text-gray-400 rounded-lg border-gray-400 mt-3 font-medium'
                    >
                        <AddAPhoto fontSize='small' />
                        <p>Add Thumbnail</p>
                    </label>
                    <input
                        type='file'
                        accept='image/*'
                        id='addPhoto'
                        className='hidden'
                        onChange={onFileChosen}
                    />
                </div>
            )}
            {progress > 0 && (
                <div className='flex gap-3 items-center'>
                    <Progress w={300} color='lime' value={progress} transitionDuration={200} />
                    {progress == 100 ? (
                        <p className='text-sm italic text-green-700'>Upload successfully</p>
                    ) : (
                        <p className='text-sm italic text-gray-400'>Uploading: {progress}%</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ThumbnailUpload;
