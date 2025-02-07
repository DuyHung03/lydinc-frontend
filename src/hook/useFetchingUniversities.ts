import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { University } from '../types/types';

export const useFetchingUniversities = () => {
    const getUniversities = async () => {
        const res = await axiosInstance.get('/university/get-all-universities');
        return res.data;
    };

    const {
        data: universities,
        isLoading,
        refetch,
        isError,
    } = useQuery<University[]>({
        queryKey: ['universities'],
        queryFn: getUniversities,
        gcTime: 600000, // Cache: 10 minutes,
    });

    return { universities, isLoading, refetch, isError };
};
