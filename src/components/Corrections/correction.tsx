'use client';
import { CorrectionInfo } from '@/common/types';
import React, { memo, useEffect } from 'react';
import { MdArrowForward, MdCheck, MdClose } from 'react-icons/md';

interface ICorrectionprops {
    correction: CorrectionInfo;
    id: string;
    acceptCorrection: (
        e: React.MouseEvent<HTMLButtonElement>,
        correction: CorrectionInfo
    ) => void;
    rejectCorrection: (
        e: React.MouseEvent<HTMLButtonElement>,
        correction: CorrectionInfo
    ) => void;
    selectCorrection: (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => void;
    isSelected: boolean;
}

export default memo(function Correction(props: ICorrectionprops) {
    const {
        id,
        correction_type,
        before_text,
        after_text,
        context_before,
        context_after,
    } = props.correction;

    // Animation: transition-all duration-150 ease-in-out

    return (
        <label id={`${id}_side_correction`}>
            <input
                type='checkbox'
                className='peer hidden'
                name='correction_item'
                checked={props.isSelected}
                onChange={(e) =>
                    props.selectCorrection(e, props.isSelected ? '' : props.id)
                }
            />
            <div
                className={`group flex flex-row overflow-hidden rounded-l-md p-0 ${
                    props.isSelected ? 'w-[320px]' : 'w-[300px]'
                } ${props.isSelected ? 'bg-gray-100' : 'bg-white'}`}
            >
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
                    <strong
                        className={`text-sm font-bold ${
                            props.isSelected ? 'block' : 'hidden'
                        }`}
                    >
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
                    <div
                        className={`flex-wrap py-2 text-sm ${
                            props.isSelected ? 'block' : 'hidden'
                        }`}
                    >
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
                <div
                    className={`flex-col justify-between py-2 pr-2 ${
                        props.isSelected ? 'flex' : 'hidden'
                    }`}
                >
                    <button
                        className='btn btn-circle btn-ghost btn-sm'
                        onClick={(e) => {
                            props.rejectCorrection(e, props.correction);
                        }}
                    >
                        <MdClose size={20} />
                    </button>
                    <button
                        className='btn btn-square btn-primary btn-sm '
                        onClick={(e) => {
                            props.acceptCorrection(e, props.correction);
                        }}
                    >
                        <MdCheck size={20} />
                    </button>
                </div>
            </div>
        </label>
    );
});
