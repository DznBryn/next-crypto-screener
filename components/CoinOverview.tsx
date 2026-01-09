import { coingeckoFetch } from '@/lib/coingecko.actions';
import { formatCryptoPrice } from '@/lib/utils';
import Image from 'next/image';
import CandleStickChart from './CandleStickChart';

export type OHLC = [
	number, // timestamp in milliseconds
	number, // open price
	number, // high price
	number, // low price
	number // close price
];

const CoinOverview = async ({ name }: { name: string }) => {
	const [data, coinOHLCdata] = await Promise.all([
		coingeckoFetch<CoinDetailsData>(`/coins/${name}`, {
			dex_pair_format: 'symbol',
		}),
		coingeckoFetch<OHLC[]>(`coins/${name}/ohlc`, {
			vs_currency: 'usd',
			days: 1,
			precision: 'full',
		}),
	]).catch((error) => {
		console.error('Error fetching coin overview:', error);
		return [null, null];
	});

	if (!data || !coinOHLCdata) {
		return <CoinOverviewSkeleton />;
	}

	return (
		<div id='coin-overview'>
			<CandleStickChart data={coinOHLCdata}>
				<div className='header'>
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
							{data.name ?? 'Crypto Coin'} /{' '}
							{(data.symbol ?? '').toUpperCase() || '—'}
						</p>
						{typeof data.market_data?.current_price?.usd === 'number' ? (
							<h1>{formatCryptoPrice(data.market_data.current_price.usd)}</h1>
						) : null}
					</div>
				</div>
			</CandleStickChart>
		</div>
	);
};

export const CoinOverviewSkeleton = () => {
	return (
		<div id='coin-overview'>
			<div className='w-25 h-25 bg-gray-700 animate-pulse rounded-lg mb-2' />
			<div className='info'>
				<div className='h-4 w-32 bg-gray-700 animate-pulse rounded mb-2' />
				<div className='h-8 w-48 bg-gray-700 animate-pulse rounded' />
			</div>
		</div>
	);
};

export default CoinOverview;
