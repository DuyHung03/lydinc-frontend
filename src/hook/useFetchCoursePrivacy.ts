import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { CoursePrivacy } from '../types/types';

export const useFetchCoursePrivacy = (courseId?: number | null) => {
    const getPrivacy = async () => {
        const res = await axiosInstance.get('/courses/courses-privacy', {
            params: { courseId: courseId },
        });
        return res.data;
    };

    return useQuery<CoursePrivacy>({
        queryKey: ['privacy', courseId],
        queryFn: getPrivacy,
        enabled: !!courseId,
    });
};
