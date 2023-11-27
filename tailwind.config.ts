import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#09814A',
                secondary: '#FFD88A',
                accent: '#0788C0',
                neutral: '#F8F8F8',
                correctionDeletion: '#C5283D',
                correctionAlteration: '#0788C0',
                correctionInsertion: '#09814A',
            },
        },
    },
    plugins: [
        require('daisyui'),
        require('@tailwindcss/typography'),
        // plugin(function ({ addUtilities }) {
        //     addUtilities({
        //         /* Hide scrollbar for Chrome, Safari and Opera */
        //         '.no-scrollbar::-webkit-scrollbar': {
        //             display: 'none',
        //         },

        //         /* Hide scrollbar for IE, Edge and Firefox */
        //         '.no-scrollbar': {
        //             '-ms-overflow-style': 'none' /* IE and Edge */,
        //             'scrollbar-width': 'none' /* Firefox */,
        //         },
        //     });
        // }),
    ],
    daisyui: {
        themes: [
            {
                yfirlesturtheme: {
                    primary: '#09814A',
                    secondary: '#FFD88A',
                    accent: '#0788C0',
                    neutral: '#F8F8F8',
                    'primary-content': '#fff',
                    'neutral-content': '#000',
                    'base-100': '#fff',
                },
            },
        ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: 'light', // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
        prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    },
};
export default config;
