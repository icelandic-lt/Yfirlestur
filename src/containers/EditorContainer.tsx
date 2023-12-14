'use client';

import { useCallback, useRef } from 'react';

import { useCorrectionContext } from '../components/Corrections/CorrectionContext';
import CorrectionList from '../components/Corrections/correction-list';
import { CorrectionInfo, TipTapCommands } from '@/common/types';
import TextEditor from '@/components/Editor/text-editor';

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
            setSelectedCorrectionById(id);
            editorRef.current?.selectCorrection(id);
        },
        []
    );

    const handleAcceptAllCorrections = useCallback(() => {
        editorRef.current?.acceptAllCorrections();
        clearCorrections();
    }, []);

    function getNextCorrection(correction: CorrectionInfo) {
        let nextCorrectionToSelect: CorrectionInfo | undefined;
        // Next correction in the list
        if (corrections.length !== 1) {
            if (corrections.indexOf(correction) === corrections.length - 1) {
                // This was the last correction, select the one before it
                nextCorrectionToSelect =
                    corrections[corrections.indexOf(correction) - 1];
            } else {
                // This was not the last correction, select the next one
                nextCorrectionToSelect =
                    corrections[corrections.indexOf(correction) + 1];
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
            removeCorrectionById(correction.id);
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
            let nextCorrectionToSelect = getNextCorrection(correction);
            removeCorrectionById(correction.id);
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
