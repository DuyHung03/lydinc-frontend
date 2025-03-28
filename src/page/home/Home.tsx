import { Domain, Group, WorkspacePremium } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
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

    const slider = [
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F2.jpg?alt=media&token=c5b22790-b7ef-4c54-94f9-1016cd8069b2',
            alt: 'Slide 1',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F1.jpg?alt=media&token=73f318b5-1128-4d57-ba64-c96c266b5797',
            alt: 'Slide 2',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F3.jpg?alt=media&token=b96094a0-baf6-4d30-a7d0-12c9ea215af4',
            alt: 'Slide 3',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F4.jpg?alt=media&token=e201aae8-00f4-47a2-b9d2-96d6f2ca9ad1',
            alt: 'Slide 4',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F5.jpg?alt=media&token=86be65ec-354f-423d-a3ec-0783a36f14d7',
            alt: 'Slide 5',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F6.jpg?alt=media&token=e902d157-ab8a-4d1f-8b99-83c42ba41092',
            alt: 'Slide 6',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F7.jpg?alt=media&token=e85994ee-4fb1-4765-b300-38db4b38eb3c',
            alt: 'Slide 7',
        },
        {
            img: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2F8.jpg?alt=media&token=810daf3b-6a0d-4c7b-bfd0-7849a7cd3371',
            alt: 'Slide 8',
        },
    ];

    return (
        <div className='w-screen flex flex-col justify-center items-center'>
            <div className='grid grid-cols-1 xl:grid-cols-2'>
                <div className='w-full max-w-screen-lg mx-auto'>
                    <Carousel
                        autoPlay={true}
                        showThumbs={false}
                        swipeable={true}
                        infiniteLoop={true}
                        emulateTouch
                        showStatus={false}
                    >
                        {slider.map((slider) => (
                            <div className='h-[430px]'>
                                <img
                                    src={slider.img}
                                    alt={slider.alt}
                                    className='object-cover object-center h-[430px] w-full'
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className='w-full bg-gray-100'>
                    <div className='p-12'>
                        <h1 className='uppercase font-bold text-4xl text-primary '>
                            Ensuring the quality of higher education
                        </h1>
                        <ul className='mt-8 px-10 text-xl leading-relaxed font-semibold text-gray-700 list-none'>
                            <li className="before:content-['-'] before:mr-2">
                                Training Program Development based on Learning outcomes.
                            </li>
                            <li className="before:content-['-'] before:mr-2">
                                Internal Quality Assurance System Development
                            </li>
                            <li className="before:content-['-'] before:mr-2">
                                Self-Assessment for Educational Institutions and Curriculums
                            </li>
                            <li className="before:content-['-'] before:mr-2">
                                Innovation, Creativity, and Entrepreneurship
                            </li>
                            <li className="before:content-['-'] before:mr-2">
                                University Governance Innovation
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='py-10'>
                <div className='max-w-[1200px] text-[#eee] grid grid-cols-1 xl:grid-cols-3 py-3 gap-16'>
                    <div className='flex justify-center items-center gap-6 py-4 px-6 bg-primary rounded-3xl '>
                        <h3 className='text-[70px]'>16</h3>
                        <div className='flex flex-col justify-center items-start gap-1'>
                            <Domain fontSize='large' />
                            <p className='max-w-52 text-md'>
                                Educational institutions, partner organizations
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-6 py-4 px-6 bg-primary rounded-3xl '>
                        <h3 className='text-[70px]'>4500+</h3>
                        <div className='flex flex-col justify-center items-start gap-1'>
                            <Group fontSize='large' />
                            <p className='max-w-52 text-md'>Leaders, lecturers participating</p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-6 py-4 px-6 bg-primary rounded-3xl '>
                        <h3 className='text-[70px]'>70+</h3>
                        <div className='flex flex-col justify-center items-start gap-1'>
                            <WorkspacePremium fontSize='large' />
                            <p className='max-w-52 text-md'>
                                Faculties / Majors / Training programs participating
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-[1200px] px-5 xl:px-0'>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/partner.jpg?alt=media&token=34ff1306-ff0b-423f-892e-03edb3f59514'
                    alt=''
                />
            </div>
            <div className='max-w-[1200px] px-5 xl:px-0'>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/courses.jpg?alt=media&token=24fd3116-f378-4734-aa0d-f9811c2e9815'
                    alt=''
                />
            </div>
        </div>
    );
}

export default Home;
