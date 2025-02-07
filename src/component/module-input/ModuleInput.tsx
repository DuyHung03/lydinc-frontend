import { Tooltip } from '@mantine/core';
import { Delete } from '@mui/icons-material';
import { Module } from '../../types/types';

export default function ModuleInput({
    module,
    modules,
    updateTitle,
    addLesson,
    deleteModule,
    errors,
}: {
    module: Module;

    //To find the module level 1 (lessons)
    modules: Module[];
    updateTitle: (moduleId: string, newTitle: string) => void;
    addLesson: (parentModuleId: string) => void;
    deleteModule: (moduleId: string) => void;
    errors: Record<string, string>;
}) {
    const lessons = modules.filter((m) => m.level === 1 && m.parentModuleId === module.moduleId);

    return (
        <div className='py-4'>
            <div className='w-full'>
                <label
                    htmlFor={module.moduleId}
                    className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                >
                    Module {module.index}{' '}
                    <i className='italic text-gray-400'>({lessons.length} lessons)</i>
                </label>
                <div className='flex gap-2'>
                    <input
                        id={module.moduleId}
                        type='text'
                        value={module.moduleTitle}
                        onChange={(e) => updateTitle(module.moduleId, e.target.value)}
                        placeholder="Enter module's title"
                        className='block w-full px-4 py-3 border border-gray-300 shadow-sm sm:text-sm'
                    />
                    <Tooltip label='Delete this module' openDelay={2000} bg={'gray'}>
                        <button
                            className='w-14 text-gray-400 hover:text-red-400 hover:bg-red-100 duration-150 rounded-md'
                            onClick={() => deleteModule(module.moduleId)}
                        >
                            <Delete />
                        </button>
                    </Tooltip>
                </div>
                {/* Display error message if there is any with the key is module id*/}
                {errors[module.moduleId] && (
                    <p className='text-red-500 text-sm mt-1'>{errors[module.moduleId]}</p>
                )}
            </div>

            {/* Render lessons of this module */}
            <div className='mt-4 space-y-3 ml-8'>
                {lessons.map((lesson) => (
                    <div key={lesson.moduleId} className=''>
                        <label
                            htmlFor={lesson.moduleId}
                            className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                        >
                            Lesson {lesson.index}
                        </label>
                        <div className='flex gap-2'>
                            <input
                                id={lesson.moduleId}
                                type='text'
                                value={lesson.moduleTitle}
                                onChange={(e) => updateTitle(lesson.moduleId, e.target.value)}
                                placeholder="Enter lesson's title"
                                className='block w-full px-4 py-3 border border-gray-300 shadow-sm sm:text-sm'
                            />
                            <Tooltip label='Delete this lesson' openDelay={2000} bg={'gray'}>
                                <button
                                    className='w-14 text-gray-400 hover:text-red-400 hover:bg-red-100 duration-150 rounded-md'
                                    onClick={() => deleteModule(lesson.moduleId)}
                                >
                                    <Delete />
                                </button>
                            </Tooltip>
                        </div>
                        {/* Display error message if there is any with the key is lesson id*/}
                        {errors[lesson.moduleId] && (
                            <p className='text-red-500 text-sm mt-1'>{errors[lesson.moduleId]}</p>
                        )}
                    </div>
                ))}
                <button
                    type='button'
                    onClick={() => addLesson(module.moduleId)}
                    className='primary-btn mt-4 px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600'
                >
                    Add Lesson for Module {module.index}
                </button>
            </div>
        </div>
    );
}
