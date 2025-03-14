import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Loader } from '@mantine/core';
import { CloudUpload, InfoOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { z } from 'zod';
import PageHeader from '../../component/page-header/PageHeader';
import RegisterBaseForm from '../../component/register-base-form/RegisterBaseForm';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import axiosInstance from '../../network/httpRequest';
import { University } from '../../types/types';

const registerRequestSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters long'),
    email: z.string().email('Invalid email address'),
    name: z.string().min(8, 'Name must be at least 8 characters long'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
    universityId: z.number(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

const NewStudent = () => {
    const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        if (state != null) {
            setSelectedUniversity(state.universityId);
        }
    }, [state]);

    // Fetch universities
    const { data: universities, isError } = useFetchingUniversities();

    const methods = useForm<RegisterRequest>({
        resolver: zodResolver(registerRequestSchema),
    });

    // Handle form submission
    const onSubmit = async (data: RegisterRequest) => {
        console.log('Form Data:', data);
        try {
            setLoading(true);
            const res = await axiosInstance.post('/admin/create-account', data);
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
                <PageHeader title='Create new student account' />
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

                {isError && (
                    <Alert mt={30} title='Error' color='red'>
                        Something went wrong, Please try again later!
                    </Alert>
                )}

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className='max-w-lg mx-auto bg-white p-6 space-y-4'
                    >
                        <RegisterBaseForm />

                        {/* University Select */}
                        <div>
                            <label
                                htmlFor='universityId'
                                className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                            >
                                Select University
                            </label>
                            <select
                                id='universityId'
                                {...methods.register('universityId', { valueAsNumber: true })}
                                value={selectedUniversity ?? ''}
                                onChange={(e) => {
                                    setSelectedUniversity(Number(e.target.value));
                                    methods.setValue('universityId', Number(e.target.value));
                                }}
                                className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                            >
                                <option>Select a University</option>
                                {universities?.map((university: University) => (
                                    <option
                                        key={university.universityId}
                                        value={university.universityId}
                                    >
                                        {university.fullName} - {university.shortName}
                                    </option>
                                ))}
                            </select>
                        </div>

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

                        <Link
                            to={'upload'}
                            className='w-full primary-btn py-3 gap-2 flex items-center justify-center'
                            state={state}
                        >
                            <CloudUpload fontSize='small' />
                            <p className='text-white'>Upload Excel file</p>
                        </Link>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default NewStudent;
