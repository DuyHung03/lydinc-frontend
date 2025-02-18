import { CloudUploadOutlined } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DocumentItem from '../document-item/DocumentItem';

function DocumentsUpload() {
    const [docsFiles, setDocsFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            setDocsFiles((prev) => [...prev, file]);
        });
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxFiles: 8,
        maxSize: 5000000,
    });
    return (
        <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Documents:</label>
            <div
                {...getRootProps()}
                className='w-full cursor-pointer py-8 border border-dashed border-primary rounded-lg bg-slate-100'
            >
                {docsFiles.length > 0 ? (
                    <div className='p-2 flex flex-row gap-3 justify-start'>
                        {docsFiles.map((file) => (
                            <DocumentItem file={file} />
                        ))}
                    </div>
                ) : (
                    <div className='w-full flex flex-col cursor-pointer justify-center items-center'>
                        <CloudUploadOutlined fontSize='large' />
                        <p className='text-lg text-gray-800 mt-3'>
                            Choose files or drag & drop it here
                        </p>
                        <p className='text-sm text-gray-400 mt-1'>Accept .docx, up to 5MB</p>
                        <label className='cursor-pointer gap-2 text-gray-800 hover:bg-primary hover:text-white duration-150 font-semibold border border-dashed border-primary rounded-lg p-2 px-4 mt-4'>
                            Browser File
                        </label>
                        <input {...getInputProps()} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentsUpload;
