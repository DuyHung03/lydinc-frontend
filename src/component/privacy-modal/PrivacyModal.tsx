import { Divider, Modal, Tabs, TabsList, TabsPanel } from '@mantine/core';
import { Lock, Public } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useFetchCoursePrivacy } from '../../hook/useFetchCoursePrivacy';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import { usePrivacyModal } from '../../hook/usePrivacyModal';
import axiosInstance from '../../network/httpRequest';
import { User } from '../../types/types';

interface PrivacyModalProps {
    courseId: number | null;
    opened: boolean;
    closeModal: () => void;
    // onSavePrivacy: () => void;
}

function PrivacyModal({ courseId, opened, closeModal }: PrivacyModalProps) {
    const {
        privacy,
        selectedUniversityIds,
        uncheckUniversityIds,
        selectedUserIds,
        setSelectedUserIds,
        setPrivacy,
        setInitialUniversityIds,
        setSelectedUniversityIds,
        onPrivacyChange,
        onUniversityCheckboxChange,
        onUserCheckboxChange,
    } = usePrivacyModal();

    const {
        data: coursePrivacy,
        refetch,
        error,
        // isLoading: loading,
    } = useFetchCoursePrivacy(courseId);

    const { data: universities } = useFetchingUniversities();

    const fetchStudents = async () => {
        const res = await axiosInstance.get('/user/get-all-student');
        return res.data;
    };

    const { data: students } = useQuery<User[]>({
        queryKey: ['students'],
        queryFn: fetchStudents,
        staleTime: 600000,
    });

    // const [isLoading, setIsLoading] = useState(loading);

    useEffect(() => {
        if (courseId) {
            refetch();
        }
    }, [courseId, refetch]);

    useEffect(() => {
        if (coursePrivacy) {
            console.log(coursePrivacy);

            setPrivacy(coursePrivacy.privacy);
            setSelectedUniversityIds(coursePrivacy.universityIds);
            setInitialUniversityIds(coursePrivacy.universityIds);
            setSelectedUserIds(coursePrivacy.userIds);
        }
    }, [
        coursePrivacy,
        setPrivacy,
        setSelectedUniversityIds,
        setInitialUniversityIds,
        setSelectedUserIds,
    ]);

    const onSavePrivacy = async () => {
        try {
            // setIsLoading(true);
            const requestData = {
                privacy,
                courseId,
                universityIds: selectedUniversityIds,
                deleteUniversityIds: uncheckUniversityIds,
                userIds: selectedUserIds,
            };
            console.log(requestData);

            const res = await axiosInstance.post('/courses/edit-privacy', requestData, {
                withCredentials: true,
            });

            if (res.status === 200) {
                Swal.fire({
                    text: 'Success',
                    icon: 'success',
                });
                closeModal();
            }
        } catch {
            Swal.fire({
                text: 'Failed to save privacy settings',
                icon: 'error',
            });
            closeModal();
        } finally {
            // setIsLoading(false);
        }
    };

    if (error) {
        <div className='text-red-600'>
            <p>An error occurred in privacy settings.</p>
        </div>;
        return;
    }
    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            size={500}
            radius={0}
            transitionProps={{ transition: 'scale-y' }}
            top={30}
            closeOnClickOutside={false}
            withCloseButton={false}
        >
            {/* {isLoading && (
                <div className='flex justify-center items-center h-full'>
                    <Loader />
                </div>
            )} */}
            <div className='mb-16'>
                <h2 className='text-center text-xl my-3'>Privacy Setting</h2>
                <h3 className='mb-4 font-bold'>General Permission</h3>
                <div className={`flex items-center gap-4 px-4 py-2`}>
                    <div
                        className={`w-fit rounded-full p-2 ${clsx(
                            privacy === 'public'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-600'
                        )}`}
                    >
                        {privacy === 'public' ? <Public /> : <Lock />}
                    </div>
                    <select
                        value={privacy}
                        onChange={onPrivacyChange}
                        className='px-6 py-2 border rounded-3xl font-semibold focus:outline-none hover:bg-stone-100 cursor-pointer'
                    >
                        <option value='public'>Public</option>
                        <option value='private'>Private</option>
                    </select>
                </div>
                <Divider className='my-4' />
                {privacy === 'public' ? (
                    <p className='text-gray-600'>
                        This course is publicly accessible to all users. Anyone with the link can
                        view and learn from it.
                    </p>
                ) : (
                    <div>
                        <Tabs defaultValue={'universities'}>
                            <TabsList grow>
                                <Tabs.Tab value='universities'>Universities</Tabs.Tab>
                                <Tabs.Tab value='users'>Users</Tabs.Tab>
                            </TabsList>
                            <TabsPanel value='universities'>
                                <div className='my-4'>
                                    <p className='mb-4 text-gray-600'>
                                        Select the <b>UNIVERSITIES</b> that can access and learn
                                        from this course.
                                    </p>
                                    <p className='font-semibold mb-2'>Who has access</p>
                                    <div className='max-h-80 overflow-y-scroll'>
                                        {universities?.map((university) => (
                                            <div
                                                key={university.universityId}
                                                className='w-full flex gap-3 items-center px-2 py-2'
                                            >
                                                <input
                                                    checked={selectedUniversityIds.includes(
                                                        university.universityId
                                                    )}
                                                    className='w-4 h-4 cursor-pointer'
                                                    onChange={onUniversityCheckboxChange}
                                                    type='checkbox'
                                                    value={university.universityId}
                                                />
                                                <p>{university.fullName}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsPanel>
                            <TabsPanel value='users'>
                                <div className='my-4'>
                                    <p className='mb-4 text-gray-600'>
                                        Select the <b>USERS</b> that can access and learn from this
                                        course.
                                    </p>
                                    <p className='font-semibold mb-2'>Who has access</p>
                                    <div className='max-h-80 overflow-y-scroll'>
                                        {students?.map((student) => (
                                            <div
                                                key={student.userId}
                                                className='w-full flex gap-3 items-center px-2 py-2'
                                            >
                                                <input
                                                    checked={selectedUserIds.includes(
                                                        student.userId
                                                    )}
                                                    className='w-4 h-4 cursor-pointer'
                                                    onChange={onUserCheckboxChange}
                                                    type='checkbox'
                                                    value={student.userId}
                                                />
                                                <p>{student.username}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsPanel>
                        </Tabs>
                    </div>
                )}
                <Divider className='my-4' />
                <button className='float-right primary-btn' onClick={onSavePrivacy}>
                    Save
                </button>
            </div>
        </Modal>
    );
}

export default PrivacyModal;
