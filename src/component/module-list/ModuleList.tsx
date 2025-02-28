import { Module } from '../../types/types';
import ModuleInput from '../module-input/ModuleInput';

export default function ModuleList({
    modules,
    errors,
    onChangeTitle,
    addLesson,
    deleteModule,
}: {
    modules: Module[];
    errors: Record<string, string>;
    onChangeTitle: (moduleId: string, newTitle: string) => void;
    addLesson: (parentModuleId: string) => void;
    deleteModule: (moduleId: string) => void;
}) {
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>Modules:</h1>
            {errors['root'] && <p className='text-red-500 text-sm mt-1'>{errors['root']}</p>}
            <div>
                {modules
                    .filter((module) => module.level === 0 && module.status != 'deleted')
                    .sort((a, b) => a.index - b.index)
                    .map((module) => (
                        <ModuleInput
                            key={module.moduleId}
                            module={module}
                            modules={modules}
                            onChangeTitle={onChangeTitle}
                            addLesson={addLesson}
                            deleteModule={deleteModule}
                            errors={errors}
                        />
                    ))}
            </div>
        </div>
    );
}
