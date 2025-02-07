import { Alert, Divider, Loader } from '@mantine/core';
import { InfoOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { v4 } from 'uuid';
import { z } from 'zod';
import ModuleInput from '../../component/module-input/ModuleInput';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { Module } from '../../types/types';

// Schema definitions
const moduleSchema = z.object({
    moduleTitle: z.string().min(4, 'Title must be at least 4 characters'),
});

const courseTitleSchema = z.object({
    courseTitle: z.string().min(4, 'Course title must be at least 4 characters'),
});

function NewCourse() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [modules, setModules] = useState<Module[]>([]);
    const [title, setTitle] = useState<string>();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const validateTitleInput = (): boolean => {
        const newErrors: Record<string, string> = {};

        const result = courseTitleSchema.safeParse({ courseTitle: title });
        if (!result.success) {
            newErrors['courseTitle'] = result.error.errors[0].message;
        }

        if (modules.length <= 0) {
            newErrors['root'] = 'At least one module is required';
        } else {
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

    const updateTitle = (moduleId: string, newTitle: string) => {
        setModules((prev) =>
            prev.map((module) =>
                module.moduleId === moduleId ? { ...module, moduleTitle: newTitle } : module
            )
        );
        // Clear error when user starts typing of the key is module id
        setErrors((prev) => ({ ...prev, [moduleId]: '' }));
    };

    const onSaveModules = async () => {
        const isValid = validateTitleInput();
        if (!isValid) {
            return toast.error('An error occurred. Please review the content and try again.', {
                autoClose: 2000,
            });
        }
        console.log('Saving modules:', { title, modules, lecturerId: user?.userId });

        // Call api
        saveModules();
    };

    const saveModules = async () => {
        try {
            setIsLoading(true);
            // Call API to save modules
            const res = await axiosInstance.post(
                '/courses/new-course',
                {
                    title,
                    modules,
                    lecturerId: user?.userId,
                },
                {
                    withCredentials: true,
                }
            );
            if (res.status === 200) {
                toast.success('Course structure saved successfully', { autoClose: 2000 });
                navigate(-1);
            } else {
                toast.error('Failed to save course structure', { autoClose: 2000 });
            }
        } catch (e) {
            console.log(e);
            toast.error('Failed to save course structure', { autoClose: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteModule = (moduleId: string) => {
        const newModules = modules.filter((module) => module.moduleId != moduleId);
        console.log(newModules);

        setModules(newModules);
    };

    return (
        <div className='w-full flex flex-col py-5 justify-center items-center'>
            <ToastContainer limit={1} style={{ marginTop: '80px' }} />
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
                <h1 className='font-semibold mb-4 text-xl'>Create course's structure:</h1>
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
                <div className='my-6 flex flex-col gap-2'>
                    <h1 className='font-semibold text-xl'>Modules:</h1>
                    {errors['root'] && (
                        <p className='text-red-500 text-sm mt-1'>{errors['root']}</p>
                    )}
                    <Divider w={'100%'} my={12} />
                    <div>
                        {modules
                            .filter((module) => module.level === 0)
                            .map((module) => (
                                <ModuleInput
                                    key={module.moduleId}
                                    module={module}
                                    modules={modules}
                                    updateTitle={updateTitle}
                                    addLesson={addLesson}
                                    deleteModule={deleteModule}
                                    errors={errors}
                                />
                            ))}
                        <button
                            type='button'
                            onClick={addModule}
                            className='bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2 text-sm text-white'
                        >
                            Add Module
                        </button>
                        <Divider w={'100%'} my={24} />
                        <div>
                            {isLoading ? (
                                <Loader size={'xl'} className='block m-auto' color={'#B39858'} />
                            ) : (
                                <button
                                    type='button'
                                    onClick={onSaveModules}
                                    className='block m-auto primary-btn disabled:cursor-not-allowed mt-4 px-4 py-2 text-sm text-white'
                                    disabled={isLoading}
                                >
                                    Save course's structure
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewCourse;
