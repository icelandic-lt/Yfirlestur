'use client';
import { CorrectionInfo } from '@/common/types';
import React from 'react';

export type CorrectionContextType = {
    corrections: CorrectionInfo[];
    selectedCorrection: string;
    addCorrection: (correction: CorrectionInfo) => void;
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

    const addCorrection = (correction: CorrectionInfo) => {
        setCorrections((prevCorrections) => [...prevCorrections, correction]);
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
