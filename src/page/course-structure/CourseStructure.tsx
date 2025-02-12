import { Alert, Divider, Loader, LoadingOverlay } from '@mantine/core';
import { InfoOutlined, LockPerson } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { v4 } from 'uuid';
import { z } from 'zod';
import ModuleList from '../../component/module-list/ModuleList';
import PrivacyModal from '../../component/privacy-modal/PrivacyModal';
import { useFetchingModules } from '../../hook/useFetchingModules';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { Module } from '../../types/types';

const moduleSchema = z.object({
    moduleTitle: z.string().min(4, 'Title must be at least 4 characters'),
});

const courseTitleSchema = z.object({
    courseTitle: z.string().min(4, 'Course title must be at least 4 characters'),
});

function CourseStructure({ mode }: { mode: 'create' | 'edit' }) {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [modules, setModules] = useState<Module[]>([]);
    const [title, setTitle] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { data } = useFetchingModules(Number(courseId));

    useEffect(() => {
        if (mode === 'edit' && courseId) {
            if (data) {
                setModules(data.modules);
                setTitle(data.courseTitle);
            }
        }
    }, [mode, courseId, data]);

    const validateTitleInput = (): boolean => {
        const newErrors: Record<string, string> = {};
        const result = courseTitleSchema.safeParse({ courseTitle: title });

        if (!result.success) {
            newErrors['courseTitle'] = result.error.errors[0].message;
        }

        if (modules.length <= 0) {
            newErrors['root'] = 'At least one module is required';
        } else {
            const parentModules = modules.filter((module) => module.level === 0);

            parentModules.forEach((parentModule) => {
                const childModules = modules.filter(
                    (module) =>
                        module.level === 1 && module.parentModuleId === parentModule.moduleId
                );
                if (childModules.length === 0) {
                    newErrors[parentModule.moduleId] = 'This module must have at least one lesson';
                }
            });

            modules.forEach((module) => {
                const result = moduleSchema.safeParse({ moduleTitle: module.moduleTitle });

                if (!result.success) {
                    newErrors[module.moduleId] = result.error.errors[0].message;
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addModule = () => {
        const newModuleId = v4();
        const newLessonId = v4();
        setModules((prev) => [
            ...prev,
            {
                moduleId: newModuleId,
                moduleTitle: '',
                status: 'new',
                level: 0,
                index: prev.filter((m) => m.level === 0).length + 1,
                parentModuleId: '',
            },
            {
                moduleId: newLessonId,
                moduleTitle: '',
                status: 'new',
                level: 1,
                index: prev.filter((l) => l.moduleId === newModuleId).length + 1,
                parentModuleId: newModuleId,
            },
        ]);
    };

    const addLesson = (parentModuleId: string) => {
        setModules((prev) => [
            ...prev,
            {
                moduleId: v4(),
                moduleTitle: '',
                status: 'new',
                level: 1,
                index:
                    prev.filter((m) => m.level === 1 && m.parentModuleId === parentModuleId)
                        .length + 1,
                parentModuleId,
            },
        ]);
    };

    const onChangeTitle = (moduleId: string, newTitle: string) => {
        setModules((prev) =>
            prev.map((module) =>
                module.moduleId === moduleId
                    ? {
                          ...module,
                          moduleTitle: newTitle,
                          status: module.status == 'created' ? 'updated' : module.status,
                      }
                    : module
            )
        );
        setErrors((prev) => ({ ...prev, [moduleId]: '' }));
    };

    const onSaveModules = async () => {
        const isValid = validateTitleInput();
        if (!isValid) {
            return toast.error('An error occurred. Please review the content and try again.', {
                autoClose: 2000,
            });
        }

        if (mode === 'create') {
            await saveModules();
        } else if (mode === 'edit' && courseId) {
            await updateModules(Number(courseId));
        }
    };

    const saveModules = async () => {
        console.log({ title, lecturerId: user?.userId, modules });
        try {
            setIsLoading(true);
            const res = await axiosInstance.post(
                '/courses/new-course',
                {
                    title,
                    lecturerId: user?.userId,
                    modules,
                },
                {
                    withCredentials: true,
                }
            );
            if (res.status === 200) {
                toast.success('Course structure saved successfully', { autoClose: 2000 });
                navigate(-1);
            }
        } catch (e) {
            console.log(e);
            toast.error('Failed to save course structure', { autoClose: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteModule = (moduleId: string) => {
        setModules((prev) =>
            prev
                .map((module) => {
                    if (module.moduleId === moduleId) {
                        // If the module is newly created, remove it entirely
                        return module.status === 'new' ? null : { ...module, status: 'deleted' };
                    }
                    return module;
                })
                .filter((module): module is Module => module !== null)
        );
    };

    const updateModules = async (courseId: number) => {
        const changes = {
            courseId,
            title,
            createdModules: modules.filter((m) => m.status === 'new'),
            updatedModules: modules.filter((m) => m.status === 'updated'),
            deletedModuleIds: modules.filter((m) => m.status === 'deleted').map((m) => m.moduleId),
        };

        console.log('Changes:', changes); // Log changes to verify

        try {
            setIsLoading(true);
            const res = await axiosInstance.put('/module/update-course', changes, {
                withCredentials: true,
            });
            if (res.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Course Structure Updated Successfully!',
                    icon: 'success',
                });
                queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
                navigate(-2);
            }
        } catch (e) {
            console.log(e);
            Swal.fire({
                text: 'Failed!',
                icon: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Modules updated:', modules);
    }, [modules]);

    return (
        <div className='w-full flex flex-col py-5 justify-center items-center'>
            <ToastContainer limit={1} style={{ marginTop: '80px' }} autoClose={2000} />
            <LoadingOverlay visible={isLoading} />
            <PrivacyModal
                courseId={mode === 'create' ? null : Number(courseId)}
                opened={privacyModalOpen}
                closeModal={() => setPrivacyModalOpen(false)}
            />
            <div className='w-full'>
                <Alert
                    radius={'md'}
                    title={'IMPORTANT NOTE'}
                    icon={<InfoOutlined fontSize='small' />}
                    className='w-96 m-auto'
                >
                    Please ensure the following rules are followed when creating courses:
                    <ul className='list-disc pl-5 mt-2'>
                        <li>The title of the course, module, and lesson must not be empty.</li>
                        <li>Each module must contain at least one lesson.</li>
                        <li>Provide a unique course title to avoid duplication.</li>
                        <li>Modules should be well-structured with sequential lessons.</li>
                        <li>
                            Click the <b>"Save"</b> button to submit your changes.
                        </li>
                    </ul>
                </Alert>
            </div>
            <div
                className='w-1200 p-4 rounded-md mt-5'
                style={{
                    boxShadow:
                        'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                }}
            >
                <div className='w-full flex justify-between items-center'>
                    <h1 className='font-semibold text-xl'>
                        {mode === 'create' ? 'Create course structure' : 'Edit course structure'}
                    </h1>
                    <div className='flex justify-center items-center gap-4'>
                        {!courseId && (
                            <div
                                className={`w-fit flex justify-center items-center gap-3 px-6 py-2`}
                            >
                                <p className='text-gray-400 tex-sm italic'>
                                    You can change the privacy for this course after created
                                </p>
                                <div className='text-xs bg-green-600 text-white rounded-2xl font-semibold px-4 py-2'>
                                    Public
                                </div>
                            </div>
                        )}
                        {courseId && (
                            <button
                                onClick={() => setPrivacyModalOpen(true)}
                                className='flex justify-center items-center primary-btn gap-3'
                            >
                                <LockPerson />
                                <p>Edit privacy</p>
                            </button>
                        )}
                    </div>
                </div>
                <Divider w={'100%'} my={12} />
                <div>
                    <label
                        htmlFor='title'
                        className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                    >
                        Course's title
                    </label>
                    <input
                        id='title'
                        type='text'
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors((prev) => ({ ...prev, ['courseTitle']: '' }));
                        }}
                        placeholder='Enter your title'
                        className='block w-full px-4 py-3 border border-gray-300 shadow-sm sm:text-sm'
                    />
                    {errors['courseTitle'] && (
                        <p className='text-red-500 text-sm mt-1'>{errors['courseTitle']}</p>
                    )}
                </div>
                <div>
                    <ModuleList
                        modules={modules}
                        errors={errors}
                        onChangeTitle={onChangeTitle}
                        addLesson={addLesson}
                        deleteModule={deleteModule}
                    />
                    <button
                        type='button'
                        onClick={addModule}
                        className='bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 text-sm text-white'
                    >
                        Add module
                    </button>
                </div>
                <hr className='w-full my-6' />
                {isLoading ? (
                    <Loader />
                ) : (
                    <button
                        type='button'
                        className='bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded'
                        onClick={onSaveModules}
                    >
                        {mode === 'create' ? 'Save' : 'Update'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default CourseStructure;
