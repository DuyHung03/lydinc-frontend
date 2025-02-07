import { Close, CloudUploadOutlined } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import excel from '../../assets/excel.png';
import PageHeader from '../../component/page-header/PageHeader';
import StudenDataTable from '../../component/student-data-table/StudenDataTable';
import { StudentAccount } from '../../types/types';
import { formatBytes } from '../../util/formatFileBytes';
const StudentUpload = () => {
    const [data, setData] = useState<StudentAccount[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const { state } = useLocation();

    const handleFileRead = (file: File) => {
        console.log(file);
        setFile(file);
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Read the first sheet
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet data to JSON
            const jsonData: StudentAccount[] = XLSX.utils.sheet_to_json(sheet);
            setData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            handleFileRead(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
        maxSize: 5000000,
    });

    const onClearFile = () => {
        setData([]);
        setFile(null);
    };

    if (isDragReject) {
        Swal.fire({
            icon: 'error',
            title: 'File type is not supported',
            text: 'Please select an Excel File!',
            allowEscapeKey: true,
            confirmButtonColor: '#b39858',
        });
    }

    return (
        <div className='w-full flex justify-center items-center py-4'>
            <div className='w-1200 gap-8 flex flex-col'>
                <PageHeader title='Upload student file (.xlsx, .csv)' />
                {file ? (
                    <div className='w-full justify-center items-center flex'>
                        <div
                            className='w-760 p-4 rounded-lg flex justify-between items-center gap-4'
                            style={{
                                boxShadow:
                                    'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                            }}
                        >
                            <div className='flex justify-center items-center gap-3'>
                                <img className='w-6' src={excel} alt='' />
                                <p className='text-gray-700'>{file.name}</p>
                            </div>
                            <p className='text-gray-500 text-sm'>Size: {formatBytes(file.size)}</p>
                            <button
                                className='duration-150 p-2 hover:text-red-400'
                                onClick={onClearFile}
                            >
                                <Close fontSize='small' />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className='w-full flex flex-col cursor-pointer justify-center items-center py-8 border border-dashed border-primary rounded-lg bg-slate-100'
                    >
                        <CloudUploadOutlined fontSize='large' />
                        <p className='text-lg text-gray-800 mt-3'>
                            Choose a file or drag & drop it here
                        </p>
                        <p className='text-sm text-gray-400 mt-1'>
                            Only XLSX or CSV format, up to 5MB
                        </p>
                        <label className='cursor-pointer gap-2 text-gray-800 hover:bg-primary hover:text-white duration-150 font-semibold border border-dashed border-primary rounded-lg p-2 px-4 mt-4'>
                            Browser File
                        </label>
                        <input {...getInputProps()} />
                    </div>
                )}
                <StudenDataTable university={state} data={data} />
            </div>
        </div>
    );
};

export default StudentUpload;
