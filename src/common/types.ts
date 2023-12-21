import { Decoration } from 'prosemirror-view';

export type CorrectionInfo = {
    id: string;
    change_type: 'edit' | 'delete' | 'insert';
    orig_str_idx: number;
    orig_end_idx: number;
    orig_str: string;
    changed_str: string;
    context_before?: string;
    context_after?: string;
    decoration: Decoration;
    lower_display_str: string;
    before_lower_display_str?: string;
    after_lower_display_str?: string;
    upper_display_str: string;
};

// type hints for the Correction response from the backend
export type Annotation = {
    orig_str_idx: number;
    orig_end_idx: number;
    orig_str: string;
    changed_start_idx: number;
    changed_end_idx: number;
    changed_str: string;
    change_type: string;
};

export type CorrectionResult = {
    original_text: string;
    changed_text: string;
    diff_annotations: Annotation[];
};

export type CorrectionResponse = {
    results: CorrectionResult[];
};

export type TipTapCommands = {
    acceptCorrection: (
        correction: CorrectionInfo,
        nextCorrection: CorrectionInfo | undefined
    ) => void;
    acceptAllCorrections: () => void;
    rejectCorrection: (
        correction: CorrectionInfo,
        nextCorrection: CorrectionInfo | undefined
    ) => void;
    selectCorrection: (id: string) => void;
};
