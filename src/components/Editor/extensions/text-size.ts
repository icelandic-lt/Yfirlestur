import { Extension } from '@tiptap/react';

/**
 * FontSize extension to set font size of text
 */

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            /**
             * Set font size
             */
            setFontSize: (fontSize: number) => ReturnType;
            /**
             * Unset font size
             */
            unsetFontSize: () => ReturnType;
        };
    }
}

export const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) =>
                            element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: (attributes) => {
                            console.log('In renderHTML');
                            if (!attributes.fontSize) {
                                console.log(
                                    'In renderHTML, no attributes.fontSize'
                                );
                                return {};
                            }
                            console.log(
                                'In renderHTML, attributes.fontSize',
                                attributes.fontSize
                            );
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                ({ chain }) => {
                    return chain()
                        .setMark('textStyle', { fontSize: fontSize + 'px' })
                        .run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark('textStyle', { fontSize: null })
                        .removeEmptyTextStyle()
                        .run();
                },
        };
    },
});
