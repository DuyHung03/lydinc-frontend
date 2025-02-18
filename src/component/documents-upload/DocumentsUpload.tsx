import { CloudUploadOutlined, Summarize } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 } from 'uuid';
import axiosInstance from '../../network/httpRequest';
import { Lesson } from '../../types/types';

function DocumentsUpload({
    components,
    setComponents,
}: {
    components: Lesson[];
    setComponents: (components: (prev: Lesson[]) => Lesson[]) => void;
}) {
    const [docsFiles, setDocsFiles] = useState<Lesson[]>([]);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const res = await axiosInstance.post('drive/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const newLesson: Lesson = {
                        lessonId: v4(),
                        url: res.data.fileUrl,
                        type: 4, // Type 4 = document
                        index: 0,
                        text: null,
                        fileName: res.data.fileName,
                    };

                    setComponents((prev: Lesson[]) => [...prev, newLesson]);
                } catch (error) {
                    console.error('File upload failed:', error);
                }
            }
        },
        [setComponents]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.ms-powerpoint': ['.ppxt'],
        },
        maxFiles: 8,
        maxSize: 5000000,
    });

    useEffect(() => {
        if (components.length > 0) {
            setDocsFiles(components.filter((com) => com.type == 4));
        }
    }, [components]);

    return (
        <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Documents:</label>
            <div
                {...getRootProps()}
                className='w-full cursor-pointer py-8 border border-dashed border-primary rounded-lg bg-slate-100'
            >
                {docsFiles.length > 0 ? (
                    <div className='p-2 flex flex-row gap-3 justify-start flex-wrap'>
                        {docsFiles.map((file, index) => (
                            <div
                                key={index}
                                className='w-36 bg-white flex justify-between gap-3 flex-col rounded-md p-3'
                            >
                                <div className='flex justify-center items-center'>
                                    <Summarize fontSize='small' htmlColor='#ccc' />
                                </div>
                                <p className='overflow-hidden text-ellipsis line-clamp-3'>
                                    {file.fileName}
                                </p>
                                <button
                                    className='duration-150 p-2 hover:text-primary underline'
                                    onClick={() => {
                                        setDocsFiles((prev) => prev.filter((_, i) => i !== index));
                                        setComponents((prev) => {
                                            const newComponents = prev.filter(
                                                (component) => component.lessonId != file.lessonId
                                            );
                                            return newComponents.map((c) => ({
                                                ...c,
                                            }));
                                        });
                                    }}
                                >
                                    Remove file
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='w-full flex flex-col cursor-pointer justify-center items-center'>
                        <CloudUploadOutlined fontSize='large' />
                        <p className='text-lg text-gray-800 mt-3'>
                            Choose files or drag & drop it here
                        </p>
                        <p className='text-sm text-gray-400 mt-1'>
                            Accept .docx .pdf .xlsx .xls .pptx, up to 5MB
                        </p>
                        <label className='cursor-pointer gap-2 text-gray-800 hover:bg-primary hover:text-white duration-150 font-semibold border border-dashed border-primary rounded-lg p-2 px-4 mt-4'>
                            Browse File
                        </label>
                    </div>
                )}
                <input {...getInputProps()} />
            </div>
        </div>
    );
}

export default DocumentsUpload;
