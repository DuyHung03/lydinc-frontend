import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../network/httpRequest';
import { University } from '../types/types';

export const useFetchingUniversities = () => {
    const getUniversities = async () => {
        const res = await axiosInstance.get('/university/get-all-universities');
        return res.data;
    };

    return useQuery<University[]>({
        queryKey: ['universities'],
        queryFn: getUniversities,
        staleTime: 600000,
        gcTime: 600000, // Cache: 10 minutes,
    });
};
