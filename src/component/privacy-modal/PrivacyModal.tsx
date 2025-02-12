import { Divider, Modal } from '@mantine/core';
import { Lock, Public } from '@mui/icons-material';
import clsx from 'clsx';

interface PrivacyModalProps {
    opened: boolean;
    onClose: () => void;
    privacy: string;
    universityIds: number[];
    universities: { universityId: number; fullName: string }[];
    error: string | null;
    onPrivacyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

function PrivacyModal({
    opened,
    onClose,
    privacy,
    universityIds,
    universities,
    error,
    onPrivacyChange,
    onCheckboxChange,
    onSave,
}: PrivacyModalProps) {
    if (error) {
        <div className='text-red-600'>
            <p>An error occurred in privacy settings.</p>
        </div>;
        return;
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size={500}
            radius={0}
            transitionProps={{ transition: 'scale-y' }}
            top={30}
            closeOnClickOutside={false}
            withCloseButton={false}
        >
            {/* {isLoading && (
                <div className='flex justify-center items-center h-full'>
                    <Loader />
                </div>
            )} */}
            <div className='mb-16'>
                <h2 className='text-center text-xl my-3'>Privacy Setting</h2>
                <h3 className='mb-4 font-bold'>General Permission</h3>
                <div className={`flex items-center gap-4 px-4 py-2`}>
                    <div
                        className={`w-fit rounded-full p-2 ${clsx(
                            privacy === 'public'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-600'
                        )}`}
                    >
                        {privacy === 'public' ? <Public /> : <Lock />}
                    </div>
                    <select
                        value={privacy}
                        onChange={onPrivacyChange}
                        className='px-6 py-2 border rounded-3xl font-semibold focus:outline-none hover:bg-stone-100 cursor-pointer'
                    >
                        <option value='public'>Public</option>
                        <option value='private'>Private</option>
                    </select>
                </div>
                <Divider className='my-4' />
                {privacy === 'public' ? (
                    <p className='text-gray-600'>
                        This course is publicly accessible to all users. Anyone with the link can
                        view and learn from it.
                    </p>
                ) : (
                    <div className='flex flex-col'>
                        <p className='mb-4 text-gray-600'>
                            Select the universities that can access and learn from this course.
                        </p>
                        <p className='font-semibold mb-2'>Who has access</p>
                        <div className='max-h-80 overflow-y-scroll'>
                            {universities?.map((university) => (
                                <div
                                    key={university.universityId}
                                    className='w-full flex gap-3 items-center px-2 py-2'
                                >
                                    <input
                                        checked={universityIds.includes(university.universityId)}
                                        className='w-4 h-4 cursor-pointer'
                                        onChange={onCheckboxChange}
                                        type='checkbox'
                                        value={university.universityId}
                                    />
                                    <p>{university.fullName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <Divider className='my-4' />
                <button className='float-right primary-btn' onClick={onSave}>
                    Save
                </button>
            </div>
        </Modal>
    );
}

export default PrivacyModal;
