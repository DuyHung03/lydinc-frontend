import { Alert, Avatar, Loader, Tooltip } from '@mantine/core';
import { PersonAdd } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PageHeader from '../../component/page-header/PageHeader';
import axiosInstance from '../../network/httpRequest';
import { User } from '../../types/types';

function ManageLecturers() {
    const getLecturers = async () => {
        const res = await axiosInstance.get('admin/get-all-lecturers');
        return res.data;
    };

    const { data, isLoading, error } = useQuery<User[]>({
        queryKey: ['lecturers'],
        queryFn: getLecturers,
        gcTime: 300000,
    });

    console.log(data);

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-full lg:w-1200 p-4'>
                <PageHeader title='Manage Lecturers' />

                <Link to={'/admin/new-lecturer'}>
                    <button className='primary-btn mb-5 flex gap-3 justify-center items-center'>
                        <PersonAdd fontSize='small' />
                        <p className='text-sm'>Create new Lecturer account</p>
                    </button>
                </Link>
                {error && (
                    <div className='w-full flex justify-center items-center h-64'>
                        <Alert title='Error' color='red'>
                            Something went wrong, Please try again later!
                        </Alert>
                    </div>
                )}
                {isLoading && (
                    <div className='w-full flex justify-center items-center h-64'>
                        <Loader color='blue' size='lg' />
                    </div>
                )}
                {data && data?.length > 0 && !error ? (
                    <>
                        {/* Users Table */}
                        <div className='w-full overflow-x-scroll'>
                            <table className='table-auto w-full'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            #
                                        </th>
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            Username
                                        </th>
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            Fullname
                                        </th>
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            Email
                                        </th>
                                        <th className='px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((user: User, index: number) => (
                                        <tr key={user.userId} className='hover:bg-gray-50'>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                {index + 1}
                                            </td>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center flex justify-center items-center gap-3 flex-nowrap'>
                                                <Avatar
                                                    src={user.photoUrl}
                                                    alt={user.username}
                                                    radius='xl'
                                                />
                                                <Tooltip
                                                    label={user.email}
                                                    transitionProps={{
                                                        duration: 200,
                                                        enterDelay: 200,
                                                    }}
                                                    color='gray'
                                                >
                                                    <p className='text-sm text-nowrap'>
                                                        {user.username}
                                                    </p>
                                                </Tooltip>
                                            </td>
                                            <td className='text-nowrap border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                {user.name}
                                            </td>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                {user.email}
                                            </td>
                                            <td className='text-nowrap border-gray-300 px-6 py-4 text-center text-sm align-middle'>
                                                <button className='text-gray-600 hover:text-gray-900'>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className='text-center text-gray-600 italic'>There aren't students found!</p>
                )}
            </div>
        </div>
    );
}

export default ManageLecturers;
