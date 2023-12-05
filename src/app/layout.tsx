import type { Metadata } from 'next';
import { Inter, Lato } from 'next/font/google';
import './globals.css';
import { CorrectionProvider } from '@/components/Corrections/CorrectionContext';

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
            <body className={`${lato.className} h-screen bg-white`}>
                <CorrectionProvider>{children}</CorrectionProvider>
            </body>
        </html>
    );
}
