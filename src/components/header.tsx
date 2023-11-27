import React from 'react';
import Link from 'next/link';
import YfirlesturIcon from './icons/yfirlestur-icon';

/*
 * The Header component displays the header of the page.
 *
 */
export default function Header() {
    return (
        <header className='navbar fixed top-0 z-30 h-[--header-size] bg-white shadow-md'>
            <div className='pl-4 md:pl-8'>
                <Link href='/'>
                    <YfirlesturIcon />
                </Link>
            </div>
        </header>
    );
}
