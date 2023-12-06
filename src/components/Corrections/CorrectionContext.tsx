'use client';
import { CorrectionInfo } from '@/common/types';
import React from 'react';
import { Decoration, DecorationSet } from 'prosemirror-view';

export type CorrectionContextType = {
    corrections: CorrectionInfo[];
    selectedCorrection: string;
    addCorrection: (
        correction: CorrectionInfo,
        oldDecorationSet: DecorationSet,
        newDecorationSet: DecorationSet
    ) => void;
    removeCorrection: (correction: CorrectionInfo) => void;
    removeCorrectionById: (id: string) => void;
    setSelectedCorrectionById: (id: string) => void;
};

export const CorrectionContext = React.createContext<CorrectionContextType>({
    corrections: [],
    selectedCorrection: '',
    addCorrection: () => {},
    removeCorrection: () => {},
    removeCorrectionById: () => {},
    setSelectedCorrectionById: () => {},
});

export const CorrectionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [corrections, setCorrections] = React.useState<CorrectionInfo[]>([]);
    const [selectedCorrection, setSelectedCorrection] =
        React.useState<string>('');

    const addCorrection = (
        correction: CorrectionInfo,
        oldDecorationSet: DecorationSet,
        newDecorationSet: DecorationSet
    ) => {
        console.log('adding correction: ', correction);
        // Find the index of where the docoration was added in the newDecorationSet
        let index = 0;
        const oldDecorations = oldDecorationSet.find();
        const newDecorations = newDecorationSet.find();
        for (let i = 0; i < newDecorations.length; i++) {
            index = i;
            if (i >= oldDecorations.length) {
                break;
            }
            const newDecoration: Decoration = newDecorations[i];
            const oldDecoration: Decoration = oldDecorations[i];
            if (
                newDecoration.spec.correction_id !==
                oldDecoration.spec.correction_id
            ) {
                break;
            }
        }
        // Add the correction to the list of corrections in the right place
        setCorrections((prevCorrections) => {
            const newCorrections = [...prevCorrections];
            newCorrections.splice(index, 0, correction);
            return newCorrections;
        });
    };

    const removeCorrection = (correction: CorrectionInfo) => {
        console.log('removing correction: ', correction);
        setCorrections((prevCorrections) =>
            prevCorrections.filter((c) => c !== correction)
        );
    };

    const removeCorrectionById = (id: string) => {
        setCorrections((prevCorrections) =>
            prevCorrections.filter((c) => c.id !== id)
        );
    };

    const setSelectedCorrectionById = (id: string) => {
        setSelectedCorrection(id);
    };

    return (
        <CorrectionContext.Provider
            value={{
                corrections,
                selectedCorrection,
                addCorrection,
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
    return React.useContext(CorrectionContext);
};
