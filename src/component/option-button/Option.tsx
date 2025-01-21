function Option({ title, icons }: { title: string; icons: string }) {
    return (
        <div
            className='w-316 bg-primary rounded-2xl justify-center items-center flex hover:bg-slate-500 duration-200'
            style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}
        >
            <div className='flex justify-between items-center h-16'>
                <div className='flex items-center'>
                    <img src={icons} alt={title} className='w-12' />

                    <span className='ml-4 text-lg text-white'>{title}</span>
                </div>
            </div>
        </div>
    );
}

export default Option;
