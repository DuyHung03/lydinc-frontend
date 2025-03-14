import { useFormContext } from 'react-hook-form';
import { RegisterRequest } from '../../page/new-user/NewStudent';

function RegisterBaseForm() {
    const {
        register,
        formState: { errors },
    } = useFormContext<RegisterRequest>();
    return (
        <div className='flex flex-col gap-3'>
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
                            aria-describedby={errors.username ? 'username-error' : undefined}
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
                    {...register('phone')}
                    id='phone'
                    type='text'
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    placeholder='Enter your phone number'
                    className='block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                />
                {errors.phone && (
                    <p id='phone-error' className='text-red-500 text-sm mt-1'>
                        {errors.phone.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default RegisterBaseForm;
