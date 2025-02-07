import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { Module } from '../types/types';

export const useFetchingModules = (courseId?: string) => {
    const getModules = async () => {
        if (!courseId) throw new Error('courseId is required');
        const res = await axiosInstance.get('/module/get-modules', {
            params: { courseId: courseId },
        });
        return res.data;
    };

    return useQuery<Module[]>({
        queryKey: ['modules', courseId],
        queryFn: getModules,
        enabled: !!courseId,
        staleTime: 600000, // 10 minutes
    });
};
