import { Lesson } from '../../types/types';

function Text({
    component,
    onChangeValue,
    errors,
}: {
    component: Lesson;
    onChangeValue: (componentId: string, value: string) => void;
    errors: Record<string, string>;
}) {
    return (
        <div className='w-full mb-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Text:</label>
            <textarea
                value={component.text ?? ''}
                onChange={(e) => onChangeValue(component.lessonId, e.target.value)}
                className='w-full p-4 border border-solid border-gray-200 rounded-md h-32'
            ></textarea>
            {errors[component.lessonId] && (
                <p className='text-red-500 text-sm mt-1'>{errors[component.lessonId]}</p>
            )}
        </div>
    );
}

export default Text;
