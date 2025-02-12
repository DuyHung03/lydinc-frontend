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
            editor.commands.setContent(
                '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 2px solid #b39858; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto;">\n' +
                    '    <p style="text-align: center; font-size: 20px; font-weight: bold; color: #2196f3;">\n' +
                    '        <span style="color: #2dc26b;">Change Password Notification - QA Learning Website</span>\n' +
                    '    </p>\n' +
                    '    <p>Dear <strong>' +
                    +'</strong>,</p>\n' +
                    '    <p>We are notifying you of an update to your login account details in the <strong>QA Learning System</strong> for account:</p>\n' +
                    '  <strong> ' +
                    +' </strong>\n' +
                    '    <p><strong style="color: #e03e2d;">If you did not request this change, please contact us immediately to secure your account.</strong></p>\n' +
                    '    <p>Best regards,</p>\n' +
                    '    <p style="font-weight: bold;">QA Learning Website Team</p>\n' +
                    '</div>\n'
            );
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
