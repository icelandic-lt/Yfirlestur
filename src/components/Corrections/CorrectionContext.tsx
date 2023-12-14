'use client';
import { CorrectionInfo } from '@/common/types';
import React, { createContext, useContext, useState } from 'react';
import { Decoration, DecorationSet } from 'prosemirror-view';

export type CorrectionContextType = {
    corrections: CorrectionInfo[];
    selectedCorrection: string;
    updateCorrections: (
        addedCorrections: CorrectionInfo[],
        correctionsToBeRemoved: string[],
        newDecorationSet: DecorationSet
    ) => void;
    clearCorrections: () => void;
    removeCorrection: (correction: CorrectionInfo) => void;
    removeCorrectionById: (id: string) => void;
    setSelectedCorrectionById: (id: string) => void;
};

export const CorrectionContext = createContext<CorrectionContextType>({
    corrections: [],
    selectedCorrection: '',
    updateCorrections: () => {},
    clearCorrections: () => {},
    removeCorrection: () => {},
    removeCorrectionById: () => {},
    setSelectedCorrectionById: () => {},
});

export const CorrectionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [corrections, setCorrections] = useState<CorrectionInfo[]>([]);
    const [selectedCorrection, setSelectedCorrection] = useState<string>('');

    const updateCorrections = (
        addedCorrections: CorrectionInfo[],
        removedCorrectionIds: string[],
        newDecorationSet: DecorationSet
    ) => {
        // Find all of the new decorations that were added and add them to an updated list of corrections
        const newDecorations = newDecorationSet.find();
        // Loop through the new decorations and when the correction_id matches one from the addedCorrections, add it to the newCorrections list at the right index
        let decorationIndex = 0;
        let correctionIndex = 0;
        setCorrections((prevCorrections) => {
            const newCorrections: CorrectionInfo[] = [...prevCorrections];
            // Start by removing the corrections that are to be removed
            for (let i = 0; i < removedCorrectionIds.length; i++) {
                newCorrections.splice(
                    newCorrections.findIndex(
                        (c) => c.id === removedCorrectionIds[i]
                    ),
                    1
                );
            }
            // Then add the new corrections
            for (let i = 0; i < newDecorations.length; i++) {
                if (correctionIndex >= addedCorrections.length) {
                    break;
                }
                decorationIndex = i;
                if (
                    newDecorations[i].spec.correction_id ===
                    addedCorrections[correctionIndex].id
                ) {
                    newCorrections.splice(
                        decorationIndex,
                        0,
                        addedCorrections[correctionIndex]
                    );
                    correctionIndex++;
                }
            }
            return newCorrections;
        });
    };

    const clearCorrections = () => {
        setCorrections((prevCorrections) => []);
        setSelectedCorrection('');
    };

    const removeCorrection = (correction: CorrectionInfo) => {
        console.log('Removing correction...');
        setCorrections((prevCorrections) =>
            prevCorrections.filter((c) => c !== correction)
        );
    };

    const removeCorrectionById = (id: string) => {
        console.log('Removing correction with id: ', id, '...');
        setCorrections((prevCorrections) =>
            prevCorrections.filter((c) => c.id !== id)
        );
    };

    const setSelectedCorrectionById = (id: string) => {
        console.log('Setting selected correction to id: ', id);
        setSelectedCorrection(id);
    };

    return (
        <CorrectionContext.Provider
            value={{
                corrections,
                selectedCorrection,
                updateCorrections,
                clearCorrections,
                removeCorrection,
                removeCorrectionById,
                setSelectedCorrectionById,
            }}
        >
            {children}
        </CorrectionContext.Provider>
    );
};

export const useCorrectionContext = (): CorrectionContextType => {
    return useContext(CorrectionContext);
};
