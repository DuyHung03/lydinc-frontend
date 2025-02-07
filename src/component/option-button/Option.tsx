function Option({ title, icons }: { title: string; icons: string }) {
    return (
        <div
            className='w-316 justify-center items-center flex primary-btn'
            style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}
        >
            <div className='flex justify-between items-center p-2'>
                <div className='flex items-center'>
                    <img src={icons} alt={title} className='w-10' />

                    <span className='ml-4 text-white'>{title}</span>
                </div>
            </div>
        </div>
    );
}

export default Option;
