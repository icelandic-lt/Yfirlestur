import { CorrectionInfo } from '@/common/types';
import React from 'react';
import Correction from './correction';

interface ICorrectionListProps {
    corrections: CorrectionInfo[];
}

export default function CorrectionList(props: ICorrectionListProps) {
    const { corrections } = props;
    let keyIndex = 0;
    const correctionLength = corrections.length;
    return (
        <div className='no-scrollbar flex flex-col overflow-y-auto pb-40'>
            {corrections.map((correction) => {
                return (
                    <div
                        key={correction.after_text + `_${keyIndex++}`}
                        className='flex flex-col items-end justify-end'
                    >
                        <div className=' py-[2px]'>
                            <Correction correction={correction} />
                        </div>
                        {keyIndex + 1 !== correctionLength && (
                            <div className='h-[1px] w-[292px] bg-gray-200'></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
