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
import {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
    ForwardedRef,
    useRef,
} from 'react';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Editor as CoreEditor } from '@tiptap/core';
import { CorrectionExtension } from './extensions/correction-extension';
import UniqueID from '@tiptap-pro/extension-unique-id';
import { useCorrectionContext } from '../Corrections/CorrectionContext';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { CorrectionInfo, TipTapCommands } from '@/common/types';
import { FontSize } from './extensions/text-size';

interface ITextEditorProps {
    acceptAllCorrections: () => void;
}

let TextEditor = forwardRef(
    (props: ITextEditorProps, ref: ForwardedRef<TipTapCommands>) => {
        const {
            corrections,
            updateCorrections,
            clearCorrections,
            removeCorrectionById,
            setSelectedCorrectionById,
        } = useCorrectionContext();

        const handleUpdateCorrections = (
            addedCorrections: CorrectionInfo[],
            removedCorrectionIds: string[],
            newDecorationSet: DecorationSet
        ) => {
            updateCorrections(
                addedCorrections,
                removedCorrectionIds,
                newDecorationSet
            );
        };

        const handleRemoveCorrectionById = (id: string) => {
            removeCorrectionById(id);
        };

        const handleSelectCorrection = (id: string) => {
            console.log('In handleSelectCorrection, id: ', id);
            setSelectedCorrectionById(id);
            if (editor) {
                console.log('Editor was present in handleSelectCorrection');
                editor.commands.selectCorrection(id);
            }
        };

        const editor = useEditor({
            extensions: [
                Document,
                Text,
                FontFamily,
                FontSize,
                TextStyle,
                History,
                Bold,
                Italic,
                Highlight,
                Underline,
                Strike,
                HardBreak,
                Heading,
                ListItem,
                Paragraph,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                Placeholder.configure({
                    placeholder: 'Sláðu inn texta til að lesa yfir…',
                    // emptyEditorClass:
                    //     'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-28 before:sm:top-20 before:left-0 before:text-gray-400 before:pointer-events-none',
                }),
                UniqueID.configure({
                    types: ['heading', 'paragraph'],
                }),
                CorrectionExtension(
                    handleUpdateCorrections,
                    handleRemoveCorrectionById,
                    handleSelectCorrection
                ),
            ],
            editorProps: {
                attributes: {
                    // class: 'pt-28 sm:pt-20 w-[100%] max-w-4xl md:min-h-[calc(100vh-10rem)] min-h-[calc(100vh-9rem)] prose prose-base focus:outline-none overflow-y-auto pb-8',
                    class: 'pt-[12rem] sm:pt-[9rem] md:pt-[10rem] w-[100%] max-w-4xl md:min-h-[calc(100vh-10rem)] min-h-[calc(100vh-9rem)] prose prose-base focus:outline-none overflow-y-auto pb-8',
                    spellcheck: 'false',
                },
            },
            autofocus: true,
        });

        const editorRef: React.MutableRefObject<Editor | null> = useRef(null);
        useImperativeHandle(ref, () => ({
            acceptCorrection: (
                correction: CorrectionInfo,
                nextCorrection: CorrectionInfo | undefined
            ) => {
                editorRef.current?.commands.acceptCorrection(
                    correction,
                    nextCorrection
                );
            },
            acceptAllCorrections: () => {
                editorRef.current?.commands.acceptAllCorrections();
            },
            rejectCorrection: (
                correction: CorrectionInfo,
                nextCorrection: CorrectionInfo | undefined
            ) => {
                editorRef.current?.commands.rejectCorrection(
                    correction,
                    nextCorrection
                );
            },
            selectCorrection: (id: string) => {
                editorRef.current?.commands.selectCorrection(id);
            },
        }));

        if (!editor) {
            return null;
        }
        editorRef.current = editor;

        return (
            <div className='flex grow justify-start overflow-hidden xl:justify-center'>
                <EditorMenu
                    editor={editor}
                    acceptAllCorrections={props.acceptAllCorrections}
                    correctionCount={corrections.length}
                />
                <div className='flex h-fit w-full flex-col items-center sm:top-20 md:w-3/5 lg:w-2/3 xl:w-2/4'>
                    <div className='h-fit w-full max-w-4xl px-4 xl:px-0'>
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
        );
    }
);

export default TextEditor;
