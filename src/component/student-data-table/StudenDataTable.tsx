import { LoadingOverlay, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import axiosInstance from '../../network/httpRequest';
import { StudentAccount, University } from '../../types/types';

function StudenDataTable({
    data,
    university,
}: {
    data: StudentAccount[];
    university: University | null;
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>();
    const [selectedUniversity, setSelectedUniversity] = useState<number | null>(
        university?.universityId || null
    );
    const { universities } = useFetchingUniversities();

    useEffect(() => {
        if (university) {
            setSelectedUniversity(university.universityId);
        }
    }, [university]);

    // Convert the keys of each student row to lowercase and set the universityId
    const prepareStudentData = () => {
        const newData = data;
        return newData.map((row) => ({
            ...Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
            ),
            universityId: selectedUniversity ?? null,
        }));
    };

    const handleCreateStudentAccounts = async () => {
        if (!selectedUniversity) {
            alert('Please select a university before creating student accounts.');
            return;
        }
        const data = prepareStudentData();
        // Call the API to create student accounts
        try {
            setLoading(true);
            const res = await axiosInstance.post('admin/create-account', data, {
                withCredentials: true,
            });
            if (res.status === 200) {
                Swal.fire({
                    title: 'Student Accounts Created Successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#b39858',
                    didClose: () => {
                        navigate('/admin/manage-users');
                    },
                });
            } else {
                Swal.fire({
                    title: 'Failed!',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#b39858',
                    didClose: () => {
                        navigate('/admin/manage-users');
                    },
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Failed!',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#b39858',
            });
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUniversityId = e.target.value ? Number(e.target.value) : null;
        setSelectedUniversity(newUniversityId);
        console.log(newUniversityId);
    };

    return (
        <div className='w-full max-w-full'>
            {data.length > 0 && (
                <>
                    <label
                        htmlFor='universityId'
                        className="block text-xl font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5"
                    >
                        University
                    </label>
                    <select
                        id='universityId'
                        value={selectedUniversity ?? ''}
                        onChange={handleUniversityChange}
                        className='block w-full font-semibold px-4 py-3 border border-gray-300 shadow-sm mb-6 focus:ring-primary focus:border-primary sm:text-sm'
                    >
                        <option value=''>Select a University</option>
                        {universities?.map(({ universityId, fullName, shortName }) => (
                            <option key={universityId} value={universityId}>
                                {fullName} - {shortName}
                            </option>
                        ))}
                    </select>

                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>Student Accounts</h2>
                    <table className='w-full mt-4 border'>
                        <thead>
                            <tr className='bg-stone-200'>
                                {Object.keys(data[0]).map((key) => (
                                    <th
                                        key={key}
                                        className='border border-solid font-semibold border-gray-300 px-2 py-1'
                                    >
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((cell, i) => (
                                        <Tooltip key={i} openDelay={1000} bg='gray' label={cell}>
                                            <td className='border align-middle border-solid max-w-64 text-wrap text-center border-gray-300 px-2 py-3'>
                                                {cell}
                                            </td>
                                        </Tooltip>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <LoadingOverlay visible={loading} />
                    <button
                        disabled={loading}
                        className='primary-btn mt-4'
                        onClick={handleCreateStudentAccounts}
                    >
                        Create accounts
                    </button>
                </>
            )}
        </div>
    );
}

export default StudenDataTable;
