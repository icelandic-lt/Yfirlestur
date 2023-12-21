'use client';
import { CorrectionInfo } from '@/common/types';
import React, { memo } from 'react';
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

export default function Correction(props: ICorrectionprops) {
    const {
        id,
        change_type,
        context_before,
        context_after,
        lower_display_str,
        before_lower_display_str,
        after_lower_display_str,
        upper_display_str,
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
                } ${
                    props.isSelected ? 'bg-gray-100' : 'bg-white'
                } transition-all duration-150 ease-in-out`}
            >
                <div
                    className={`w-2 ${
                        change_type === 'edit'
                            ? 'bg-correctionAlteration'
                            : change_type === 'delete'
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
                        {change_type === 'edit'
                            ? 'Ábending:'
                            : change_type === 'delete'
                              ? 'Óþarfa orð:'
                              : 'Viðbót:'}
                    </strong>
                    <p className='text-sm'>{upper_display_str}</p>
                    <div className='flex flex-row items-center gap-1'>
                        <MdArrowForward size={20} />
                        <p
                            className={
                                change_type === 'delete' ? 'line-through' : ''
                            }
                        >
                            {
                                <span>
                                    <span>{before_lower_display_str}</span>
                                    <span
                                        className={`${
                                            change_type === 'insert'
                                                ? 'border-b-2 border-correctionInsertion'
                                                : change_type === 'delete'
                                                  ? 'text-correctionDeletion line-through'
                                                  : ''
                                        }`}
                                    >
                                        <span
                                            className={`${
                                                change_type === 'delete'
                                                    ? 'text-black'
                                                    : ''
                                            }`}
                                        >
                                            {lower_display_str}
                                        </span>
                                    </span>
                                    <span>{after_lower_display_str}</span>
                                </span>
                            }
                            {/* {changed_str} */}
                        </p>
                    </div>
                    <div
                        className={`h-12 max-w-[264px] flex-wrap items-end py-2 pr-2 text-sm ${
                            props.isSelected ? 'flex' : 'hidden'
                        }`}
                    >
                        <div className='break-words'>
                            {context_before && <span>{context_before} </span>}
                            <span
                                className={`${
                                    change_type !== 'delete'
                                        ? `border-b-2 ${
                                              change_type === 'edit'
                                                  ? 'border-correctionAlteration'
                                                  : 'border-correctionInsertion'
                                          }`
                                        : 'text-correctionDeletion line-through'
                                }`}
                            >
                                <span
                                    className={`${
                                        change_type === 'delete'
                                            ? 'text-black'
                                            : ''
                                    }`}
                                >
                                    {lower_display_str}
                                </span>
                            </span>
                            {context_after ? (
                                <span> {context_after}</span>
                            ) : (
                                <span>...</span>
                            )}
                        </div>
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
}
