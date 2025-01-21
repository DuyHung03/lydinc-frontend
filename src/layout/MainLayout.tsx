import { Outlet } from 'react-router-dom';
import Footer from '../component/footer/Footer';
import Header from '../component/header/Header';

function MainLayout() {
    return (
        <div className='w-full flex flex-col min-h-screen'>
            <div className='fixed z-10 w-full top-0'>
                <Header />
            </div>

            <main className={`flex w-full pt-headerHeight pb-20`}>
                <Outlet />
            </main>
            <div className='w-full'>
                <Footer />
            </div>
        </div>
    );
}

export default MainLayout;
