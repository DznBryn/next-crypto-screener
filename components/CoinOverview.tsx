import { coingeckoFetch } from '@/lib/coingecko.actions';
import { formatCryptoPrice } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const CoinOverview = async ({ name }: { name: string }) => {
	let data: CoinDetailsData;
	try {
		data = await coingeckoFetch<CoinDetailsData>(`/coins/${name}`, {
			dex_pair_format: 'symbol',
		});
	} catch (error) {
		console.error('Error fetching coin overview:', error);
		return <CoinOverviewSkeleton />;
	}
	return (
		<>
			<Image
				src={
					data.image.large ??
					'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
				}
				alt={data.name ?? 'Crypto Coin'}
				width={100}
				height={100}
			/>
			<div className='info'>
				<p>
					{data.name}/{data.symbol.toUpperCase()}
				</p>
				<h1>{formatCryptoPrice(data.market_data.current_price.usd)}</h1>
			</div>
		</>
	);
};

export const CoinOverviewSkeleton = () => {
	return (
		<>
			<div className='w-25 h-25 bg-gray-700 animate-pulse rounded-lg' />
			<div className='info'>
				<div className='h-4 w-32 bg-gray-700 animate-pulse rounded mb-2' />
				<div className='h-8 w-48 bg-gray-700 animate-pulse rounded' />
			</div>
		</>
	);
};

export default CoinOverview;
