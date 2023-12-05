'use client';

import {
    Editor,
    EditorContent,
    Extension,
    ReactNodeViewRenderer,
    useEditor,
} from '@tiptap/react';
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
import HardBreak from '@tiptap/extension-hard-break';
import { useEffect, useState } from 'react';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Editor as CoreEditor } from '@tiptap/core';
import { CorrectionExtension } from './extensions/correction-extension';
import UniqueID from '@tiptap-pro/extension-unique-id';
import { useCorrectionContext } from '../Corrections/CorrectionContext';
import { Decoration } from 'prosemirror-view';
import { CorrectionInfo } from '@/common/types';

interface ITextEditorProps {
    editor: Editor;
}

export default function TextEditor(props: ITextEditorProps) {
    const [timer, setTimer] = useState<number | null>(null);

    return (
        <div className='flex grow justify-start overflow-hidden xl:justify-center'>
            <EditorMenu editor={props.editor} />
            <div className='flex h-fit w-full flex-col items-center sm:top-20 md:w-3/5 lg:w-2/3 xl:w-2/4'>
                <div className='h-fit w-full max-w-4xl px-4 xl:px-0'>
                    <EditorContent editor={props.editor} />
                </div>
            </div>
        </div>
    );
}
