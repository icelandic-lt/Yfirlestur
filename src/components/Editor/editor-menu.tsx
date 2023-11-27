'use client';
import { Editor, useCurrentEditor } from '@tiptap/react';
import React from 'react';
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
    MdFormatStrikethrough,
    MdCheck,
    MdFormatAlignLeft,
    MdFormatAlignCenter,
    MdFormatAlignRight,
    MdFormatAlignJustify,
} from 'react-icons/md';

interface IEditorMenuProps {
    editor: Editor | null;
}

export default function EditorMenu(props: IEditorMenuProps) {
    const { editor } = props;

    if (!editor) {
        return <div className='min-h-[calc(100vh-11rem)] w-full'></div>;
    }

    return (
        <div className='fixed left-4 z-20 mb-6 flex w-[calc(100%-2em)] max-w-4xl flex-col gap-2 border-b-2 border-gray-200 bg-white pb-2 pt-4 sm:left-auto sm:mx-4 md:w-[calc(60%-2em)] lg:w-[calc(67%-2em)] xl:w-2/4'>
            <div className='flex flex-row'>
                <button
                    onClick={() => {
                        editor.chain().focus().toggleBold().run();
                    }}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatBold size={24} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can().chain().focus().toggleItalic().run()
                    }
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatItalic size={24} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    disabled={
                        !editor.can().chain().focus().toggleUnderline().run()
                    }
                    className={`btn btn-square btn-ghost prose btn-sm  ${
                        editor.isActive('underline') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatUnderlined size={24} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can().chain().focus().toggleStrike().run()
                    }
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('strike') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatStrikethrough size={24} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign('left').run()
                    }
                    disabled={
                        !editor.can().chain().focus().setTextAlign('left').run()
                    }
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('left') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatAlignLeft size={24} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign('center').run()
                    }
                    disabled={
                        !editor
                            .can()
                            .chain()
                            .focus()
                            .setTextAlign('center')
                            .run()
                    }
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('center') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatAlignCenter size={24} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign('right').run()
                    }
                    disabled={
                        !editor
                            .can()
                            .chain()
                            .focus()
                            .setTextAlign('right')
                            .run()
                    }
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('right') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatAlignRight size={24} />
                </button>
                <button
                    onClick={() =>
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                    disabled={
                        !editor
                            .can()
                            .chain()
                            .focus()
                            .setTextAlign('justify')
                            .run()
                    }
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('justify') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdFormatAlignJustify size={24} />
                </button>
            </div>

            <button className='btn btn-primary btn-sm rounded-md sm:absolute sm:right-2'>
                <MdCheck />
                <p>Samþykkja allt</p>
            </button>
        </div>
    );
}
