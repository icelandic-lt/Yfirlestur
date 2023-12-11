import { CorrectionInfo } from '@/common/types';
import React, { memo, useEffect } from 'react';
import Correction from './correction';
import { CorrectionContext } from './CorrectionContext';

interface ICorrectionListProps {
    acceptCorrection: (correction: CorrectionInfo) => void;
    rejectCorrection: (correction: CorrectionInfo) => void;
    selectCorrection: (id: string) => void;
}

export default function CorrectionList(props: ICorrectionListProps) {
    const { acceptCorrection, rejectCorrection, selectCorrection } = props;
    const { corrections, selectedCorrection } =
        React.useContext(CorrectionContext);

    useEffect(() => {
        console.log('In useEffect, selectedCorrection: ', selectedCorrection);
        // Scroll to the selected correction into view if it is not already in view
        if (selectedCorrection !== '') {
            const selectedCorrectionElement = document.getElementById(
                `${selectedCorrection}_side_correction`
            );
            if (selectedCorrectionElement) {
                console.log('Selected element found, scrolling into view');
                selectedCorrectionElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start',
                });
            }
        }
    }, [selectedCorrection]);

    let keyIndex = 0;
    const correctionLength = corrections.length;
    return (
        <div className='fixed right-0 top-[--header-size] hidden h-[calc(100%-var(--header-size))] flex-row justify-end md:flex'>
            <div className='max-w-80 sticky flex w-80 flex-col overflow-hidden'>
                <h2 className='mb-6 ml-7 pt-6 text-lg font-bold'>
                    Ábendingar:
                </h2>
                <div className='no-scrollbar flex flex-col overflow-y-auto pb-[100%]'>
                    {corrections.map((correction) => {
                        console.log(
                            'CORRECTION IN CORRECTION LIST: ',
                            correction
                        );
                        return (
                            <div
                                key={correction.after_text + `_${keyIndex++}`}
                                className='flex flex-col items-end justify-end'
                            >
                                <div className=' py-[2px]'>
                                    <Correction
                                        correction={correction}
                                        id={correction.id}
                                        acceptCorrection={acceptCorrection}
                                        rejectCorrection={rejectCorrection}
                                        selectCorrection={selectCorrection}
                                        isSelected={
                                            selectedCorrection === correction.id
                                        }
                                    />
                                </div>
                                {keyIndex + 1 !== correctionLength && (
                                    <div className='h-[1px] w-[292px] bg-gray-200'></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
