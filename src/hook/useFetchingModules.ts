import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { ModulesResponse } from '../types/types';

export const useFetchingModules = (courseId?: number) => {
    const getModules = async () => {
        if (!courseId) throw new Error('courseId is required');
        const res = await axiosInstance.get('/module/get-modules', {
            params: { courseId: courseId },
        });
        return res.data;
    };

    return useQuery<ModulesResponse>({
        queryKey: ['modules', courseId],
        queryFn: getModules,
        enabled: !!courseId,
        staleTime: 60000, // 1 minutes
        gcTime: 300000, // 5 minutes
    });
};
