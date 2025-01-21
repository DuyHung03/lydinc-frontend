import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';

function CourseDetails() {
    const { state } = useLocation();
    const { user } = useAuthStore();

    // Define the query function
    const fetchPracticeLink = async () => {
        const res = await axiosInstance.get('/practice-link/get-practice-link', {
            params: {
                studentId: user?.userId,
                username: user?.username,
            },
        });
        return res.data;
    };

    // Use useQuery to fetch the practice link
    const {
        data: practiceLink,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['practiceLink', user?.userId, user?.username],
        queryFn: fetchPracticeLink,
        enabled: false,
    });

    return (
        <div>
            {/* Render course details from state */}
            <div>{JSON.stringify(state)}</div>

            {user?.roles.includes('STUDENT') && (
                <div>
                    <button
                        className='bg-primary p-3 m-3 rounded-md text-white'
                        onClick={() => refetch()} // Manually trigger fetching
                    >
                        Practice here
                    </button>
                </div>
            )}

            {/* Display loading, error, or practice link */}
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error.message}</p>}
            {practiceLink && (
                <div>
                    <p>
                        Your practice link:{' '}
                        <a className='text-blue-600 ' target='_blank' href={practiceLink.link}>
                            {practiceLink.link}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}

export default CourseDetails;
