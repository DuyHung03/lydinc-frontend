import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FileButton, InputLabel, LoadingOverlay } from '@mantine/core';
import { AddAPhoto } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axiosInstance from '../../network/httpRequest';
import { uploadImage } from '../../util/firebase/uploadImage';

type NewUniversityProps = {
    onCreateSuccess: () => void;
};

function NewUniversity({ onCreateSuccess }: NewUniversityProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Zod Schema
    const newSchoolSchema = z.object({
        fullname: z.string().max(255, 'Full name is too long').nonempty('Full name is required'),
        shortname: z.string().max(255, 'Short name is too long').nonempty('Short name is required'),
        location: z.string().max(255, 'Location is too long').nullable(),
    });
    type NewSchoolSchema = z.infer<typeof newSchoolSchema>;

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<NewSchoolSchema>({
        resolver: zodResolver(newSchoolSchema),
    });

    // Form submission
    const onSubmit = async (data: NewSchoolSchema) => {
        try {
            setIsLoading(true);
            if (!file) {
                setError('fullname', {
                    type: 'manual',
                    message: 'Please upload a logo',
                });
                return;
            }

            const logoUrl = await uploadImage(file, (progress) => console.log(progress));

            const res = await axiosInstance.post(
                '/university/create-new-university',
                {},
                {
                    params: {
                        fullName: data.fullname,
                        shortName: data.shortname,
                        location: data.location,
                        logo: logoUrl,
                    },
                }
            );

            if (res.status == 200) {
                onCreateSuccess();
            }
            console.log('Form Data:', data);
            console.log('Selected File:', file);
        } catch (e) {
            setError('root', {
                type: 'manual',
                message: 'An error occurred!',
            });
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex justify-center items-center'>
                <LoadingOverlay visible={isLoading} />
            </div>

            {/* Display root errors */}
            {errors.fullname && (
                <p id='fullname-error' className='text-red-500 text-sm'>
                    {errors.fullname.message}
                </p>
            )}

            {/* Full Name Input */}
            <div>
                <label
                    htmlFor='fullName'
                    className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:text-red-500 after:ml-0.5'
                >
                    Full Name
                </label>
                <input
                    {...register('fullname')}
                    id='fullName'
                    type='text'
                    aria-invalid={!!errors.fullname}
                    aria-describedby={errors.fullname ? 'fullname-error' : undefined}
                    required
                    placeholder="Enter university's full name"
                    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                />
            </div>

            {/* Short Name Input */}
            <div>
                <label
                    htmlFor='shortName'
                    className='block text-sm font-medium text-gray-700 mb-1 after:content-["*"] after:text-red-500 after:ml-0.5'
                >
                    Short Name
                </label>
                <input
                    id='shortName'
                    {...register('shortname')}
                    type='text'
                    placeholder="Enter university's short name"
                    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                    onChange={(e) => {
                        // Transform value to uppercase on input
                        const upperCaseValue = e.target.value.toUpperCase();
                        e.target.value = upperCaseValue;
                    }}
                />
                {errors.shortname && (
                    <p id='shortname-error' className='text-red-500 text-sm'>
                        {errors.shortname.message}
                    </p>
                )}
            </div>

            {/* Location Input */}
            <div>
                <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>
                    Location
                </label>
                <input
                    id='location'
                    {...register('location')}
                    type='text'
                    placeholder="Enter university's location"
                    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                />
                {errors.location && (
                    <p id='location-error' className='text-red-500 text-sm'>
                        {errors.location.message}
                    </p>
                )}
            </div>

            {/* File Upload */}
            <div className='flex gap-4 items-center'>
                <InputLabel required ta={'start'} c={'dark.7'}>
                    University's logo
                </InputLabel>
                <FileButton accept='image/png,image/jpeg,image/jpg' onChange={setFile}>
                    {(props) => (
                        <Button
                            style={{ border: '1px dashed #ddd' }}
                            w={76}
                            h={56}
                            {...props}
                            variant='transparent'
                            c={'#5789cf'}
                        >
                            <AddAPhoto fontSize='small' />
                        </Button>
                    )}
                </FileButton>
            </div>
            {file && (
                <div className='flex justify-center'>
                    <img className='w-1/2' src={URL.createObjectURL(file)} />
                </div>
            )}
            {/* Submit Button */}
            <div className='text-right'>
                <button
                    type='submit'
                    className='px-6 py-2 bg-primary text-white font-medium rounded-md shadow hover:bg-primary-dark focus:ring-2 focus:ring-primary-light focus:outline-none'
                >
                    Save
                </button>
            </div>
        </form>
    );
}

export default NewUniversity;
