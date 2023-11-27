'use client';

import { Editor, EditorProvider } from '@tiptap/react';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import EditorMenu from './editor-menu';
import FontFamily from '@tiptap/extension-font-family';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Transaction } from '@tiptap/pm/state';
import HardBreak from '@tiptap/extension-hard-break';

export default function Tiptap() {
    function watchChanges({ editor, transaction }) {
        console.log(editor.view.dom.innerText);

        console.log(editor.getHTML());
        console.log(editor.getJSON());
        console.log(editor.getText());
        console.log('Transaction: ', transaction);
    }

    const extensions = [
        Document,
        Text,
        FontFamily,
        TextStyle,
        History,
        Bold,
        Italic,
        Underline,
        Strike,
        HardBreak,
        Heading,
        Highlight,
        ListItem,
        Paragraph,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
            // Use a placeholder:
            placeholder: 'Sláðu inn texta til að lesa yfir…',
            emptyEditorClass:
                'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:text-gray-400 before-pointer-events-none',
        }),
    ];

    return (
        <EditorProvider
            slotBefore={<EditorMenu />}
            extensions={extensions}
            editorProps={{
                attributes: {
                    class: 'w-full min-h-screen prose prose-base focus:outline-none mt-16',
                    spellcheck: 'false',
                },
            }}
            autofocus
            onUpdate={watchChanges}
        ></EditorProvider>
    );
}
