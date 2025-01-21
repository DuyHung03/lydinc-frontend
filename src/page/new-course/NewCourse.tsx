import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { School, User } from '../../types/types';

function NewCourse() {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]); // Store student IDs
    const [checkedStudents, setCheckedStudents] = useState<string[]>([]); // Temporary check state
    const [courseTitle, setCourseTitle] = useState<string>('new hehehehe');
    const [value, setValue] = useState('');
    const { user } = useAuthStore();
    // Fetch all schools
    const { data: schools, isLoading: isSchoolsLoading } = useQuery<School[]>({
        queryKey: ['schools'],
        queryFn: async () => {
            const res = await axiosInstance.get('/school/get-all-schools');
            return res.data;
        },
    });

    // Fetch students for a selected school
    const {
        data: students,
        refetch: refetchStudents,
        isLoading: isStudentsLoading,
    } = useQuery<User[]>({
        queryKey: ['students', selectedSchool],
        queryFn: async () => {
            const res = await axiosInstance.get('/school/get-students-by-school', {
                params: { schoolId: selectedSchool },
            });
            return res.data;
        },
        enabled: false, // Disabled until `refetchStudents` is manually called
    });

    // Handle school selection
    const handleSelectSchool = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const schoolId = parseInt(e.target.value);
        setSelectedSchool(schoolId);
        refetchStudents(); // Fetch students for the selected school
    };

    // Handle checkbox change
    const handleCheckboxChange = (studentId: string) => {
        setCheckedStudents((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
        );
    };

    // Assign selected students
    const handleAssignStudents = () => {
        setSelectedStudents(checkedStudents);
        close();
    };

    console.log(checkedStudents);
    console.log(selectedStudents);

    const createNewCourse = async () => {
        const res = await axiosInstance.post('/courses/new-course', {
            title: courseTitle,
            lecturerId: user?.userId,
            userIds: selectedStudents,
        });
        console.log(res.data);

        if (res.status === 200) {
            alert('Course created successfully');
        }
        window.location.href = '/lecturer';
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <ReactQuill theme='snow' value={value} onChange={setValue} />
            <button className='p-3 bg-primary text-white rounded-md shadow-lg mt-3' onClick={open}>
                Assign students
            </button>

            {/* Modal for selecting students */}
            <Modal opened={opened} onClose={close} title='Assign Students'>
                <select
                    className='p-3 border-red-400 mt-3'
                    title='Select school'
                    onChange={handleSelectSchool}
                    value={selectedSchool || ''}
                >
                    <option value='' disabled>
                        Choose a school
                    </option>
                    {isSchoolsLoading ? (
                        <option>Loading schools...</option>
                    ) : (
                        schools?.map((school) => (
                            <option key={school.schoolId} value={school.schoolId}>
                                {school.schoolName}
                            </option>
                        ))
                    )}
                </select>

                {isStudentsLoading ? (
                    <p>Loading students...</p>
                ) : (
                    students?.map((student) => (
                        <div key={student.userId} className='flex items-center mt-2'>
                            <input
                                type='checkbox'
                                id={student.userId}
                                checked={checkedStudents.includes(student.userId)}
                                onChange={() => handleCheckboxChange(student.userId)}
                                className='mr-2'
                            />
                            <label htmlFor={student.userId}>{student.username}</label>
                        </div>
                    ))
                )}

                <button
                    className='bg-primary p-3 rounded-md text-white mt-4'
                    onClick={handleAssignStudents}
                >
                    Assign Selected Students
                </button>
            </Modal>

            <button
                className='p-3 bg-primary text-white rounded-md shadow-lg mt-3'
                onClick={createNewCourse}
            >
                Create course
            </button>

            {/* Debug: Show selected students */}
            {selectedStudents.length > 0 && (
                <div className='mt-5'>
                    <h3>Assigned Students:</h3>
                    {selectedStudents.map((studentId) => (
                        <p key={studentId}>
                            {students?.find((student) => student.userId === studentId)?.username}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NewCourse;
