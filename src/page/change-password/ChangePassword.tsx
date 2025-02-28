import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { InfoOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import logo from '../../assets/logo_1.png';
import axiosInstance from '../../network/httpRequest';

function ChangePassword() {
    const [opened, { close }] = useDisclosure(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        .refine((data) => data.newPassword == data.confirmPassword, {
            message: "Passwords don't match",
            path: ['confirmPassword'],
        });

    type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

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
                    },
                }
            );
            if (res.status === 200) {
                window.location.replace('/');
            } else {
                setError('root', { message: 'Failed to update password' });
            }
            setIsLoading(false);
        } catch (e) {
            console.log(e);
            setError('root', { message: 'Failed to update password' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-h-screen flex justify-center items-center'>
            <div className='w-1200 grid grid-cols-2'>
                <div className='w-full gap-4 flex flex-col justify-center items-center'>
                    <div className='w-full flex items-center justify-center'>
                        <img src={logo} className='w-48' alt='logo' />
                    </div>
                    <h1 className='text-xl font-semibold'>Change your password</h1>

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
                        <div>
                            {/* Confirm Password */}
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
                        <button type='submit' className='primary-btn text-sm py-3'>
                            Change password
                        </button>
                    </form>
                </div>
                <div className='w-full flex justify-center items-center'>
                    <img
                        className='w-full max-w-lg'
                        src='https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/computer-security-with-login-password-padlock.jpg?alt=media&token=d44d297d-c257-4436-a70f-48f3d83d7057'
                        alt='security'
                    />
                </div>
            </div>

            {/* Notification and Loading */}

            <LoadingOverlay visible={isLoading} />
            <Modal.Root opened={opened} onClose={close} centered>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Body p={0}>
                        <Alert title={'NOTIFICATION'} icon={<InfoOutlined fontSize='small' />}>
                            Welcome to the platform! As this is your first login, please ensure the
                            security of your account by updating your password immediately.
                        </Alert>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </div>
    );
}

export default ChangePassword;
