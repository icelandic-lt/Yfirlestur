import { CorrectionInfo } from '@/common/types';
import { Extension } from '@tiptap/core';
import { EditorState, TextSelection, Transaction } from '@tiptap/pm/state';
import { Editor as CoreEditor } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { debounce } from 'lodash';
import { EditorView } from '@tiptap/pm/view';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        correctionextension: {
            proofread: () => ReturnType;
            acceptCorrection: (
                correction: CorrectionInfo,
                nextCorrectionToSelect?: CorrectionInfo
            ) => ReturnType;
            rejectCorrection: (
                correction: CorrectionInfo,
                nextCorrectionToSelect?: CorrectionInfo
            ) => ReturnType;
            selectCorrection: (id: string) => ReturnType;
            acceptAllCorrections: () => ReturnType;
        };
    }
}

let decorationSet: DecorationSet;
let highlightedDecoration: Decoration | undefined;
let skipProofreading = false;

type NodeWithPos = {
    node: ProseMirrorNode;
    pos: number;
};

const proofreadEditedNodes = async (
    editor: CoreEditor,
    updateCorrections: (
        addedCorrections: CorrectionInfo[],
        removedCorrectionIds: string[],
        newDecorationSet: DecorationSet
    ) => void
) => {
    let nodesToBeCorrectedWithPos: NodeWithPos[] = [];
    let correctionsToBeRemoved: string[] = [];
    console.log('In newProofreadEditedNodes');
    editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'paragraph' && node.textContent.trim() !== '') {
            if (
                editor.storage.correctionextension.correctedParagraphs.get(
                    node.attrs.id
                )
            ) {
                console.log(
                    'Id: ',
                    node.attrs.id,
                    ' has already been corrected... checking if text is the same'
                );
                if (
                    editor.storage.correctionextension.correctedParagraphs.get(
                        node.attrs.id
                    ) === node.textContent
                ) {
                    console.log('Text is the same, returning...');
                    return;
                }
                console.log(
                    'text was not the same, adding to nodesToBeCorrected and removing decorations'
                );
            }
            console.log('Adding node to nodesToBeCorrected');
            nodesToBeCorrectedWithPos.push({ node, pos });
            // Remove decorations for this node
            const decorations = decorationSet.find(
                pos,
                pos + node.nodeSize - 1
            );
            console.log('Decorations that should be removed: ', decorations);
            decorations.forEach((decoration) => {
                console.log('Decoration spec: ', decoration.spec);
                correctionsToBeRemoved.push(decoration.spec.correction_id);
            });
            decorationSet = decorationSet.remove(decorations);
            if (decorations.length === 0) {
                console.log('No decorations found');
            }
        }
    });
    if (nodesToBeCorrectedWithPos.length === 0) {
        console.log('No nodes to be corrected, returning...');
        return;
    }

    const decorationsBeforeProofreading = decorationSet.find(
        undefined,
        undefined,
        (spec) => {
            return spec.correction_id;
        }
    );
    console.log(
        'Decoration set at start of proofreading: ',
        decorationsBeforeProofreading
    );

    // Getting the text from the nodes and sending it to the backend
    const texts = nodesToBeCorrectedWithPos.map(
        (nodeWithPos) => nodeWithPos.node.textContent
    );
    const response = await fetch('/api/correctText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            texts: texts,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            const paragraphs: string[] = data;
            // Check for differences in the text, and create the decorations for each difference
            const decorations: Decoration[] = [];
            const corrections: CorrectionInfo[] = [];
            nodesToBeCorrectedWithPos.forEach(
                (nodeWithPos: NodeWithPos, i: number) => {
                    const response_words = paragraphs[i].split(' ');
                    const original_words =
                        nodeWithPos.node.textContent.split(' ');
                    let wordStart = 0;
                    original_words.forEach((word: string, j: number) => {
                        if (word !== response_words[j]) {
                            const wordEnd =
                                wordStart + word.length + nodeWithPos.pos + 1;
                            const from = wordStart + nodeWithPos.pos + 1;
                            const to = wordEnd;
                            const decoration = Decoration.inline(
                                from,
                                to,
                                {
                                    class: `border-b-2 border-red-500 cursor-pointer correction focus:bg-blue-700 sm:scroll-my-48`,
                                    nodeName: 'span',
                                    correction: JSON.stringify({
                                        word,
                                        from,
                                        to,
                                    }),
                                    id: `${nodeWithPos.node.attrs.id}_${from}_${to}_correction`,
                                },
                                {
                                    correction_id: `${nodeWithPos.node.attrs.id}_${from}_${to}_correction`,
                                    replacement: response_words[j],
                                }
                            );
                            decorations.push(decoration);
                            const correction = {
                                id: `${nodeWithPos.node.attrs.id}_${from}_${to}_correction`,
                                correction_type: 'correction',
                                from: from,
                                to: to,
                                before_text: word,
                                after_text: response_words[j],
                                context_before:
                                    (original_words[j - 2]
                                        ? `${original_words[j - 2]} `
                                        : '') +
                                    (original_words[j - 1]
                                        ? original_words[j - 1]
                                        : '...'),
                                context_after:
                                    (original_words[j + 1]
                                        ? `${original_words[j + 1]} `
                                        : '') +
                                    (original_words[j + 2]
                                        ? original_words[j + 2]
                                        : '...'),
                                decoration: decoration,
                            } as CorrectionInfo;
                            corrections.push(correction);
                        }
                        wordStart += word.length + 1;
                    });
                }
            );
            if (editor.view) {
                decorationSet = decorationSet.add(
                    editor.view.state.doc,
                    decorations
                );
                // Updating the editor storage with the new nodes
                nodesToBeCorrectedWithPos.forEach((nodeWithPos) => {
                    editor.storage.correctionextension.correctedParagraphs.set(
                        nodeWithPos.node.attrs.id,
                        nodeWithPos.node.textContent
                    );
                });

                updateCorrections(
                    corrections,
                    correctionsToBeRemoved,
                    decorationSet
                );
                editor.view.dispatch(
                    editor.view.state.tr.setMeta('decorations', decorationSet)
                );
            }
            setTimeout(() => {});
        });
};

const debouncedProofreadEditedNodes = debounce(proofreadEditedNodes, 3000);

const acceptOrRejectCorrection = (
    shouldAccept: boolean,
    correction: CorrectionInfo,
    nextCorrectionToSelect: CorrectionInfo | undefined,
    editor: CoreEditor,
    removeCorrectionById: (id: string) => void
) => {
    const { id, after_text } = correction;
    // removeCorrectionById(id);

    skipProofreading = true;

    // Find the decoration for this correction in the decoration set
    const decorations = decorationSet.find(undefined, undefined, (spec) => {
        return spec.correction_id === id;
    });
    const decoration = decorations[0];

    if (highlightedDecoration) {
        decorationSet = decorationSet.remove([highlightedDecoration]);
    }

    // Apply the correction
    const { tr } = editor.state;
    if (shouldAccept) {
        tr.insertText(
            after_text,
            decoration.from,
            decoration.to //correct_decoration.from + before_text.length
        );
        // Get the paragraph node that contains the correction
        tr.doc.nodesBetween(decoration.from, decoration.from, (node, pos) => {
            if (node.type.name === 'paragraph') {
                if (node) {
                    if (
                        editor.storage.correctionextension.correctedParagraphs.get(
                            node.attrs.id
                        )
                    ) {
                        editor.storage.correctionextension.correctedParagraphs.set(
                            node.attrs.id,
                            node.textContent
                        );
                    }
                }
                return;
            }
        });
    }
    decorationSet = decorationSet.remove([decoration]);
    tr.setMeta('decorations', decorationSet);
    if (editor.view) {
        editor.view.dispatch(tr);
    }

    if (nextCorrectionToSelect) {
        selectCorrectionInText(nextCorrectionToSelect.id, editor.view);
    }
};

const acceptAllCorrections = (editor: CoreEditor) => {
    // Find the decorations with a correction_id
    const decorations = decorationSet.find(undefined, undefined, (spec) => {
        return spec.correction_id;
    });

    const { tr } = editor.state;

    // Iterate through decorations in reverse and apply the corrections
    for (let i = decorations.length - 1; i >= 0; i--) {
        const decoration = decorations[i];
        // Apply the correction
        tr.insertText(
            decoration.spec.replacement,
            decoration.from,
            decoration.to //correct_decoration.from + before_text.length
        );
        // Update correctedParagraphs in editor storage
        let previousNode: ProseMirrorNode | undefined;
        tr.doc.nodesBetween(decoration.from, decoration.to, (node, pos) => {
            if (node !== previousNode && node.type.name === 'paragraph') {
                if (
                    editor.storage.correctionextension.correctedParagraphs.get(
                        node.attrs.id
                    )
                ) {
                    editor.storage.correctionextension.correctedParagraphs.set(
                        node.attrs.id,
                        node.textContent
                    );
                }
            }
        });
    }

    decorationSet = DecorationSet.create(tr.doc, []);

    tr.setMeta('decorations', decorationSet);
    if (editor.view) {
        editor.view.dispatch(tr);
    }
};

const selectCorrectionInText = (id: string, editorView: EditorView) => {
    const { tr } = editorView.state;
    if (highlightedDecoration) {
        decorationSet = decorationSet.remove([highlightedDecoration]);
    }

    const decorations = decorationSet.find(undefined, undefined, (spec) => {
        return spec.correction_id === id;
    });
    if (decorations.length > 0) {
        const decoration = decorations[0];

        highlightedDecoration = Decoration.inline(
            decoration.from,
            decoration.to,
            {
                class: 'bg-red-500 bg-opacity-25',
            },
            {
                id: 'correction-highlight',
            }
        );
        decorationSet = decorationSet.add(editorView.state.doc, [
            highlightedDecoration,
        ]);
    }
    // The node containing the correction should now be scrolled into view
    const node = document.getElementById(id);
    if (node) {
        node.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }

    editorView.dispatch(tr);
};

export const CorrectionExtension = (
    updateCorrections: (
        addedCorrections: CorrectionInfo[],
        removedCorrectionIds: string[],
        newDecorationSet: DecorationSet
    ) => void,
    removeCorrectionById: (id: string) => void,
    selectCorrection: (id: string) => void
) =>
    Extension.create({
        name: 'correctionextension',

        addStorage() {
            return {
                correctedParagraphs: new Map<string, string>(),
                lastEditedParagraphId: '' as string,
                test: 100,
            };
        },

        addKeyboardShortcuts() {
            return {
                Enter: () => {
                    if (this.editor) {
                        proofreadEditedNodes(this.editor, updateCorrections);
                        debouncedProofreadEditedNodes.cancel();
                    }
                    return false;
                },
            };
        },

        addCommands() {
            return {
                proofread:
                    () =>
                    ({ editor }) => {
                        debouncedProofreadEditedNodes(
                            editor,
                            updateCorrections
                        );
                        return true;
                    },
                acceptCorrection:
                    (
                        correction: CorrectionInfo,
                        nextCorrectionToSelect: CorrectionInfo | undefined
                    ) =>
                    ({ editor }: { editor: CoreEditor }) => {
                        setTimeout(
                            () =>
                                acceptOrRejectCorrection(
                                    true,
                                    correction,
                                    nextCorrectionToSelect,
                                    editor,
                                    removeCorrectionById
                                ),
                            100
                        );

                        return true;
                    },
                rejectCorrection:
                    (
                        correction: CorrectionInfo,
                        nextCorrectionToSelect: CorrectionInfo | undefined
                    ) =>
                    ({ editor }: { editor: CoreEditor }) => {
                        setTimeout(
                            () =>
                                acceptOrRejectCorrection(
                                    false,
                                    correction,
                                    nextCorrectionToSelect,
                                    editor,
                                    removeCorrectionById
                                ),
                            100
                        );

                        return true;
                    },
                selectCorrection:
                    (id: string) =>
                    ({ editor }: { editor: CoreEditor }) => {
                        selectCorrectionInText(id, editor.view);
                        return true;
                    },
                acceptAllCorrections:
                    () =>
                    ({ editor }: { editor: CoreEditor }) => {
                        setTimeout(() => {
                            acceptAllCorrections(editor);
                        }, 100);
                        return true;
                    },
            };
        },

        onUpdate() {
            if (skipProofreading) {
                // Skip this proofreading and reset the flag
                debouncedProofreadEditedNodes.cancel();
                setTimeout(() => {
                    skipProofreading = false;
                }, 100);
            } else {
                debouncedProofreadEditedNodes(this.editor, updateCorrections);
            }
        },

        addProseMirrorPlugins() {
            const key = new PluginKey('correctionextension');

            return [
                new Plugin({
                    key,
                    state: {
                        init: (_, state) => {
                            decorationSet = DecorationSet.create(state.doc, []);
                            return decorationSet;
                        },
                        apply: (
                            tr: Transaction,
                            oldDecorationSet: DecorationSet,
                            oldState: EditorState,
                            newState: EditorState
                        ): DecorationSet => {
                            const oldDecorations = decorationSet.find(
                                undefined,
                                undefined,
                                (spec) => {
                                    return spec.correction_id;
                                }
                            );

                            decorationSet = decorationSet.map(
                                tr.mapping,
                                tr.doc
                            );
                            const newDecorations = decorationSet.find(
                                undefined,
                                undefined,
                                (spec) => {
                                    return spec.correction_id;
                                }
                            );
                            const oldDecorationIds: string[] =
                                oldDecorations.map(
                                    (oldDecoration) =>
                                        oldDecoration.spec.correction_id
                                );
                            const newDecorationIds: string[] =
                                newDecorations.map(
                                    (newDecoration) =>
                                        newDecoration.spec.correction_id
                                );
                            // For each decoration that was removed, remove the corresponding correction
                            if (
                                oldDecorationIds.length >
                                newDecorationIds.length
                            ) {
                                oldDecorationIds.forEach((oldID) => {
                                    if (!newDecorationIds.includes(oldID)) {
                                        removeCorrectionById(oldID);
                                    }
                                });
                            }
                            return decorationSet;
                        },
                    },
                    props: {
                        decorations(state) {
                            return this.getState(state);
                        },
                        handleClick(view, pos, event) {
                            const target = event.target as HTMLElement;
                            if (target.classList.contains('correction')) {
                                const decorations = decorationSet.find(
                                    pos,
                                    pos
                                );
                                if (decorations.length > 0) {
                                    selectCorrection(
                                        decorations[0].spec.correction_id
                                    );
                                    selectCorrectionInText(
                                        decorations[0].spec.correction_id,
                                        view
                                    );
                                    return true;
                                }
                            } else {
                                if (highlightedDecoration) {
                                    decorationSet = decorationSet.remove([
                                        highlightedDecoration,
                                    ]);
                                    view.dispatch(view.state.tr);
                                    return true;
                                }
                            }
                            return false;
                        },
                    },
                }),
            ];
        },
    });
