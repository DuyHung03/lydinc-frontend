import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Loader } from '@mantine/core';
import { InfoOutlined, Shuffle, Visibility, VisibilityOff } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageHeader from '../../component/page-header/PageHeader';
import axiosInstance from '../../network/httpRequest';
import { University } from '../../types/types';

const registerRequestSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    email: z.string().email('Invalid email address'),
    name: z.string().min(8, 'Name must be at least 8 characters long'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits long'),
    universityId: z.number(),
});

type RegisterRequest = z.infer<typeof registerRequestSchema>;

// Function to generate a strong password
const generateStrongPassword = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const charset = letters + digits;
    const passwordLength = 12; // Total password length
    const passwordArray = Array.from(
        { length: passwordLength },
        () => charset[Math.floor(Math.random() * charset.length)]
    );
    return passwordArray.join('');
};

const NewUser = () => {
    const [, setGeneratedPassword] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch universities using React Query
    const { data: universities, isError } = useQuery({
        queryKey: ['universities'],
        queryFn: async () => {
            const res = await axiosInstance.get('/university/get-all-universities');
            return res.data;
        },
    });

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
            const res = await axiosInstance.post('/auth/create-account', data);
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

    // Handle password generation
    const handleGeneratePassword = () => {
        const password = generateStrongPassword();
        setGeneratedPassword(password);
        setValue('password', password);
    };

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUniversity(Number(e.target.value));
        setValue('universityId', Number(e.target.value)); // Update form value
    };

    // Display loading or error state while fetching universities
    if (isError) return <div>Error fetching universities.</div>;

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-760 p-4'>
                <PageHeader title='Create new account' />
                <div className='w-full'>
                    <Alert
                        radius={'md'}
                        title={'NOTE'}
                        icon={<InfoOutlined />}
                        className='w-96 m-auto'
                    >
                        This account has been created by an administrator. Please complete the form
                        below to provide the required details. <br /> Once the account is
                        successfully created, a confirmation email will be sent to the email address
                        provided in the form.
                    </Alert>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='max-w-lg mx-auto bg-white p-6 rounded-lg space-y-4'
                >
                    {/* Username */}
                    <div className='w-full flex justify-center items-start gap-4'>
                        <div className='w-full grow'>
                            <div>
                                <label
                                    htmlFor='username'
                                    className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
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
                                    className='block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
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
                                    className='block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
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
                            className='block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        />
                        {errors.name && (
                            <p id='name-error' className='text-red-500 text-sm mt-1'>
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor='password'
                            className="block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-0.5"
                        >
                            Password
                        </label>
                        <div className='w-full flex gap-3'>
                            <div className='relative'>
                                <input
                                    {...register('password')}
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={
                                        errors.password ? 'password-error' : undefined
                                    }
                                    placeholder='Enter your password'
                                    className='w-full px-4 py-3 pr-44 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-2'
                                    aria-label='Toggle password visibility'
                                >
                                    {showPassword ? (
                                        <VisibilityOff htmlColor='#d1d5db' />
                                    ) : (
                                        <Visibility htmlColor='#d1d5db' />
                                    )}
                                </button>
                            </div>
                            <button
                                type='button'
                                onClick={handleGeneratePassword}
                                className='flex items-center p-1 text-sm text-blue-600 px-2  rounded-md hover:bg-blue-200 focus:ring-1 duration-150 focus:ring-blue-500 focus:ring-offset-1'
                            >
                                <Shuffle className='mr-2' />
                                Generate
                            </button>
                        </div>
                        {errors.password && (
                            <p id='password-error' className='text-red-500 text-sm mt-1'>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

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
                            className='block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
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
                            className='block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        >
                            <option value=''>Select a University</option>
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
                            className='w-full px-4 py-3 text-white bg-primary rounded-md hover:bg-gray-500 duration-150 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                        >
                            Create account
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NewUser;
