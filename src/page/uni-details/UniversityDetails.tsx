import { Add } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../component/page-header/PageHeader';
import axiosInstance from '../../network/httpRequest';
import { University, User } from '../../types/types';

function UniversityDetails() {
    const { state } = useLocation();
    const university: University = state.university;
    console.log(university);

    // Fetch students by university ID
    const getStudents = async () => {
        const res = await axiosInstance.get('university/get-students-by-university', {
            params: { universityId: university.universityId },
        });

        return res.data;
    };

    const {
        data: students,
        isLoading,
        error,
    } = useQuery<User[]>({
        queryKey: ['students', university.universityId],
        queryFn: getStudents,
    });

    console.log(students);

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-1200 p-4'>
                <PageHeader title="University's Details" />

                {/* University Details */}
                <div className='w-full flex items-center gap-6 mb-6'>
                    <img src={university.logo || ''} className='w-44' alt='logo' />
                    <div>
                        <h2 className='text-gray-950 text-2xl font-semibold'>
                            {university.fullName}
                        </h2>
                        <p className='text-gray-700 w-full text-lg'>
                            {university.shortName} - {university.location}
                        </p>
                    </div>
                </div>

                {/* Students Table */}
                <div>
                    <div className='w-full flex items-center justify-between mb-3'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-4'>{`Accounts (${students?.length})`}</h2>
                        <Link
                            to={'/admin/new-user'}
                            className='primary-btn flex items-center justify-center gap-2'
                            state={university}
                        >
                            <Add fontSize='small' />
                            <p>Add student</p>
                        </Link>
                    </div>
                    {isLoading && <p>Loading students...</p>}
                    {error && <p className='text-red-500'>Failed to load students.</p>}
                    {!isLoading && students && students.length > 0 && (
                        <table className='table-auto w-full border-collapse border border-gray-300'>
                            <thead>
                                <tr className='bg-gray-200'>
                                    <th className='border border-solid border-gray-300 px-4 py-2'>
                                        #
                                    </th>
                                    <th className='border border-solid border-gray-300 px-4 py-2'>
                                        Name
                                    </th>
                                    <th className='border border-solid border-gray-300 px-4 py-2'>
                                        Username
                                    </th>
                                    <th className='border border-solid border-gray-300 px-4 py-2'>
                                        Email
                                    </th>
                                    <th className='border border-solid border-gray-300 px-4 py-2'>
                                        Phone
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.userId} className='hover:bg-gray-100'>
                                        <td className='border border-gray-300 border-solid px-4 py-2 text-center'>
                                            {index + 1}
                                        </td>
                                        <td className='border text-center border-gray-300 border-solid px-4 py-2'>
                                            {student.name}
                                        </td>
                                        <td className='border text-center border-gray-300 border-solid px-4 py-2'>
                                            {student.username || 'N/A'}
                                        </td>
                                        <td className='border text-center border-gray-300 border-solid px-4 py-2'>
                                            {student.email || 'N/A'}
                                        </td>
                                        <td className='border text-center border-gray-300 border-solid px-4 py-2'>
                                            {student.phone}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!isLoading && students && students.length === 0 && (
                        <p>No students found for this university.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UniversityDetails;
