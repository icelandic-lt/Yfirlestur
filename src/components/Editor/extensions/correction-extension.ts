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
    console.log('Nodes to be corrected: ', nodesToBeCorrectedWithPos);

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
    console.log('Texts to be corrected: ', texts);
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
            console.log('Response data: ', data);
            const paragraphs: string[] = data;
            console.log('Paragraphs: ', paragraphs);
            // Check for differences in the text, and create the decorations for each difference
            const decorations: Decoration[] = [];
            const corrections: CorrectionInfo[] = [];
            nodesToBeCorrectedWithPos.forEach(
                (nodeWithPos: NodeWithPos, i: number) => {
                    console.log('Node: ', nodeWithPos, ' i: ', i);
                    const response_words = paragraphs[i].split(' ');
                    const original_words =
                        nodeWithPos.node.textContent.split(' ');
                    let wordStart = 0;
                    console.log(
                        'Original words: ',
                        original_words,
                        ' Response words: ',
                        response_words
                    );
                    original_words.forEach((word: string, j: number) => {
                        console.log(
                            'Word: ',
                            word,
                            ' j: ',
                            j,
                            ' Original: ',
                            response_words[j]
                        );
                        if (word !== response_words[j]) {
                            console.log('Word is different');
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
            console.log('Decorations: ', decorationSet);
            if (editor.view) {
                decorationSet = decorationSet.add(
                    editor.view.state.doc,
                    decorations
                );
                console.log('Updating storage');
                // Updating the editor storage with the new nodes
                nodesToBeCorrectedWithPos.forEach((nodeWithPos) => {
                    editor.storage.correctionextension.correctedParagraphs.set(
                        nodeWithPos.node.attrs.id,
                        nodeWithPos.node.textContent
                    );
                });
                console.log('Storage updated');

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
    removeCorrectionById(id);

    skipProofreading = true;

    // Find the decoration for this correction in the decoration set
    const decorations = decorationSet.find(undefined, undefined, (spec) => {
        return spec.correction_id === id;
    });
    const decoration = decorations[0];

    console.log(
        'Highlighted decoration before accepting/rejecting: ',
        highlightedDecoration
    );

    if (highlightedDecoration) {
        console.log('!!!Removing highlight decoration...');
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
        tr.doc.nodesBetween(decoration.from, decoration.to, (node, pos) => {
            if (node.type.name === 'paragraph') {
                if (node) {
                    console.log("Updating correctedParagraphs' node: ", node);
                    if (
                        editor.storage.correctionextension.correctedParagraphs.get(
                            node.attrs.id
                        )
                    ) {
                        console.log(
                            "ID WAS IN CORRECTEDPARAGRAPHS' NODES, UPDATING IT"
                        );
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
        console.log('Selecting next correction');
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
                console.log("Updating correctedParagraphs' node: ", node);
                if (
                    editor.storage.correctionextension.correctedParagraphs.get(
                        node.attrs.id
                    )
                ) {
                    console.log(
                        "ID WAS IN CORRECTEDPARAGRAPHS' NODES, UPDATING IT"
                    );
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
    console.log('IN SELECTCORRECTION COMMAND');
    if (highlightedDecoration) {
        console.log('!!!Removing highlight decoration...');
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
        console.log('Node that is being scrolled into view: ', node);
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
                    console.log('enter pressed');
                    if (this.editor) {
                        console.log('enter pressed, editor present...');
                        proofreadEditedNodes(this.editor, updateCorrections);
                        console.log(
                            'CANCELING DEBOUNCE DUE TO ENTER BEING PRESSED'
                        );
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
                        console.log("In proofread command's callback");
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
                        console.log("STARTING ACCEPT CORRECTION'S CALLBACK");
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
                        console.log("STARTING REJECT CORRECTION'S CALLBACK");
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
                        console.log('In acceptAllCorrections command');
                        setTimeout(() => {
                            acceptAllCorrections(editor);
                        }, 100);
                        return true;
                    },
            };
        },

        onUpdate() {
            console.log('Skip proofreading: ', skipProofreading);
            if (skipProofreading) {
                console.log('SKIPPING proofreading ON UPDATE...');
                // Skip this proofreading and reset the flag
                debouncedProofreadEditedNodes.cancel();
                setTimeout(() => {
                    skipProofreading = false;
                    console.log('!!skipProofreading set to false');
                }, 100);
            } else {
                console.log("PROOFREADING proofreadEditedNodes's callback");
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
                            console.log('!!!In handleClick');
                            if (target.classList.contains('correction')) {
                                console.log('Clicked on target: ', target);
                                const correctionInfo = JSON.parse(
                                    target.getAttribute('correction') as string
                                );
                                console.log(
                                    'Correction info of clicked word: ',
                                    correctionInfo
                                );
                                const decorations = decorationSet.find(
                                    pos,
                                    pos
                                );
                                if (decorations.length > 0) {
                                    const { from, to } = decorations[0];
                                    console.log(
                                        'Decoration of clicked word: ',
                                        decorations[0]
                                    );
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
                                    console.log(
                                        '!!!Removing highlight decoration...'
                                    );
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
