import { Alert, Avatar, Loader, Pagination, Tooltip } from '@mantine/core';
import { PersonAdd } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../component/page-header/PageHeader';
import useDebounce from '../../hook/useDebounce';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import axiosInstance from '../../network/httpRequest';
import { PaginationResponse, University, User } from '../../types/types';

function ManageUsers() {
    const [pageNo, setPageNo] = useState(1);
    const [selectedUniversity, setSelectedUniversity] = useState<number>();
    const [order, setOrder] = useState<number>(1);
    const [searchValue, setSearchValue] = useState<string>('');

    const searchDebounce = useDebounce(searchValue, 800);

    const getUsers = async () => {
        const res = await axiosInstance.get('user/get-all', {
            params: {
                searchValue: searchDebounce != '' ? searchDebounce : null,
                universityId: selectedUniversity ? selectedUniversity : null,
                orderBy: order,
                pageNo: pageNo - 1,
                pageSize: 10,
            },
        });
        return res.data;
    };

    const { data, isLoading, error } = useQuery<PaginationResponse<User>>({
        queryKey: ['users', pageNo, selectedUniversity, order, searchDebounce],
        queryFn: getUsers,
        gcTime: 300000,
    });

    const { data: universities } = useFetchingUniversities();

    console.log(searchDebounce != null);

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-full lg:w-1200 p-4'>
                <PageHeader title='Manage Users' />

                <div className='w-fit'>
                    <Link to={'/admin/new-user'}>
                        <button className='primary-btn mb-5 flex gap-3 justify-center items-center'>
                            <PersonAdd fontSize='small' />
                            <p className='text-sm'>Create new account</p>
                        </button>
                    </Link>
                </div>
                {/* Filter */}
                <div className='flex justify-between items-center gap-6 my-4'>
                    <div className='flex justify-start items-center gap-6'>
                        <select
                            defaultValue={selectedUniversity}
                            disabled={searchDebounce != ''}
                            onChange={(e) => {
                                setPageNo(1);
                                setSelectedUniversity(Number(e.target.value));
                            }}
                            className='disabled:cursor-not-allowed cursor-pointer block w-fit px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        >
                            <option>All</option>
                            {universities?.map((university: University) => (
                                <option
                                    key={university.universityId}
                                    value={university.universityId}
                                >
                                    {university.shortName}
                                </option>
                            ))}
                        </select>
                        <select
                            disabled={searchValue != ''}
                            value={order || 1}
                            onChange={(e) => {
                                setPageNo(1);
                                setOrder(Number(e.target.value));
                            }}
                            className='disabled:cursor-not-allowed cursor-pointer block w-fit px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        >
                            <option key={'asc'} value={1}>
                                {'A -> Z'}
                            </option>
                            <option key={'desc'} value={2}>
                                {'Z -> A'}
                            </option>
                        </select>
                    </div>
                    <div className='flex justify-center items-center gap-4'>
                        <input
                            type='text'
                            placeholder='Search by username'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className='block w-fit px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        />
                        <button
                            disabled={!searchValue}
                            className='disabled:text-gray-400 text-red-600'
                            onClick={() => setSearchValue('')}
                        >
                            Clear
                        </button>
                    </div>
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
                {data && data.data.length > 0 && !error ? (
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
                                        <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            University
                                        </th>
                                        {/* <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold'>
                                            Status
                                        </th> */}
                                        <th className='px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((user: User, index: number) => (
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
                                            <Tooltip
                                                label={'user.university.fullName'}
                                                transitionProps={{ duration: 200, enterDelay: 200 }}
                                                color='gray'
                                            >
                                                <td className='text-nowrap border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                    {'user.university.shortName'}
                                                </td>
                                            </Tooltip>
                                            {/* <td className='border-gray-300 border-r border-solid px-6 py-4 text-center text-sm align-middle'>
                                                <Badge color='green'>Active</Badge>
                                            </td> */}
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
                        {/* Pagination */}
                        <div className='w-full my-8 flex justify-center items-center'>
                            <Pagination
                                color='#b39858'
                                radius={'xs'}
                                total={data?.total}
                                onChange={(value) => setPageNo(value)}
                                value={data?.pageNo}
                            />
                        </div>
                    </>
                ) : (
                    <p className='text-center text-gray-600 italic'>There aren't students found!</p>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;
