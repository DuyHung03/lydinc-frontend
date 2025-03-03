import { Alert, Loader, Modal, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Add, Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import fallback from '../../assets/course-fallback.jpeg';
import PageHeader from '../../component/page-header/PageHeader';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import NewUniversity from '../new-uni/NewUniversity';

function ManageUniversity() {
    // Fetch universities data from API
    const { data: universities, isLoading, refetch, isError } = useFetchingUniversities();

    // Manage modal state using useDisclosure
    const [opened, { open, close }] = useDisclosure(false);
    const onCreateSuccess = () => {
        refetch();
        close();
    };
    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-9/12 p-4'>
                <PageHeader title='Univeristies' />
                <button
                    className='primary-btn flex items-center justify-center gap-3 mb-6 text-sm'
                    onClick={open}
                >
                    <Add fontSize='small' />
                    Add new university
                </button>
                {isLoading && (
                    <div className='w-full flex justify-center items-center'>
                        <Loader />
                    </div>
                )}
                {universities && !isError && (
                    <table className='w-full border-gray-300 border border-solid'>
                        <thead>
                            <tr>
                                <th className=' border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                    ID
                                </th>
                                <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                    Name
                                </th>
                                <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                    Full name
                                </th>
                                <th className='border-gray-300 border-r border-solid px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                    Students
                                </th>
                                <th className='px-6 py-3 text-center text-sm font-semibold bg-gray-100'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {universities?.map((university, index) => (
                                <tr key={university.universityId} className='hover:bg-gray-100'>
                                    {/* ID Column (No Tooltip) */}
                                    <td className='border-gray-300 border-r border-solid cursor-pointer px-6 py-4 text-center text-sm align-middle'>
                                        {index + 1}
                                    </td>

                                    {/* Short Name Column with Tooltip */}
                                    <Tooltip
                                        label={university.shortName}
                                        transitionProps={{ duration: 200, enterDelay: 200 }}
                                        color='gray'
                                    >
                                        <td className='border-gray-300 border-r border-solid cursor-pointer px-6 py-4 text-center gap-3 flex justify-center items-center '>
                                            <img
                                                src={university.logo || fallback}
                                                className='w-8'
                                                alt=''
                                            />
                                            <p className='text-sm'>{university.shortName}</p>
                                        </td>
                                    </Tooltip>

                                    {/* Full Name Column with Tooltip */}
                                    <Tooltip
                                        label={university.fullName}
                                        transitionProps={{ duration: 200, enterDelay: 200 }}
                                        color='gray'
                                    >
                                        <td className='border-gray-300 border-r border-solid cursor-pointer px-6 hover:underline duration-150 py-4 text-center text-sm align-middle'>
                                            <Link
                                                state={{ university }}
                                                to={`/admin/university/${university.fullName}`}
                                            >
                                                {university.fullName}
                                            </Link>
                                        </td>
                                    </Tooltip>

                                    <td className='border-gray-300 border-r border-solid cursor-pointer px-6 py-4 text-center text-sm align-middle'>
                                        {university.studentCount}
                                    </td>
                                    {/* Actions Column with Tooltip */}
                                    <td className='px-6 py-4 text-center align-middle'>
                                        <Tooltip
                                            transitionProps={{ duration: 200, enterDelay: 200 }}
                                            color='gray'
                                            label='View'
                                        >
                                            <Link
                                                state={{ university }}
                                                to={`/admin/university/${university.fullName}`}
                                            >
                                                <button className='px-1 text-gray-400 hover:text-blue-600 duration-200'>
                                                    <RemoveRedEye fontSize='small' />
                                                </button>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip
                                            transitionProps={{ duration: 200, enterDelay: 200 }}
                                            color='gray'
                                            label='Edit'
                                        >
                                            <button className='px-1 text-gray-400 hover:text-primary duration-200'>
                                                <Edit fontSize='small' />
                                            </button>
                                        </Tooltip>
                                        <Tooltip
                                            transitionProps={{ duration: 200, enterDelay: 200 }}
                                            color='gray'
                                            label='Delete'
                                        >
                                            <button className='px-1 text-gray-400 hover:text-red-600 duration-200'>
                                                <Delete fontSize='small' />
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {isError && (
                    <Alert title='Error' color='red'>
                        Something went wrong, Please try again later!
                    </Alert>
                )}
            </div>

            {/* Modal to Add New University */}
            <Modal
                closeOnClickOutside={false}
                opened={opened}
                onClose={close}
                title='Add New University'
                centered
            >
                <NewUniversity onCreateSuccess={onCreateSuccess} />
            </Modal>
        </div>
    );
}

export default ManageUniversity;
