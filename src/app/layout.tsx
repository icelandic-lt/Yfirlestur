import type { Metadata } from 'next';
import { Inter, Lato } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const lato = Lato({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Yfirlestur',
    description: 'Yfirlestur les yfir og leiðréttir íslenskan texta.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='is'>
            <body className={`${inter.className} h-screen bg-white`}>
                {children}
            </body>
        </html>
    );
}
