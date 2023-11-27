'use client';
import { CorrectionInfo } from '@/common/types';
import React from 'react';
import { MdArrowForward, MdCheck, MdClose } from 'react-icons/md';

interface ICorrectionprops {
    correction: CorrectionInfo;
}

export default function Correction(props: ICorrectionprops) {
    const {
        correction_type,
        before_text,
        after_text,
        context_before,
        context_after,
    } = props.correction;

    return (
        <label>
            <input
                type='radio'
                className='peer hidden'
                name='correction_item'
            />
            <div className='group flex w-[300px] flex-row overflow-hidden rounded-l-md p-0 transition-all duration-300 ease-in-out peer-checked:w-[320px] peer-checked:bg-gray-100'>
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
                                    ? 'underline'
                                    : 'line-through'
                            }`}
                        >
                            {after_text}
                        </span>
                        {context_after ? (
                            <span> {context_after}...</span>
                        ) : (
                            <span>...</span>
                        )}
                    </div>
                </div>
                <div className='hidden flex-col justify-between py-2 pr-2 peer-checked:group-[]:flex'>
                    <button className='btn btn-circle btn-ghost btn-sm'>
                        <MdClose size={20} />
                    </button>
                    <button className='btn btn-square btn-primary btn-sm '>
                        <MdCheck size={20} />
                    </button>
                </div>
            </div>
        </label>
    );
}
