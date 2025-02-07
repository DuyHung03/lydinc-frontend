import { Outlet } from 'react-router-dom';
import Header from '../../component/header/Header';
import SideBar from '../../component/side-bar/SideBar';
function SideBarCourseLayout() {
    return (
        <div className='flex flex-col h-screen w-full'>
            <div className='fixed z-50 top-0'>
                <Header />
            </div>
            <div className='flex flex-row'>
                <div className='relative top-0 -mt-headerHeight border-solid border-gray-200 border-r shadow-xl'>
                    <div
                        className='sticky pt-headerHeight h-screen top-0 overflow-y-auto overflow-x-hidden 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300'
                    >
                        <SideBar />
                    </div>
                </div>
                <main className='h-screen grow mt-headerHeight'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
export default SideBarCourseLayout;
