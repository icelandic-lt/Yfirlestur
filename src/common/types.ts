export type CorrectionInfo = {
    correction_type: 'correction' | 'deletion' | 'insertion';
    before_text: string;
    after_text: string;
    context_before?: string;
    context_after?: string;
};
