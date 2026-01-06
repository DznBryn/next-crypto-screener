'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function Header() {
	const pathname = usePathname();
	return (
		<header>
			<div className='main-container inner'>
				<Link href='/'>
					<Image src='/logo.svg' alt='CoinPulse Logo' width={150} height={50} />
				</Link>
				<nav>
					<Link
						href='/'
						className={cn('nav-link', {
							'is-active': pathname === '/',
							'is-home': true,
						})}>
						Home
					</Link>
					<button
						type='button'
						className='nav-link'
						aria-label='Open search modal'>
						Search
					</button>
					<Link
						href='/coins'
						className={cn('nav-link', {
							'is-active': pathname === '/coins',
						})}>
						All coins
					</Link>
				</nav>
			</div>
		</header>
	);
}

export default Header;
