import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import MenuBar from './MenuBar';
import { extensions } from './extensions';

const TipTapEditor = ({ setData, data }: { setData: (data: string) => void; data?: string }) => {
    const editor = useEditor({
        extensions: extensions,
        content: data, // Initialize with provided content
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setData(html);
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(data || null);
        }
    }, [editor, data]);

    return (
        <div className='editor-container'>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TipTapEditor;
