import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { Lesson, Module } from '../types/types';

export const useFetchLessonData = ({
    module,
    courseId,
}: {
    module: Module | null;
    courseId: number;
}) => {
    const getLesson = async (moduleId: string, courseId: number) => {
        const res = await axiosInstance.get('/lesson/get-lesson-data', {
            params: { moduleId, courseId },
        });
        return res.data;
    };

    return useQuery<Lesson[]>({
        queryKey: module ? ['lesson', module.moduleId] : [],
        queryFn: () => getLesson(module!.moduleId, courseId),
        enabled: !!module,
        staleTime: 600000,
        gcTime: 600000,
        retry: false,
    });
};
