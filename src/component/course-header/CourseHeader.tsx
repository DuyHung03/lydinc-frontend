import { ArrowBackIosNewOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function CourseHeader() {
    const navigate = useNavigate();
    return (
        <header
            className='w-full h-16 flex justify-between items-center'
            style={{ backgroundColor: '#29303B' }}
        >
            <div className='flex justify-center items-center gap-4'>
                <button
                    onClick={() => navigate(-1)}
                    className='px-9 h-full border-r border-solid border-white'
                >
                    <ArrowBackIosNewOutlined fontSize='small' htmlColor='#fff' />
                </button>
                <a href='/'>
                    <img
                        src={
                            'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2Flogo_3.png?alt=media&token=175c10fb-f591-4bf3-9661-351d011d87aa'
                        }
                        alt='logo'
                        className='w-60'
                    />
                </a>
            </div>
        </header>
    );
}

export default CourseHeader;
