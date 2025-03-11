import { Close, MenuOpen } from '@mui/icons-material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../component/header/Header';
import ScrollToTop from '../../component/scroll-to-top/ScrollToTop';
import SideBar from '../../component/side-bar/SideBar';

function SideBarCourseLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default open on desktop

    return (
        <div className='relative'>
            <ScrollToTop />

            {/* Header */}
            <div className='relative z-10'>
                <Header />
            </div>

            {/* Sidebar - Collapsible on both mobile and desktop */}
            <div
                className={`fixed top-0 left-0 z-50 lg:z-0 bottom-0 bg-white shadow-lg transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 overflow-y-scroll`}
            >
                <div className='w-full lg:hidden p-4 relative'>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className='text-gray-600 hover:text-gray-900'
                    >
                        <Close />
                    </button>
                </div>
                <SideBar />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                ></div>
            )}

            {/* Main Content */}
            <main className='fixed top-0 right-0 left-0 lg:left-96 lg:top-headerHeight bottom-0 overflow-y-auto transition-all duration-300 ease-in-out'>
                {/* Mobile Toggle Button */}
                <button
                    className='lg:hidden bg-white shadow-xl  mt-24 text-primary p-2 rounded-full ml-4'
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <MenuOpen />
                </button>

                <Outlet />
            </main>
        </div>
    );
}

export default SideBarCourseLayout;
