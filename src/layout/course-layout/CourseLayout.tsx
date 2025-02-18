import { Outlet } from 'react-router-dom';
import CourseHeader from '../../component/course-header/CourseHeader';
import CourseSideBar from '../../component/course-sidebar/CourseSideBar';
import ScrollToTop from '../../component/scroll-to-top/ScrollToTop';

function CourseLayout() {
    return (
        <div>
            <ScrollToTop />
            <div className='relative z-10'>
                <CourseHeader />
            </div>
            <div className='fixed top-0 left-0 bottom-0 mt-16 w-1/4 '>
                <CourseSideBar />
            </div>
            <main className='fixed top-0 left-1/4 bottom-0 mt-16 overflow-y-scroll w-3/4'>
                <Outlet />
            </main>
        </div>
    );
}

export default CourseLayout;
