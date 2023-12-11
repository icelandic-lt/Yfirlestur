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
import { DecorationSet } from 'prosemirror-view';

import CorrectionList from '../components/Corrections/correction-list';
import { CorrectionInfo, TipTapCommands } from '@/common/types';
import TextEditor from '@/components/Editor/text-editor';
import { useCallback, useRef } from 'react';

export default function EditorContainer() {
    const editorRef = useRef<TipTapCommands>(null);

    const {
        corrections,
        updateCorrections,
        clearCorrections,
        removeCorrectionById,
        setSelectedCorrectionById,
    } = useCorrectionContext();

    const handleSelectCorrection = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
            e.preventDefault();
            console.log('In handleSelectCorrection, id: ', id);
            setSelectedCorrectionById(id);
            editorRef.current?.selectCorrection(id);
        },
        []
    );

    const handleAcceptAllCorrections = useCallback(() => {
        console.log('In handleAcceptAllCorrections');
        editorRef.current?.acceptAllCorrections();
        console.log('Clearing corrections...');
        clearCorrections();
        console.log('Corrections cleared!');
    }, []);

    function getNextCorrection(correction: CorrectionInfo) {
        console.log('Correction in getNextCorrection: ', correction);
        let nextCorrectionToSelect: CorrectionInfo | undefined;
        console.log(
            'corrections.indexOf(correction): ',
            corrections.indexOf(correction)
        );
        console.log('corrections.length: ', corrections.length);
        console.log('Corrections: ', corrections);
        // Next correction in the list
        if (corrections.length !== 1) {
            if (corrections.indexOf(correction) === corrections.length - 1) {
                // This was the last correction, select the one before it
                nextCorrectionToSelect =
                    corrections[corrections.indexOf(correction) - 1];
                console.log('Previous correction: ', nextCorrectionToSelect);
            } else {
                // This was not the last correction, select the next one
                nextCorrectionToSelect =
                    corrections[corrections.indexOf(correction) + 1];
                console.log('Next correction: ', nextCorrectionToSelect);
            }
        }
        return nextCorrectionToSelect;
    }

    const handleAcceptCorrection = useCallback(
        (
            e: React.MouseEvent<HTMLButtonElement>,
            correction: CorrectionInfo
        ) => {
            e.preventDefault();
            let nextCorrectionToSelect = getNextCorrection(correction);
            editorRef.current?.acceptCorrection(
                correction,
                nextCorrectionToSelect
            );

            if (nextCorrectionToSelect) {
                setSelectedCorrectionById(nextCorrectionToSelect.id);
            }
        },
        [corrections]
    );

    const handleRejectCorrection = useCallback(
        (
            e: React.MouseEvent<HTMLButtonElement>,
            correction: CorrectionInfo
        ) => {
            e.preventDefault();
            console.log('Correction: ', correction);
            let nextCorrectionToSelect = getNextCorrection(correction);
            console.log(
                'Next correction to select: ',
                nextCorrectionToSelect?.before_text
            );
            editorRef.current?.rejectCorrection(
                correction,
                nextCorrectionToSelect
            );

            if (nextCorrectionToSelect) {
                setSelectedCorrectionById(nextCorrectionToSelect.id);
            }
        },
        [corrections]
    );

    return (
        <div className='flex w-full grow overflow-hidden'>
            <TextEditor
                acceptAllCorrections={handleAcceptAllCorrections}
                ref={editorRef}
            />
            <CorrectionList
                acceptCorrection={handleAcceptCorrection}
                rejectCorrection={handleRejectCorrection}
                selectCorrection={handleSelectCorrection}
            />
        </div>
    );
}
