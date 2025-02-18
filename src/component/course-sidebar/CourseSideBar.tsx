import { NavLink } from '@mantine/core';
import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useFetchingModules } from '../../hook/useFetchingModules';

function CourseSideBar() {
    const { courseId } = useParams<{ courseId: string; lesson: string }>();
    const { pathname } = useLocation();
    const isActive = (path: string) => {
        return pathname.includes(encodeURIComponent(path));
    };

    //Get the menu for the sidebar
    const { data: modulesResponse } = useFetchingModules(Number(courseId));
    return (
        <div className='h-full overflow-y-scroll py-5 border-r border-solid border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-600 p-3'>
                {modulesResponse?.courseTitle}
            </h3>
            <hr className='mb-3' />
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
                                    to={`/student/course/${courseId}/${parentModule.moduleTitle}/${childModule.moduleTitle}`}
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

export default CourseSideBar;
