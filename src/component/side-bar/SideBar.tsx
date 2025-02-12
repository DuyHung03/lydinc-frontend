import { Divider, NavLink } from '@mantine/core';
import { Edit, LockPerson } from '@mui/icons-material';
import clsx from 'clsx';
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useFetchingModules } from '../../hook/useFetchingModules';
import PrivacyModal from '../privacy-modal/PrivacyModal';

function SideBar() {
    const { courseId } = useParams<{ courseId: string; lesson: string }>();
    const [openModal, setOpenModal] = useState(false);
    const { pathname } = useLocation();

    //Get the menu for the sidebar
    const { data: modulesResponse } = useFetchingModules(Number(courseId));

    const isActive = (path: string) => {
        return pathname.includes(encodeURIComponent(path));
    };

    return (
        <div className='max-w-96 w-96 px-4 py-8 flex flex-col'>
            {pathname.includes('/edit-course') && (
                <>
                    <Link
                        to={`/lecturer/edit-structure/${courseId}`}
                        className='flex justify-center items-center primary-btn gap-3 mb-2'
                    >
                        <Edit />
                        <p>Edit course's structure</p>
                    </Link>
                    <button
                        onClick={() => setOpenModal(true)}
                        className='flex justify-center items-center primary-btn gap-3 mb-2'
                    >
                        <LockPerson />
                        <p>Edit privacy</p>
                    </button>
                    <Divider w={'100%'} h={1} mt={12} mb={20} />
                </>
            )}
            {modulesResponse?.modules?.map((parentModule) =>
                parentModule.level === 0 ? (
                    <NavLink
                        key={parentModule.moduleId}
                        label={parentModule.moduleTitle}
                        active={isActive(parentModule.moduleTitle)}
                        color='#b39858'
                        c={isActive(parentModule.moduleTitle) ? '#b39858' : 'black'}
                        fw={500}
                        defaultOpened={true}
                        childrenOffset={0}
                    >
                        {modulesResponse?.modules
                            .filter(
                                (childModule) =>
                                    childModule.parentModuleId === parentModule.moduleId
                            )
                            .map((childModule) => (
                                <Link
                                    key={childModule.moduleId}
                                    className={clsx(
                                        'w-full my-2 py-2 px-4 duration-150 block overflow-hidden text-ellipsis pl-8 hover:bg-slate-500 hover:text-white text-sm',
                                        isActive(childModule.moduleTitle) &&
                                            'underline text-primary'
                                    )}
                                    to={`/lecturer/course/edit-course/${courseId}/${parentModule.moduleTitle}/${childModule.moduleTitle}`}
                                    state={childModule}
                                >
                                    {childModule.moduleTitle}
                                </Link>
                            ))}
                    </NavLink>
                ) : null
            )}
            <PrivacyModal
                opened={openModal}
                closeModal={() => setOpenModal(false)}
                // onSavePrivacy={onSavePrivacy}
                courseId={Number(courseId)}
            />
        </div>
    );
}

export default SideBar;
