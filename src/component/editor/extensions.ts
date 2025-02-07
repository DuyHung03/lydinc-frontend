import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

export const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name, OrderedList.name] }),
    Underline,
    TextStyle.configure({ mergeNestedSpanStyles: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
];
