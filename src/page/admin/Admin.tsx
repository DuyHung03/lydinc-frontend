import { Link } from 'react-router-dom';
import Option from '../../component/option-button/Option';

function Admin() {
    const options = [
        {
            title: 'Manage universities',
            icon: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/university.png?alt=media&token=a96839a2-9f79-45d6-bd67-1f2721952929',
            path: 'universities',
        },
        {
            title: 'Manage student',
            icon: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/teamwork.png?alt=media&token=3bec9d18-4855-4c78-830b-176e66565e3b',
            path: 'manage-students',
        },
        {
            title: 'Manage lecturer',
            icon: 'https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lecture.png?alt=media&token=155b0487-9507-472f-bcd2-32cb16c86a44',
            path: 'manage-lecturers',
        },
    ];

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-full lg:w-1200 md:px-4 py-4'>
                <p className='font-semibold text-2xl mb-6'>Choose option:</p>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
                    {options.map((option, index) => (
                        <div className='w-fit' key={index}>
                            <Link to={`${option.path}`}>
                                <Option title={option.title} icons={option.icon} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Admin;
