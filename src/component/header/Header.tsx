import { Link } from 'react-router-dom';
import logo from '../../assets/logo_2.png';
import useAuthStore from '../../store/useAuthStore';
import HeaderMenu from '../header-menu/HeaderMenu';
import HeaderUserMenu from '../header-user/HeaderUserMenu';

function Header() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div
            className='flex justify-between align-middle bg-white h-headerHeight w-screen px-10 z-50'
            style={{ borderBottom: '1px solid #e0e0e0' }}
        >
            <a href='/' className='h-full flex items-center'>
                <img src={logo} alt='logo' className='w-316' />
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
