import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Loader } from '@mantine/core';
import { InfoOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { z } from 'zod';
import PageHeader from '../../component/page-header/PageHeader';
import RegisterBaseForm from '../../component/register-base-form/RegisterBaseForm';
import axiosInstance from '../../network/httpRequest';

const registerRequestSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters long'),
    email: z.string().email('Invalid email address'),
    name: z.string().min(8, 'Name must be at least 8 characters long'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

const NewLecturer = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const methods = useForm<RegisterRequest>({
        resolver: zodResolver(registerRequestSchema),
    });

    // Handle form submission
    const onSubmit = async (data: RegisterRequest) => {
        console.log('Form Data:', data);
        try {
            setLoading(true);
            const res = await axiosInstance.post('/admin/create-new-lecturer', data);
            if (res.status === 200) {
                navigate(-1);
            }
        } catch (error) {
            console.error('Error during registration:', error);

            let errorMessage = 'Something went wrong';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                text: errorMessage,
                icon: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-760 p-4'>
                <PageHeader title='Create new lecturer account' />
                <div className='w-full'>
                    <Alert
                        radius='md'
                        title='NOTE'
                        icon={<InfoOutlined fontSize='small' />}
                        className='w-96 m-auto'
                    >
                        <li>
                            This account has been created by an administrator. Please complete the
                            form below to provide the required details.
                        </li>
                        <li>
                            Once the account is successfully created, a confirmation email will be
                            sent to the email address provided in the form.
                        </li>
                    </Alert>
                </div>

                {/* {isError && (
                    <Alert mt={30} title='Error' color='red'>
                        Something went wrong, Please try again later!
                    </Alert>
                )} */}

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className='max-w-lg mx-auto bg-white p-6 space-y-4'
                    >
                        <RegisterBaseForm />

                        {/* Submit Button */}
                        {loading ? (
                            <div className='flex flex-col gap-3 justify-center items-center'>
                                <Loader />
                                <p className='italic text-gray-600'>Creating account...</p>
                            </div>
                        ) : (
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full px-4 py-3 text-white primary-btn'
                            >
                                Create account
                            </button>
                        )}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default NewLecturer;
