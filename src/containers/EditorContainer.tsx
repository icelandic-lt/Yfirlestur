'use client';
import React from 'react';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
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
import HardBreak from '@tiptap/extension-hard-break';
import { EditorContent, useEditor } from '@tiptap/react';

import CorrectionList from '../components/Corrections/correction-list';
import EditorMenu from '../components/Editor/editor-menu';

export default function EditorContainer() {
    const editor = useEditor({
        extensions: [
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
                    'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-28 before:sm:top-20 before:left-0 before:text-gray-400 before-pointer-events-none',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'pt-28 sm:pt-20 w-full md:min-h-[calc(100vh-10rem)] min-h-[calc(100vh-9rem)] prose prose-base focus:outline-none overflow-y-auto pb-8',
                spellcheck: 'false',
            },
        },
        autofocus: true,
        onUpdate: watchChanges,
    });

    function watchChanges({ editor }) {
        console.log(editor.view.dom.innerText);

        console.log(editor.getHTML());
        console.log(editor.getJSON());
        console.log(editor.getText());
    }

    return (
        <div className='flex w-full grow overflow-hidden'>
            <div className='flex grow justify-start overflow-hidden xl:justify-center'>
                <EditorMenu editor={editor} />
                <div className='flex h-fit w-full flex-col items-center sm:top-20 md:w-3/5 lg:w-2/3 xl:w-2/4'>
                    <div className='h-fit w-full max-w-4xl px-4 xl:px-0'>
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
            <div className='fixed right-0 top-[--header-size] hidden h-[calc(100%-var(--header-size))] flex-row justify-end md:flex'>
                <div className='max-w-80 sticky flex w-80 flex-col overflow-hidden'>
                    <h2 className='mb-6 ml-7 pt-6 text-lg font-bold'>
                        Ábendingar:
                    </h2>
                    <CorrectionList
                        corrections={[
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                            {
                                correction_type: 'correction',
                                before_text: 'heimildarmind',
                                after_text: 'heimildarmynd',
                                context_before: 'Þetta er',
                                context_after: 'um fljúgandi furðuhluti',
                            },
                            {
                                correction_type: 'deletion',
                                before_text: 'að',
                                after_text: 'að',
                                context_before: 'auka setning',
                                context_after: 'til að sýna',
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
