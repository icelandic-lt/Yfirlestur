import { CorrectionInfo } from '@/common/types';
import React, { memo, useEffect, useRef, useState } from 'react';
import Correction from './correction';
import { CorrectionContext } from './CorrectionContext';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import memoize from 'memoize-one';

interface ICorrectionListProps {
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
}

type ItemData = {
    corrections: CorrectionInfo[];
    selectedCorrection: string;
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
};

const Row = memo(
    ({
        data,
        index,
        style,
    }: {
        data: ItemData;
        index: number;
        style: React.CSSProperties;
    }) => {
        const {
            corrections,
            selectedCorrection,
            acceptCorrection,
            rejectCorrection,
            selectCorrection,
        } = data;
        if (index === corrections.length) {
            return <div style={style}></div>;
        }
        return (
            <div
                style={{
                    ...style,
                    bottom: `${500}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    // justifyContent: 'flex-end',
                }}
            >
                <div className=' py-[2px]'>
                    <Correction
                        correction={corrections[index]}
                        id={corrections[index].id}
                        acceptCorrection={acceptCorrection}
                        rejectCorrection={rejectCorrection}
                        selectCorrection={selectCorrection}
                        isSelected={
                            selectedCorrection === corrections[index].id
                        }
                    />
                </div>
                {index !== corrections.length - 1 && (
                    <div className='h-[1px] w-[292px] bg-gray-200'></div>
                )}
            </div>
        );
    }
);

const createItemData = memoize(
    (
        corrections: CorrectionInfo[],
        selectedCorrection: string,
        acceptCorrection: (
            e: React.MouseEvent<HTMLButtonElement>,
            correction: CorrectionInfo
        ) => void,
        rejectCorrection: (
            e: React.MouseEvent<HTMLButtonElement>,
            correction: CorrectionInfo
        ) => void,
        selectCorrection: (
            e: React.ChangeEvent<HTMLInputElement>,
            id: string
        ) => void
    ) => ({
        corrections,
        selectedCorrection,
        acceptCorrection,
        rejectCorrection,
        selectCorrection,
    })
);

export default memo(function CorrectionList(props: ICorrectionListProps) {
    const { acceptCorrection, rejectCorrection, selectCorrection } = props;
    const { corrections, selectedCorrection } =
        React.useContext(CorrectionContext);
    const [previousIndex, setPreviousIndex] = useState<number | undefined>();
    const [requestingScroll, setRequestingScroll] = useState(false);

    const listRef = useRef<List<ItemData> | null>(null);

    useEffect(() => {
        // Scroll to the selected correction into view
        if (selectedCorrection !== '') {
            const selectedCorrectionIndex = corrections.findIndex(
                (c) => c.id === selectedCorrection
            );
            if (
                previousIndex === undefined ||
                selectedCorrectionIndex < previousIndex
            ) {
                listRef.current?.resetAfterIndex(selectedCorrectionIndex);
            } else {
                listRef.current?.resetAfterIndex(previousIndex);
            }
            listRef.current?.scrollToItem(selectedCorrectionIndex, 'smart');
            setRequestingScroll(true);

            setPreviousIndex(selectedCorrectionIndex);
        } else {
            if (previousIndex !== undefined) {
                listRef.current?.resetAfterIndex(previousIndex);
                setPreviousIndex(undefined);
            }
        }
    }, [selectedCorrection]);

    useEffect(() => {
        // Reset after index when corrections change
        listRef.current?.resetAfterIndex(0);
        const selectedCorrectionIndex = corrections.findIndex(
            (c) => c.id === selectedCorrection
        );
        listRef.current?.scrollToItem(selectedCorrectionIndex, 'smart');
    }, [corrections]);

    let keyIndex = 0;
    const correctionLength = corrections.length;

    const correctionList = corrections.map((correction) => {
        return (
            <div
                key={correction.id}
                className='flex flex-col items-end justify-end'
            >
                <div className=' py-[2px]'>
                    <Correction
                        correction={correction}
                        id={correction.id}
                        acceptCorrection={acceptCorrection}
                        rejectCorrection={rejectCorrection}
                        selectCorrection={selectCorrection}
                        isSelected={selectedCorrection === correction.id}
                    />
                </div>
                {<div className='h-[1px] w-[292px] bg-gray-200'></div>}
            </div>
        );
    });

    const onResize = () => {
        if (listRef.current != null) {
            listRef.current.resetAfterIndex(0);
        }
    };

    const itemData = createItemData(
        corrections,
        selectedCorrection,
        acceptCorrection,
        rejectCorrection,
        selectCorrection
    );

    return (
        <div className='h-[calc(100%-8.5rem] fixed right-0 top-[8.5rem] hidden flex-row justify-end md:flex'>
            <div className='max-w-80 sticky flex h-full w-80 flex-col overflow-hidden'>
                <h2 className='mb-6 ml-7 pt-6 text-lg font-bold'>
                    Ábendingar:
                </h2>
                <div className='no-scrollbar flex h-full flex-col overflow-y-auto'>
                    <div style={{ flex: '1 1 auto', height: '100vh' }}>
                        <AutoSizer onResize={onResize}>
                            {({ height, width }) => {
                                return (
                                    <List
                                        ref={listRef}
                                        height={height}
                                        itemData={itemData}
                                        itemCount={
                                            corrections.length > 0
                                                ? corrections.length + 1
                                                : 0
                                        }
                                        itemSize={(index) => {
                                            if (index === corrections.length) {
                                                return window.innerHeight - 285;
                                            }
                                            if (
                                                corrections[index].id ===
                                                selectedCorrection
                                            ) {
                                                // Get the dom element for the selected correction
                                                const selectedCorrectionElement =
                                                    document.getElementById(
                                                        `${selectedCorrection}_side_correction`
                                                    );
                                                // Get the height of the selected correction
                                                const selectedCorrectionHeight =
                                                    selectedCorrectionElement?.offsetHeight;
                                                // Return the height of the selected correction
                                                if (selectedCorrectionHeight) {
                                                    return (
                                                        selectedCorrectionHeight +
                                                        5
                                                    );
                                                }
                                                // If the height is not found, return a default height
                                                return 133;
                                            }
                                            return 65;
                                        }}
                                        itemKey={(index, data) => {
                                            if (index === correctionLength) {
                                                return 'last-item-key';
                                            }
                                            return data.corrections[index].id;
                                        }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                        }}
                                        className='no-scrollbar overflow-y-auto'
                                        width={width}
                                        overscanCount={10}
                                        onScroll={({
                                            scrollDirection,
                                            scrollOffset,
                                            scrollUpdateWasRequested,
                                        }) => {
                                            const selectedCorrectionIndex =
                                                corrections.findIndex(
                                                    (c) =>
                                                        c.id ===
                                                        selectedCorrection
                                                );
                                            if (
                                                requestingScroll &&
                                                selectedCorrectionIndex * 65 >
                                                    scrollOffset
                                            ) {
                                                listRef.current?.scrollToItem(
                                                    selectedCorrectionIndex,
                                                    'start'
                                                );
                                                setRequestingScroll(false);
                                            }
                                        }}
                                    >
                                        {Row}
                                    </List>
                                );
                            }}
                        </AutoSizer>
                    </div>
                    {/* {correctionList} */}
                </div>
            </div>
        </div>
    );
});
