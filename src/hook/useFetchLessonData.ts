import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { Lesson, Module } from '../types/types';

export const useFetchLessonData = ({ module }: { module: Module | null }) => {
    const getLesson = async (moduleId: string) => {
        const res = await axiosInstance.get('/lesson/get-lesson-data', {
            params: { moduleId },
        });
        return res.data;
    };

    return useQuery<Lesson[]>({
        queryKey: module ? ['lesson', module.moduleId] : [],
        queryFn: () => getLesson(module!.moduleId),
        enabled: !!module,
        staleTime: 600000,
        gcTime: 600000,
    });
};
