'use client';
import { CorrectionInfo } from '@/common/types';
import React, { useEffect } from 'react';
import { MdArrowForward, MdCheck, MdClose } from 'react-icons/md';
import { useCorrectionContext } from './CorrectionContext';

interface ICorrectionprops {
    correction: CorrectionInfo;
    id: string;
    acceptCorrection: (correction: CorrectionInfo) => void;
    rejectCorrection: (correction: CorrectionInfo) => void;
    selectCorrection: (id: string) => void;
}

export default function Correction(props: ICorrectionprops) {
    const {
        id,
        correction_type,
        before_text,
        after_text,
        context_before,
        context_after,
    } = props.correction;

    const { selectedCorrection } = useCorrectionContext();

    useEffect(() => {
        // Scroll to the selected correction into view if it is not already in view
        console.log('In useEffect, selectedCorrection: ', selectedCorrection);
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
    }, [`${selectedCorrection}_side_correction` === `${id}_side_correction`]);

    // Animation: transition-all duration-150 ease-in-out

    return (
        <label id={`${id}_side_correction`}>
            <input
                type='checkbox'
                className='peer hidden'
                name='correction_item'
                checked={id === selectedCorrection}
                onChange={() =>
                    props.selectCorrection(
                        id === selectedCorrection ? '' : props.id
                    )
                }
            />
            <div className='group flex w-[300px] flex-row overflow-hidden rounded-l-md p-0 peer-checked:w-[320px] peer-checked:bg-gray-100'>
                <div
                    className={`w-2 ${
                        correction_type === 'correction'
                            ? 'bg-correctionAlteration'
                            : correction_type === 'deletion'
                              ? 'bg-correctionDeletion'
                              : 'bg-correctionInsertion'
                    } `}
                ></div>
                <div className='flex grow flex-col py-2 pl-2'>
                    <strong className='hidden text-sm font-bold peer-checked:group-[]:block'>
                        {correction_type === 'correction'
                            ? 'Möguleg villa:'
                            : correction_type === 'deletion'
                              ? 'Óþarfa orð:'
                              : 'Viðbót:'}
                    </strong>
                    <p className='text-sm'>{before_text}</p>
                    <div className='flex flex-row items-center gap-1'>
                        <MdArrowForward size={20} />
                        <p>{after_text}</p>
                    </div>
                    <div className='hidden flex-wrap py-2 text-sm peer-checked:group-[]:block'>
                        {context_before && <span>{context_before} </span>}
                        <span
                            className={`${
                                correction_type !== 'deletion'
                                    ? `border-b-2 ${
                                          correction_type === 'correction'
                                              ? 'border-correctionAlteration'
                                              : 'border-correctionInsertion'
                                      }`
                                    : 'line-through'
                            }`}
                        >
                            {after_text}
                        </span>
                        {context_after ? (
                            <span> {context_after}</span>
                        ) : (
                            <span>...</span>
                        )}
                    </div>
                </div>
                <div className='hidden flex-col justify-between py-2 pr-2 peer-checked:group-[]:flex'>
                    <button
                        className='btn btn-circle btn-ghost btn-sm'
                        onClick={() => {
                            props.rejectCorrection(props.correction);
                        }}
                    >
                        <MdClose size={20} />
                    </button>
                    <button
                        className='btn btn-square btn-primary btn-sm '
                        onClick={() => {
                            props.acceptCorrection(props.correction);
                        }}
                    >
                        <MdCheck size={20} />
                    </button>
                </div>
            </div>
        </label>
    );
}
