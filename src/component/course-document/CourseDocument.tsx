import { Download } from '@mui/icons-material';
import { Lesson } from '../../types/types';

function CourseDocument({ component }: { component: Lesson[] }) {
    return (
        <div>
            <label className='block text-xl font-medium text-red-800 mb-2'>Document:</label>
            <div className='flex flex-col justify-start gap-4 w-fit max-w-xl overflow-hidden text-ellipsis'>
                {component.map((c) => (
                    <a
                        key={c.lessonId}
                        href={c.url!}
                        target='_blank'
                        rel='noopener noreferrer'
                        download
                        className='flex items-center gap-2 rounded-md text-sm text-gray-600 hover:text-primary duration-150 px-6 py-4 border border-solid border-gray-300'
                    >
                        <Download fontSize='small' />
                        <p>{c.fileName}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default CourseDocument;
