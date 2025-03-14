import { Divider, Modal, NavLink, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Delete, Edit, LockPerson } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useFetchingModules } from '../../hook/useFetchingModules';
import axiosInstance from '../../network/httpRequest';
import PrivacyModal from '../privacy-modal/PrivacyModal';

function SideBar() {
    const navigate = useNavigate();
    const { courseId } = useParams<{ courseId: string; lesson: string }>();
    const [openModal, setOpenModal] = useState(false);
    const { pathname } = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    const queryClient = useQueryClient();
    //Get the menu for the sidebar
    const { data: modulesResponse, isLoading } = useFetchingModules(Number(courseId));

    const isActive = (path: string) => {
        return pathname.includes(encodeURIComponent(path));
    };

    const onDeleteCourse = async () => {
        try {
            const res = await axiosInstance.delete('/courses/delete', {
                params: {
                    courseId,
                },
            });
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Course deleted successfully',
                    timer: 1500,
                    confirmButtonColor: '#b39858',
                    didClose: () => {
                        queryClient.invalidateQueries({ queryKey: ['course'] });
                    },
                });
                navigate('/lecturer');
                close();
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course');
            close();
        }
    };

    return (
        <div className='w-96 lg:mt-headerHeight bg-white px-4 py-8 flex flex-col'>
            {pathname.includes('/edit-course') && (
                <>
                    <Link
                        to={`/lecturer/edit-structure/${courseId}`}
                        className='flex justify-center items-center primary-btn gap-3 mb-2'
                    >
                        <Edit />
                        <p>Edit course's structure</p>
                    </Link>
                    <button
                        onClick={() => setOpenModal(true)}
                        className='flex justify-center items-center primary-btn gap-3 mb-2'
                    >
                        <LockPerson />
                        <p>Edit privacy</p>
                    </button>
                    <Divider w={'100%'} h={1} mt={12} mb={20} />
                </>
            )}
            {isLoading && (
                <div className='flex gap-5 w-full flex-col px-4'>
                    <Skeleton w={'100%'} h={36} />
                    <Skeleton w={'100%'} h={36} />
                    <Skeleton w={'100%'} h={36} />
                    <Skeleton w={'100%'} h={36} />
                    <Skeleton w={'100%'} h={36} />
                </div>
            )}
            {modulesResponse?.modules
                ?.sort((a, b) => a.index - b.index)
                .map((parentModule) =>
                    parentModule.level === 0 ? (
                        <NavLink
                            key={parentModule.moduleId}
                            label={parentModule.moduleTitle}
                            active={isActive(parentModule.moduleTitle)}
                            color='#b39858'
                            c={isActive(parentModule.moduleTitle) ? '#b39858' : 'black'}
                            fw={500}
                            defaultOpened={true}
                            childrenOffset={0}
                        >
                            {modulesResponse?.modules
                                .filter(
                                    (childModule) =>
                                        childModule.parentModuleId === parentModule.moduleId
                                )
                                .sort((a, b) => a.index - b.index)
                                .map((childModule) => (
                                    <Link
                                        key={childModule.moduleId}
                                        className={clsx(
                                            'w-full my-2 py-2 px-4 duration-150 block overflow-hidden text-ellipsis pl-8 hover:bg-slate-500 hover:text-white text-sm',
                                            isActive(childModule.moduleTitle) &&
                                                'underline text-primary'
                                        )}
                                        to={`/lecturer/course/edit-course/${courseId}/${parentModule.moduleTitle}/${childModule.moduleTitle}`}
                                        state={{
                                            parentModule: parentModule,
                                            childModule: childModule,
                                        }}
                                    >
                                        {childModule.moduleTitle}
                                    </Link>
                                ))}
                        </NavLink>
                    ) : null
                )}

            <hr className='w-full my-4' />
            <button
                onClick={open}
                className='flex justify-center items-center primary-btn gap-3 mb-2 bg-white border border-solid border-red-600 text-red-600 hover:bg-red-600 duration-150'
            >
                <Delete />
                <p>Delete this course</p>
            </button>
            <PrivacyModal
                opened={openModal}
                closeModal={() => setOpenModal(false)}
                // onSavePrivacy={onSavePrivacy}
                courseId={Number(courseId)}
            />
            <Modal opened={opened} onClose={close} title='Delete this course'>
                <p>Are you sure you want to delete this course:</p>
                <strong>{modulesResponse?.courseTitle}</strong>
                <p>This action cannot be undone.</p>
                <div className='flex gap-4 justify-end items-center mt-6'>
                    <button
                        onClick={close}
                        className='bg-gray-500 hover:bg-gray-800 duration-150 cursor-pointer rounded-md px-4 py-2 text-sm text-white'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDeleteCourse}
                        className='bg-red-500 hover:bg-red-700 duration-150 cursor-pointer rounded-md px-4 py-2 text-sm text-white'
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default SideBar;
