import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axiosInstance from '../../network/httpRequest';
import useAuthStore from '../../store/useAuthStore';
import { User } from '../../types/types';

function Home() {
    const { user, login } = useAuthStore();

    const { data } = useQuery<User>({
        queryKey: ['user', user?.userId],
        queryFn: async () => {
            const res = await axiosInstance.get('/user/get-user-info');
            return res.data;
        },
        gcTime: 6000000,
        enabled: !user,
    });

    useEffect(() => {
        if (data) {
            login(data);
        }
    }, [data, login]);

    // useFetchResetPwUrl();

    return (
        <div className='w-screen'>
            <div className='relative w-full'>
                <video
                    // autoPlay
                    muted
                    loop
                    className='w-full object-cover'
                    style={{ height: '360px' }}
                >
                    <source
                        src='https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/4163444909036.mp4?alt=media&token=cc80a2a3-f080-4fcc-a01c-a360e0e0725b'
                        type='video/mp4'
                    />
                </video>

                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <h1 className='text-4xl font-bold text-white'>Welcome to our website</h1>
                </div>
            </div>
            <div className='w-full'>
                {/* <div className='w-full p-4 bg-primary flex justify-center items-center'>
                    <div className='w-1200'></div>
                </div> */}
                <div className='flex flex-col gap-8 justify-center items-center bg-bg-zebra bg-no-repeat bg-cover p-8'>
                    <div className='w-1200 '>
                        <p className='font-bold mb-2 text-black text-xl'>Introduction:</p>
                        <div>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima numquam
                            eos consectetur ut, deleniti deserunt voluptatum qui dolores est
                            voluptates facilis? Sapiente, tempora voluptatem magnam architecto error
                            nobis ipsum sequi.
                        </div>
                    </div>
                    <div className='w-1200 '>
                        <p className='font-bold mb-2 text-black text-xl'>Introduction:</p>
                        <div>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima numquam
                            eos consectetur ut, deleniti deserunt voluptatum qui dolores est
                            voluptates facilis? Sapiente, tempora voluptatem magnam architecto error
                            nobis ipsum sequi.
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='w-1/2 p-8 border-primary border border-solid'>s</div>
                </div>
            </div>
        </div>
    );
}

export default Home;
