import { ArrowBackIosNewOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_3.png';

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
                    <img src={logo} alt='logo' className='w-60' />
                </a>
            </div>
        </header>
    );
}

export default CourseHeader;
