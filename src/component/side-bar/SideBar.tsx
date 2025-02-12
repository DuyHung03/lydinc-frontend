import { Divider, NavLink } from '@mantine/core';
import { Edit, LockPerson } from '@mui/icons-material';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useFetchCoursePrivacy } from '../../hook/useFetchCoursePrivacy';
import { useFetchingModules } from '../../hook/useFetchingModules';
import { useFetchingUniversities } from '../../hook/useFetchingUniversities';
import { usePrivacyModal } from '../../hook/usePrivacyModal';
import PrivacyModal from '../privacy-modal/PrivacyModal';

function SideBar() {
    const { courseId } = useParams<{ courseId: string; lesson: string }>();
    const { pathname } = useLocation();

    //Get the menu for the sidebar
    const { data: modulesResponse } = useFetchingModules(Number(courseId));
    const { data: universities } = useFetchingUniversities();

    const isActive = (path: string) => {
        return pathname.includes(encodeURIComponent(path));
    };

    const {
        opened,
        privacy,
        universityIds,
        setPrivacy,
        setUniversityIds,
        openModal,
        closeModal,
        onPrivacyChange,
        onCheckboxChange,
    } = usePrivacyModal();

    const { data: coursePrivacy, refetch, error } = useFetchCoursePrivacy(Number(courseId));

    useEffect(() => {
        if (courseId) {
            refetch();
        }
    }, [courseId, refetch]);

    useEffect(() => {
        if (coursePrivacy) {
            setPrivacy(coursePrivacy.privacy);
            console.log(coursePrivacy);

            setUniversityIds(coursePrivacy.universityIds);
        }
    }, [coursePrivacy, setPrivacy, setUniversityIds]);

    const onSavePrivacy = async () => {
        console.log(privacy, universityIds);
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
                        onClick={openModal}
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
                opened={opened}
                privacy={privacy}
                universityIds={universityIds}
                error={error?.message || null}
                onClose={closeModal}
                universities={universities || []}
                onPrivacyChange={onPrivacyChange}
                onCheckboxChange={onCheckboxChange}
                onSave={() => {
                    onSavePrivacy();
                }}
            />
        </div>
    );
}

export default SideBar;
