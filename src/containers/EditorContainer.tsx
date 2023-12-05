'use client';

import { useEditor } from '@tiptap/react';
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
import { CorrectionExtension } from '../components/Editor/extensions/correction-extension';
import UniqueID from '@tiptap-pro/extension-unique-id';
import { useCorrectionContext } from '../components/Corrections/CorrectionContext';

import CorrectionList from '../components/Corrections/correction-list';
import { CorrectionInfo } from '@/common/types';
import TextEditor from '@/components/Editor/text-editor';

export default function EditorContainer() {
    const { addCorrection, removeCorrectionById, setSelectedCorrectionById } =
        useCorrectionContext();

    // Use the addCorrection function as needed
    const handleAddCorrection = (correction: CorrectionInfo) => {
        // Call addCorrection with the necessary arguments
        addCorrection(correction);
    };

    // Use the removeCorrection function as needed
    const handleRemoveCorrectionById = (id: string) => {
        // Call removeCorrection with the necessary arguments
        removeCorrectionById(id);
    };

    const handleSelectCorrectionInText = (id: string) => {
        setSelectedCorrectionById(id);
    };

    const handleSelectCorrection = (id: string) => {
        console.log('In handleSelectCorrection, id: ', id);
        setSelectedCorrectionById(id);
        if (editor) {
            editor.commands.selectCorrection(id);
        }
    };

    const editor = useEditor({
        extensions: [
            Document,
            Text,
            FontFamily,
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
                handleAddCorrection,
                handleRemoveCorrectionById,
                handleSelectCorrection
            ),
        ],
        editorProps: {
            attributes: {
                class: 'pt-28 sm:pt-20 w-full md:min-h-[calc(100vh-10rem)] min-h-[calc(100vh-9rem)] prose prose-base focus:outline-none overflow-y-auto pb-8',
                spellcheck: 'false',
            },
        },
        autofocus: true,
    });

    function acceptCorrection(correction: CorrectionInfo) {
        editor?.commands.acceptCorrection(correction);
    }

    if (!editor) {
        return null;
    }

    return (
        <div className='flex w-full grow overflow-hidden'>
            <TextEditor editor={editor} />
            <CorrectionList
                acceptCorrection={acceptCorrection}
                selectCorrection={handleSelectCorrection}
            />
        </div>
    );
}
