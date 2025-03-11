import { RouteObject } from 'react-router-dom';
import CourseLayout from '../layout/course-layout/CourseLayout';
import MainLayout from '../layout/MainLayout';
import SideBarCourseLayout from '../layout/sidebar-course-layout/SideBarCourseLayout';
import Admin from '../page/admin/Admin';
import ChangePassword from '../page/change-password/ChangePassword';
import CourseDetails from '../page/course-details/CourseDetails';
import CourseStructure from '../page/course-structure/CourseStructure';
import EditCourse from '../page/edit-course/EditCourse';
import Forbiden from '../page/forbiden/Forbiden';
import Home from '../page/home/Home';
import LandingCourse from '../page/landing-course/LandingCourse';
import Lecturer from '../page/lecturer/Lecturer';
import Login from '../page/login/Login';
import ManageUniversity from '../page/manage-uni/ManageUniversity';
import ManageUsers from '../page/manage-users/ManageUsers';
import NewUser from '../page/new-user/NewUser';
import PageNotFound from '../page/not-found/PageNotFound';
import Register from '../page/register/Register';
import StudentUpload from '../page/student-upload/StudentUpload';
import Student from '../page/student/Student';
import UniversityDetails from '../page/uni-details/UniversityDetails';
import ProtectedRoute from './ProtectedRoute';

export const publicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [{ index: true, element: <Home /> }],
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'register',
        element: <Register />,
    },
    {
        path: 'not-allowed',
        element: <Forbiden />,
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
    {
        path: 'reset-password',
        element: <MainLayout isFooter={false} isHeader={false} />,
        children: [
            {
                index: true,
                element: <ChangePassword />,
            },
        ],
    },
];

export const lecturerRoutes: RouteObject[] = [
    {
        path: 'lecturer',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<Lecturer />} allowedRoles={['LECTURER']} />,
            },
            {
                path: 'new-course',
                element: (
                    <ProtectedRoute
                        element={<CourseStructure mode='create' />}
                        allowedRoles={['LECTURER']}
                    />
                ),
            },
            {
                path: 'course/:courseId',
                element: <ProtectedRoute element={<CourseDetails />} allowedRoles={['LECTURER']} />,
            },
            {
                path: 'edit-course/:courseId',
                element: <ProtectedRoute element={<EditCourse />} allowedRoles={['LECTURER']} />,
            },
            {
                path: 'edit-structure/:courseId',
                element: (
                    <ProtectedRoute
                        element={<CourseStructure mode='edit' />}
                        allowedRoles={['LECTURER']}
                    />
                ),
            },
        ],
    },
    {
        path: 'lecturer/course',
        element: <SideBarCourseLayout />,
        children: [
            {
                path: 'edit-course/:courseId/:module?/:lesson?',
                element: <ProtectedRoute element={<EditCourse />} allowedRoles={['LECTURER']} />,
            },
        ],
    },
];

export const studentRoutes: RouteObject[] = [
    {
        path: 'student',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<Student />} allowedRoles={['STUDENT']} />,
            },
        ],
    },
    {
        path: 'learning/course',
        element: <CourseLayout />,
        children: [
            {
                path: ':courseId/:module?/:lesson?',
                element: <ProtectedRoute element={<CourseDetails />} allowedRoles={['STUDENT']} />,
            },
        ],
    },
    {
        path: 'landing/course/:courseId',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<LandingCourse />} allowedRoles={['STUDENT']} />,
            },
        ],
    },
];
export const adminRoutes: RouteObject[] = [
    {
        path: 'admin',
        element: <MainLayout isFooter={false} />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<Admin />} allowedRoles={['ADMIN']} />,
            },
            {
                path: 'universities',
                element: <ProtectedRoute element={<ManageUniversity />} allowedRoles={['ADMIN']} />,
            },
            {
                path: 'manage-users',
                element: <ProtectedRoute element={<ManageUsers />} allowedRoles={['ADMIN']} />,
            },
            {
                path: 'new-user',
                element: <ProtectedRoute element={<NewUser />} allowedRoles={['ADMIN']} />,
            },
            {
                path: 'new-user/upload',
                element: <ProtectedRoute element={<StudentUpload />} allowedRoles={['ADMIN']} />,
            },
            {
                path: 'university/:fullname',
                element: (
                    <ProtectedRoute element={<UniversityDetails />} allowedRoles={['ADMIN']} />
                ),
            },
        ],
    },
];
