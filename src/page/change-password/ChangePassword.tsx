import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, LoadingOverlay } from '@mantine/core';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { z } from 'zod';
import logo from '../../assets/logo_1.png';
import axiosInstance from '../../network/httpRequest';

const changePasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(255, 'Password is too long'),
        confirmPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(255, 'Password is too long'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

function ChangePassword() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    console.log(token);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema) });

    const onSubmit = async (data: ChangePasswordSchema) => {
        console.log(data);
        try {
            setIsLoading(true);
            // Call API to update password
            const res = await axiosInstance.post(
                '/user/change-password',
                {},
                {
                    params: {
                        newPassword: data.newPassword,
                        token: token,
                    },
                }
            );
            if (res.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#b39858',
                    didClose: () => {
                        window.location.replace('/login');
                    },
                });
            } else {
                setError('root', { message: 'Failed to update password' });
            }
        } catch (e) {
            console.error(e);
            if (axios.isAxiosError(e) && e.response) {
                setError('root', {
                    message: e.response.data || 'Failed to update password',
                });
            } else {
                setError('root', { message: 'Failed to update password' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-h-screen flex justify-center items-center'>
            <div className='w-1200 grid grid-cols-1 lg:grid-cols-2'>
                <div className='w-full gap-4 flex flex-col justify-center items-center'>
                    <div className='w-full flex items-center justify-center'>
                        <img src={logo} className='w-48' alt='logo' />
                    </div>
                    <h1 className='text-xl font-semibold text-primary'>Change your password</h1>

                    {/* Display error message if any */}
                    {errors.root && (
                        <Alert title='Error' w={300} color='red'>
                            {errors.root.message}
                        </Alert>
                    )}

                    <form className='w-316 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                        {/* New Password */}
                        <div>
                            <label
                                htmlFor='newPassword'
                                className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                            >
                                New password
                            </label>
                            <div className='relative'>
                                <input
                                    {...register('newPassword')}
                                    id='newPassword'
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder='Enter your new password'
                                    className='block w-316 px-4 py-3 pr-12 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className='absolute right-3 top-2'
                                    aria-label='Toggle new password visibility'
                                >
                                    {showNewPassword ? (
                                        <VisibilityOff htmlColor='#d1d5db' />
                                    ) : (
                                        <Visibility htmlColor='#d1d5db' />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p id='newPassword-error' className='text-red-500 text-sm'>
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor='confirmPassword'
                                className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                            >
                                Confirm password
                            </label>
                            <div className='relative'>
                                <input
                                    {...register('confirmPassword')}
                                    id='confirmPassword'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder='Confirm your new password'
                                    className='block w-316 px-4 py-3 pr-12 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute right-3 top-2'
                                    aria-label='Toggle confirm password visibility'
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOff htmlColor='#d1d5db' />
                                    ) : (
                                        <Visibility htmlColor='#d1d5db' />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p id='confirmPassword-error' className='text-red-500 text-sm'>
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='primary-btn text-sm py-3'
                        >
                            Submit
                        </button>
                    </form>
                </div>
                <div className='hidden lg:flex w-full justify-center items-center'>
                    <img
                        className='w-full max-w-lg'
                        src='https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/computer-security-with-login-password-padlock.jpg?alt=media&token=d44d297d-c257-4436-a70f-48f3d83d7057'
                        alt='security'
                    />
                </div>
            </div>

            <LoadingOverlay visible={isLoading} />
        </div>
    );
}

export default ChangePassword;
