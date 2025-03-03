import { Alert, Avatar, Badge, Loader, Pagination, Tooltip } from '@mantine/core';
import { PersonAdd } from '@mui/icons-material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../component/page-header/PageHeader';
import axiosInstance from '../../network/httpRequest';
import { User } from '../../types/types';

function ManageUsers() {
    const [pageNo, setPageNo] = useState(1);

    const getUsers = async () => {
        const res = await axiosInstance.get('user/get-all', {
            params: {
                pageNo: pageNo - 1,
                pageSize: 10,
            },
        });
        return res.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', pageNo],
        queryFn: getUsers,
        placeholderData: keepPreviousData,
    });

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-1200 p-4'>
                <PageHeader title='Manage Users' />

                <div className='w-fit'>
                    <Link to={'/admin/new-user'}>
                        <button className='primary-btn mb-5 flex gap-3 justify-center items-center'>
                            <PersonAdd fontSize='small' />
                            <p className='text-sm'>Create new account</p>
                        </button>
                    </Link>
                </div>

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
                {data && !error && (
                    <>
                        {/* Users Table */}
                        <div className='w-full overflow-x-auto'>
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
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            University
                                        </th>
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            Status
                                        </th>
                                        <th className='px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.users?.map((user: User, index: number) => (
                                        <tr key={user.userId} className='hover:bg-gray-50'>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                {index + 1}
                                            </td>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center flex justify-center items-center gap-3'>
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
                                                    <p className='text-sm'>{user.username}</p>
                                                </Tooltip>
                                            </td>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                {user.name}
                                            </td>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                {user.email}
                                            </td>
                                            <Tooltip
                                                label={'user.university.fullName'}
                                                transitionProps={{ duration: 200, enterDelay: 200 }}
                                                color='gray'
                                            >
                                                <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                    {'user.university.shortName'}
                                                </td>
                                            </Tooltip>
                                            <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                <Badge color='green'>Active</Badge>
                                            </td>
                                            <td className='border-gray-300 px-6 py-4 text-center text-sm align-middle'>
                                                <button className='text-gray-600 hover:text-gray-900'>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className='w-full my-8 flex justify-center items-center'>
                            <Pagination
                                color='#b39858'
                                radius={'xs'}
                                total={data?.total}
                                onChange={(value) => setPageNo(value)}
                                value={pageNo}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;
