import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Modal } from '@mantine/core';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import logo from '../../assets/logo_2.png';
import axiosInstance from '../../network/httpRequest';

const resetPwSchema = z.object({
    username: z.string().min(6, 'Invalid username'),
});

type ResetPwSchema = z.infer<typeof resetPwSchema>;

function ResetPasswordModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [emailSentTo, setEmailSentTo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ResetPwSchema>({
        resolver: zodResolver(resetPwSchema),
    });

    const onSubmit = async (data: ResetPwSchema) => {
        try {
            setLoading(true);
            setErrorMessage('');

            const res = await axiosInstance.post(
                '/user/send-email-rp',
                {},
                {
                    params: { username: data.username },
                }
            );

            if (res.status === 200) {
                setIsSuccess(true);
                setEmailSentTo(res.data);
            } else {
                setErrorMessage(res.data || 'Failed to reset password');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error?.response?.data || 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal size={540} opened={opened} onClose={onClose}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col justify-center items-center gap-4'
            >
                <img src={logo} className='w-80' />

                {isSuccess ? (
                    <div className='flex flex-col justify-center items-center gap-3 mb-6'>
                        <CheckCircle htmlColor='#62bd69' style={{ fontSize: '60px' }} />
                        <h2 className='text-center text-xl font-semibold'>
                            Email Sent Successfully!
                        </h2>
                        <p className='text-gray-400 text-center text-sm'>
                            A reset password link has been sent to{' '}
                            <strong>
                                {emailSentTo.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2')}
                            </strong>
                            . <br />
                            Please check your email address!
                        </p>
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center gap-6 px-8'>
                        <h2 className='text-center text-xl font-semibold'>Forgot Password?</h2>
                        <p className='text-gray-400 text-center text-sm'>
                            Please enter your registered username to reset your password.
                        </p>

                        {errorMessage && (
                            <Alert w={'100%'} title='Error' color='red'>
                                {errorMessage}
                            </Alert>
                        )}

                        <div className='w-full'>
                            <label
                                htmlFor='username'
                                className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-0.5"
                            >
                                Username
                            </label>
                            <input
                                {...register('username')}
                                id='username'
                                maxLength={40}
                                required
                                type='text'
                                aria-invalid={!!errors.username}
                                aria-describedby={errors.username ? 'username-error' : undefined}
                                placeholder='Enter username'
                                className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                            />
                            {errors.username && (
                                <p id='username-error' className='text-red-500 text-sm my-2'>
                                    {errors.username.message}
                                </p>
                            )}

                            <button
                                disabled={loading}
                                type='submit'
                                className={`p-3 ${
                                    loading ? 'bg-gray-500' : 'bg-primary'
                                } text-white w-full my-5 text-sm`}
                            >
                                {loading ? 'Sending...' : 'Send email'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
}

export default ResetPasswordModal;
