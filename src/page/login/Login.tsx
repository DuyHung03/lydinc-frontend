import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { z } from 'zod';
import logo from '../../assets/logo_2.png';
import ResetPasswordModal from '../../component/reset-pw-modal/ResetPasswordModal';
import axiosInstance from '../../network/httpRequest';
const loginSchema = z.object({
    username: z.string().min(4, 'Invalid username').default(''),
    password: z.string().min(4, 'Invalid password').default(''),
});

type LoginSchema = z.infer<typeof loginSchema>;

function Login() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const onSubmit = async (data: LoginSchema) => {
        console.log('Form data submitted:', data);

        try {
            setLoading(true);
            const res = await axiosInstance.post('/auth/login', data);
            console.log(res);

            if (res.status === 200) {
                if (res.data == true) {
                    window.location.replace('/');
                } else {
                    window.location.replace(res.data); //change password url
                }
            }
        } catch (error) {
            console.error('Error during login request:', error);
            if (error instanceof AxiosError) {
                setError('root', {
                    type: 'manual',
                    message: error.response?.data.message || 'An error occurred!',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='grid grid-cols-2 md:grid-cols- h-screen w-screen'>
                <div className='flex flex-col justify-center items-center bg-bg-login bg-no-repeat bg-contain'>
                    <img src={logo} alt='logo' className='w-1/2 h-fit' />

                    <p className='m-2 text-primary font-semibold text-2xl uppercase'>
                        welcome to lydinc qa learning!
                    </p>
                    <p className=' text-gray-400 text-sm italic'>Please login to your account</p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-3 w-96 bg-white p-5'
                    >
                        {errors.root && (
                            <p id='root-error' className='text-red-500 text-sm'>
                                {errors.root.message}
                            </p>
                        )}
                        <div>
                            <input
                                {...register('username')}
                                required
                                aria-invalid={!!errors.username}
                                aria-describedby={errors.username ? 'username-error' : undefined}
                                className='p-2 pr-10 border border-gray-300 w-full focus:caret-primary focus:border-primary focus:border outline-none'
                                placeholder='Username'
                                type='text'
                            />
                            {errors.username && (
                                <p id='username-error' className='text-red-500 text-sm'>
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className='relative'>
                            <input
                                {...register('password')}
                                required
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                className='p-2 pr-10 border border-gray-300 w-full focus:caret-primary focus:border-primary focus:border outline-none'
                                placeholder='Password'
                                type={showPassword ? 'text' : 'password'}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1'
                                aria-label='Toggle password visibility'
                            >
                                {showPassword ? (
                                    <VisibilityOff htmlColor='#d1d5db' />
                                ) : (
                                    <Visibility htmlColor='#d1d5db' />
                                )}
                            </button>
                            {errors.password && (
                                <p id='password-error' className='text-red-500 text-sm'>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <p
                            onClick={open}
                            className='w-fit float-right mt-1 text-sm cursor-pointer font-semibold text-primary'
                        >
                            Forgot password?
                        </p>
                        <Link
                            to={'/register'}
                            className='w-fit float-right mt-1 mb-2 text-sm cursor-pointer font-semibold text-primary'
                        >
                            Create new account
                        </Link>

                        {loading ? (
                            <div className='w-full flex justify-center items-center'>
                                <Loader color={'#B39858'} />
                            </div>
                        ) : (
                            <button
                                type='submit'
                                disabled={loading}
                                className={`p-3 ${
                                    loading ? 'bg-gray-500' : 'bg-primary'
                                } text-white text-sm`}
                            >
                                Login
                            </button>
                        )}
                    </form>
                </div>
                <div className='relative w-full h-full'>
                    <video className='w-full h-screen object-cover-l-3xl' autoPlay loop muted>
                        <source
                            src='https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/Ch%C6%B0a%20c%C3%B3%20t%C3%AAn%20(1080%20x%201920%20px).mp4?alt=media&token=f0bd987c-8575-409b-993d-e65ac15037b5'
                            type='video/mp4'
                        ></source>
                    </video>
                </div>
                <ResetPasswordModal opened={opened} onClose={close} />
            </div>
        </>
    );
}

export default Login;
