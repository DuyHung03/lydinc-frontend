import { Divider, NavLink } from '@mantine/core';
import { Edit } from '@mui/icons-material';
import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useFetchingModules } from '../../hook/useFetchingModules';

function SideBar() {
    const { courseId, lesson } = useParams<{ courseId: string; lesson: string }>();
    const { pathname } = useLocation();
    console.log(lesson);

    //Get the menu for the sidebar
    const { data: modules } = useFetchingModules(courseId);

    const isActive = (path: string) => {
        const res = pathname.includes(encodeURIComponent(path));

        return res;
    };

    return (
        <div className='max-w-96 w-96 px-4 py-8 flex flex-col'>
            {pathname.includes('/edit-course') && (
                <>
                    <Link
                        to={'#'}
                        className='flex justify-center items-center primary-btn gap-3 mb-2'
                    >
                        <Edit />
                        <p>Edit course's structure</p>
                    </Link>
                    <Divider w={'100%'} h={1} mt={12} mb={20} />
                </>
            )}
            {modules?.map((parentModule) =>
                parentModule.level === 0 ? (
                    <NavLink
                        key={parentModule.moduleId}
                        label={parentModule.moduleTitle}
                        // active={isActive(parentModule.moduleTitle)}
                        className={clsx(isActive(parentModule.moduleTitle) ? 'underline' : null)}
                        variant='filled'
                        color='gray.4'
                        c={isActive(parentModule.moduleTitle) ? '#b39858' : 'black'}
                        fw={500}
                        defaultOpened={true}
                        childrenOffset={0}
                    >
                        {modules
                            .filter(
                                (childModule) =>
                                    childModule.parentModuleId === parentModule.moduleId
                            )
                            .map((childModule) => (
                                <Link
                                    key={childModule.moduleId}
                                    className={clsx(
                                        'w-full my-2 py-2 px-4 duration-150 block pl-8 hover:bg-slate-500 hover:text-white text-sm',
                                        isActive(childModule.moduleTitle) && 'bg-primary text-white'
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
        </div>
    );
}

export default SideBar;
