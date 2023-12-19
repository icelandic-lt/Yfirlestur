'use client';
import { CorrectionInfo } from '@/common/types';
import { Editor, useCurrentEditor } from '@tiptap/react';
import React, { memo } from 'react';
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
    MdUndo,
    MdRedo,
} from 'react-icons/md';

interface IEditorMenuProps {
    editor: Editor | null;
    acceptAllCorrections: () => void;
    correctionCount: number;
}

export default function EditorMenu(props: IEditorMenuProps) {
    const { editor, acceptAllCorrections, correctionCount } = props;

    if (!editor) {
        return <div className='min-h-[calc(100vh-11rem)] w-full'></div>;
    }
    console.log('Editor is active: ', editor.isActive('bold'));

    return (
        <div className='fixed top-[calc(var(--header-size))] z-20 mb-6 flex w-full flex-col items-center gap-2 bg-neutral px-2 py-4 md:left-auto md:flex-row md:justify-center'>
            <div className='flex flex-row md:gap-2'>
                <button
                    onClick={() => {
                        editor.chain().focus().undo().run();
                    }}
                    disabled={!editor.can().undo()}
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('undo') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdUndo />
                </button>
                <button
                    onClick={() => {
                        editor.chain().focus().redo().run();
                    }}
                    disabled={!editor.can().redo()}
                    className={`btn btn-square btn-ghost btn-sm  ${
                        editor.isActive('redo') ? 'bg-gray-200' : ''
                    }`}
                >
                    <MdRedo />
                </button>
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
                {/* Font size selector */}
                <select
                    className='select select-ghost select-sm'
                    onChange={(e) => {
                        // editor
                        //     .chain()
                        //     .focus()
                        //     .setFontSize(parseInt(e.target.value))
                        //     .run();
                        editor.commands.setFontSize(parseInt(e.target.value));
                    }}
                    defaultValue={16}
                >
                    <option value={8}>8px</option>
                    <option value={10}>10px</option>
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                    <option value={20}>20px</option>
                    <option value={22}>22px</option>
                    <option value={24}>24px</option>
                    <option value={26}>26px</option>
                    <option value={28}>28px</option>
                    <option value={36}>36px</option>
                    <option value={48}>48px</option>
                    <option value={72}>72px</option>
                </select>
                {/* Font selector */}
                <select
                    className='select select-ghost select-sm'
                    onChange={(e) => {
                        console.log('Font value: ', e.target.value);
                        editor.chain().focus().setFontFamily(e.target.value);
                        editor.commands.setFontFamily(e.target.value);
                    }}
                    defaultValue={'Inter'}
                >
                    <option value='Ariel'>Ariel</option>
                    <option value='Inter'>Inter</option>
                    <option value='sans-serif'>Sans-serif</option>
                    <option value='serif'>Serif</option>
                    <option value='monospace'>Monospace</option>
                    <option value='lato'>Lato</option>
                </select>
            </div>
            <div className='divider divider-horizontal hidden sm:flex'></div>
            <div className='w-full sm:w-fit'>
                <div className='flex w-full flex-row items-center justify-end md:gap-4'>
                    <p>
                        {correctionCount === 1
                            ? `${correctionCount} ábending`
                            : `${correctionCount} ábendingar`}
                    </p>
                    <button
                        className='btn btn-primary btn-sm rounded-md'
                        onClick={acceptAllCorrections}
                    >
                        <MdCheck />
                        <p>Samþykkja allar</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
