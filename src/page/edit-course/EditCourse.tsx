import { Tooltip } from '@mantine/core';
import { AddPhotoAlternate, Delete, FormatSize, VideoCall } from '@mui/icons-material';
import { arrayMoveImmutable } from 'array-move';
import { useEffect, useState } from 'react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { v4 } from 'uuid';
import DocumentsUpload from '../../component/documents-upload/DocumentsUpload';
import Image from '../../component/edit-lesson/Image';
import Text from '../../component/edit-lesson/Text';
import Video from '../../component/edit-lesson/Video';
import '../../component/editor/Editor.scss';
import { useFetchingModules } from '../../hook/useFetchingModules';
import { useFetchLessonData } from '../../hook/useFetchLessonData';
import axiosInstance from '../../network/httpRequest';
import { Lesson, Module } from '../../types/types';

function EditCourse() {
    const { courseId } = useParams();
    const location = useLocation();
    const [components, setComponents] = useState<Lesson[]>([]);
    const { data } = useFetchingModules(Number(courseId));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const module = location.state as Module | null;
    const navigate = useNavigate();
    console.log(module);

    const {
        data: lessonData,
        // isLoading,
        isError,
        error,
    } = useFetchLessonData({ module, courseId: Number(courseId) });

    function validateLessonData() {
        const newErrors: Record<string, string> = {};
        components.forEach((comp) => {
            if (comp.type === 1 && !comp.text) {
                newErrors[comp.lessonId] = 'Text cannot be empty';
            }
            if ((comp.type === 2 || comp.type === 3) && !comp.url) {
                newErrors[comp.lessonId] = 'Media file is required';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    useEffect(() => {
        if (lessonData) {
            setComponents(lessonData);
        }
    }, [lessonData, setComponents]);

    useEffect(() => {
        if (!module && data?.modules?.length) {
            const firstParentModule = data.modules.find((mod) => mod.level === 0);
            const childLesson = firstParentModule
                ? data.modules.find((mod) => mod.parentModuleId === firstParentModule.moduleId)
                : null;

            if (childLesson) {
                navigate(
                    `/lecturer/course/edit-course/${courseId}/${firstParentModule?.moduleTitle}/${childLesson.moduleTitle}`,
                    { state: childLesson, replace: true }
                );
            }
        }
    }, [data, module, courseId, navigate]);

    const addComponent = (type: number) => {
        setComponents((prev) => [
            ...prev,
            {
                lessonId: v4(),
                index: prev.length + 1,
                type,
                text: null,
                url: null,
                fileName: null,
            },
        ]);
    };

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setComponents((prev) => {
            const sortedMovable = arrayMoveImmutable(
                prev.filter((comp) => comp.type !== 4),
                oldIndex,
                newIndex
            ).map((comp, index) => ({ ...comp, index: index + 1 }));

            return prev.map((comp) => (comp.type === 4 ? comp : sortedMovable.shift()!));
        });
    };

    const onChangeTextValue = (componentId: string, value: string) => {
        setComponents((prev) =>
            prev.map((component) =>
                component.lessonId === componentId ? { ...component, text: value } : component
            )
        );
    };

    const deleteComponent = (componentId: string) => {
        setComponents((prev) => {
            const newComponents = prev.filter((component) => component.lessonId != componentId);
            return newComponents.map((c, idx) => ({
                ...c,
                index: idx + 1,
            }));
        });
    };

    async function onSaveLessonData() {
        console.log(components);
        const isValid = validateLessonData();
        if (isValid) {
            const res = await axiosInstance.post('/lesson/update-data', components, {
                params: {
                    moduleId: module!.moduleId,
                },
            });
            if (res.status === 200) {
                Swal.fire({
                    text: 'Lesson data saved successfully',
                    icon: 'success',
                });
            } else {
                console.error('Error saving lesson data:', res.data);
            }
        }
    }

    return (
        <div className='p-5 absolute flex flex-col justify-center items-center'>
            <div style={{ width: '900px' }}>
                {/* {isLoading && <LoadingOverlay visible />} */}
                <div className='w-full flex flex-col justify-center items-center'>
                    <p className='w-full font-semibold text-xl'>{module?.moduleTitle}</p>
                    {isError && <p className='text-red-500'>{error.message}</p>}
                    <hr className='w-full my-6 h-0.5' />
                </div>
                {components.length <= 0 && (
                    <div className='p-5 flex flex-col justify-center items-center'>
                        <p className='text-center font-light italic'>Lesson's data is empty!</p>
                    </div>
                )}
                <div className='fixed flex flex-col right-3 top-28 p-4 text-gray-500 bg-white shadow-2xl border dura border-gray-300 rounded-2xl'>
                    <Tooltip label='Add Text' openDelay={1000} bg={'gray'}>
                        <button
                            onClick={() => addComponent(1)}
                            className='p-3 rounded-lg hover:bg-gray-200'
                        >
                            <FormatSize />
                        </button>
                    </Tooltip>
                    <Tooltip label='Add Photo' openDelay={1000} bg={'gray'}>
                        <button
                            onClick={() => addComponent(2)}
                            className='p-3 rounded-lg hover:bg-gray-200'
                        >
                            <AddPhotoAlternate />
                        </button>
                    </Tooltip>
                    <Tooltip label='Add Video' openDelay={1000} bg={'gray'}>
                        <button
                            onClick={() => addComponent(3)}
                            className='p-3 rounded-lg hover:bg-gray-200'
                        >
                            <VideoCall />
                        </button>
                    </Tooltip>
                </div>

                {/* Drag and Sort List */}
                <SortableList
                    onSortEnd={onSortEnd}
                    className='w-full flex flex-col gap-4'
                    draggedItemClassName='dragged'
                >
                    {components
                        .filter((component) => component.type !== 4)
                        .sort((a, b) => a.index - b.index)
                        .map((component) => (
                            <SortableItem key={component.lessonId}>
                                <div className='sortable-item flex justify-center items-center gap-3'>
                                    {component.type === 1 ? (
                                        <Text
                                            component={component}
                                            onChangeValue={onChangeTextValue}
                                            errors={errors}
                                        />
                                    ) : component.type === 2 ? (
                                        <Image
                                            component={component}
                                            errors={errors}
                                            setComponents={setComponents}
                                        />
                                    ) : component.type === 3 ? (
                                        <Video
                                            component={component}
                                            setComponents={setComponents}
                                            errors={errors}
                                        />
                                    ) : null}
                                    <Tooltip
                                        label='Delete this lesson'
                                        openDelay={2000}
                                        bg={'gray'}
                                    >
                                        <button
                                            className='w-14 p-2 text-gray-400 hover:text-red-400 hover:bg-red-100 duration-150 rounded-md'
                                            onClick={() => deleteComponent(component.lessonId)}
                                        >
                                            <Delete />
                                        </button>
                                    </Tooltip>
                                </div>
                            </SortableItem>
                        ))}
                </SortableList>
                <hr className='mb-5' />

                <DocumentsUpload components={components} setComponents={setComponents} />

                <div className='w-full flex justify-center items-center gap-4'>
                    <button
                        disabled={components.length <= 0}
                        className='my-4 primary-btn'
                        onClick={() => onSaveLessonData()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditCourse;
