import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Loader } from '@mantine/core';
import { CloudUpload, InfoOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageHeader from '../../component/page-header/PageHeader';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import axiosInstance from '../../network/httpRequest';
import { University } from '../../types/types';

const registerRequestSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters long'),
    email: z.string().email('Invalid email address'),
    name: z.string().min(8, 'Name must be at least 8 characters long'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits long'),
    universityId: z.number(),
});

type RegisterRequest = z.infer<typeof registerRequestSchema>;

const NewUser = () => {
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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterRequest>({
        resolver: zodResolver(registerRequestSchema),
    });

    // Handle form submission
    const onSubmit = async (data: RegisterRequest) => {
        console.log('Form Data:', data);
        try {
            setLoading(true);
            //Call API create account
            const res = await axiosInstance.post('/admin/create-account', [data]);
            if (res.status === 200) {
                navigate(-1);
            } else {
                // Handle error response
                console.error('Error during registration:', res.data);
                // Display error message
            }
        } catch (e) {
            console.error('Error during registration:', e);
            // Handle error appropriately, e.g., display an error message
        } finally {
            setLoading(false);
        }
    };

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(Number(e.target.value));
        setValue('universityId', Number(e.target.value));
    };

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-760 p-4'>
                <PageHeader title='Create new account' />
                <div className='w-full'>
                    <Alert
                        radius={'md'}
                        title={'NOTE'}
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
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='max-w-lg mx-auto bg-white p-6 space-y-4'
                >
                    {/* Username */}
                    <div className='w-full flex justify-center items-start gap-4'>
                        <div className='w-full grow'>
                            <div>
                                <label
                                    htmlFor='username'
                                    className="block text-sm font-medium text-gray-700 mb-1 after:content-['*']
                                     after:text-red-500 after:ml-0.5"
                                >
                                    Username
                                </label>
                                <input
                                    {...register('username')}
                                    id='username'
                                    type='text'
                                    aria-invalid={!!errors.username}
                                    aria-describedby={
                                        errors.username ? 'username-error' : undefined
                                    }
                                    placeholder='Enter your username'
                                    className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                                />
                                {errors.username && (
                                    <p id='username-error' className='text-red-500 text-sm mt-1'>
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Email */}
                        <div className='w-full grow'>
                            <div>
                                <label
                                    htmlFor='email'
                                    className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                                >
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    id='email'
                                    type='email'
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    placeholder='Enter your email'
                                    className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                                />
                                {errors.email && (
                                    <p id='email-error' className='text-red-500 text-sm mt-1'>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor='name'
                            className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                        >
                            Full Name
                        </label>
                        <input
                            {...register('name')}
                            id='name'
                            type='text'
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                            placeholder='Enter your full name'
                            className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        />
                        {errors.name && (
                            <p id='name-error' className='text-red-500 text-sm mt-1'>
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}

                    {/* Phone Number */}
                    <div>
                        <label
                            htmlFor='phoneNumber'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Phone Number
                        </label>
                        <input
                            {...register('phoneNumber')}
                            id='phoneNumber'
                            type='text'
                            aria-invalid={!!errors.phoneNumber}
                            aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                            placeholder='Enter your phone number'
                            className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        />
                        {errors.phoneNumber && (
                            <p id='phoneNumber-error' className='text-red-500 text-sm mt-1'>
                                {errors.phoneNumber.message}
                            </p>
                        )}
                    </div>

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
                            value={selectedUniversity ?? ''}
                            onChange={handleUniversityChange}
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
            </div>
        </div>
    );
};

export default NewUser;
