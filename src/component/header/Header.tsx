import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import HeaderMenu from '../header-menu/HeaderMenu';
import HeaderUserMenu from '../header-user/HeaderUserMenu';

function Header() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div
            className='flex justify-between align-middle bg-white h-headerHeight w-screen px-10 gap-4 z-50'
            style={{ borderBottom: '1px solid #e0e0e0' }}
        >
            <a href='/' className='h-full flex items-center'>
                <img
                    src={
                        'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2Flogo_2.png?alt=media&token=190f164c-27dc-4735-8d57-bf452cdfcdf3'
                    }
                    alt='logo'
                    className='w-316'
                />
            </a>

            <HeaderMenu />

            {!isAuthenticated ? (
                <div className='flex gap-2 items-center'>
                    <p className='italic text-gray-500'>Please login</p>
                    <Link to='/login' className='text-primary'>
                        <button className='primary-btn '>Login</button>
                    </Link>
                </div>
            ) : (
                <HeaderUserMenu />
            )}
        </div>
    );
}

export default Header;
