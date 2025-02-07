import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function PageHeader({ title }: { title: string }) {
    const navigate = useNavigate();

    return (
        <div className='relative mb-4 text-center align-middle text-gray-500'>
            <button
                onClick={() => navigate(-1)}
                className='absolute left-0 top-1 py-3 pr-3 duration-200 hover:border-b hover:border-PRtext-primary hover:border-solid hover:text-primary'
            >
                <ArrowBackIos fontSize='small' />
                <span className='ml-2'>Back</span>
            </button>
            <h1 className='py-3 text-gray-700 text-2xl font-bold'>{title}</h1>
        </div>
    );
}

export default PageHeader;
