function DocumentItem({ file }: { file: File }) {
    return (
        <div className='w-36 bg-white rounded-md p-3'>
            <p className='overflow-hidden text-ellipsis'>{file.name}</p>
        </div>
    );
}

export default DocumentItem;
