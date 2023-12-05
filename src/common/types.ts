import { Decoration } from 'prosemirror-view';

export type CorrectionInfo = {
    id: string;
    correction_type: 'correction' | 'deletion' | 'insertion';
    from: number;
    to: number;
    before_text: string;
    after_text: string;
    context_before?: string;
    context_after?: string;
};

// type hints for the Correction response from the backend
export type Token = {
    kind: number;
    text: string;
    original: string;
    i: number;
};

export type Annotation = {
    start: number;
    end: number;
    start_char: number;
    end_char: number;
    code: string;
    text: string;
    references: any[];
    detail: string | null;
    suggest: string;
};

export type Sentence = {
    original: string;
    tokens: Token[];
    annotations: Annotation[];
    corrected: string;
};

export type Paragraph = {
    sentences: Sentence[];
    total_tokens: number;
};

export type Stats = {
    num_tokens: number;
    num_sentences: number;
    num_parsed: number;
    num_chars: number;
    ambiguity: number;
};

export type CorrectionResponse = {
    paragraphs: Paragraph[];
    stats: Stats;
    text: string;
    valid: boolean;
    readability_stats: any | null;
    rare_words: any | null;
};
