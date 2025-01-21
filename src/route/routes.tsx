import { RouteObject } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Admin from '../page/admin/Admin';
import CourseDetails from '../page/course-details/CourseDetails';
import Home from '../page/home/Home';
import Lecturer from '../page/lecturer/Lecturer';
import Login from '../page/login/Login';
import ManageUniversity from '../page/manage-uni/ManageUniversity';
import ManageUsers from '../page/manage-users/ManageUsers';
import NewCourse from '../page/new-course/NewCourse';
import NewUser from '../page/new-user/NewUser';
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
];

export const lecturerRoutes: RouteObject[] = [
    {
        path: 'lecturer',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute element={<Lecturer />} allowedRoles={['LECTURER', 'ADMIN']} />
                ),
            },
            {
                path: 'new-course',
                element: <ProtectedRoute element={<NewCourse />} allowedRoles={['LECTURER']} />,
            },
            {
                path: 'course/:courseId',
                element: (
                    <ProtectedRoute
                        element={<CourseDetails />}
                        allowedRoles={['LECTURER', 'ADMIN']}
                    />
                ),
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
            {
                path: 'course/:courseId',
                element: <ProtectedRoute element={<CourseDetails />} allowedRoles={['STUDENT']} />,
            },
        ],
    },
];
export const adminRoutes: RouteObject[] = [
    {
        path: 'admin',
        element: <MainLayout />,
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
                path: 'manage-users/new-user',
                element: <ProtectedRoute element={<NewUser />} allowedRoles={['ADMIN']} />,
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
