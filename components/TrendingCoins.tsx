import DataTable, { DataTableColumn } from './DataTable';
import { coingeckoFetch } from '@/lib/coingecko.actions';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatCryptoPrice } from '@/lib/utils';

interface TrendingCoin {
	item: {
		id: string;
		coin_id: number;
		name: string;
		symbol: string;
		market_cap_rank: number;
		thumb: string;
		small: string;
		large: string;
		slug: string;
		price_btc: number;
		score: number;
		data: {
			price: number;
			price_btc: string;
			price_change_percentage_24h: {
				[currency: string]: number;
			};
			market_cap: string;
			market_cap_btc: string;
			total_volume: string;
			total_volume_btc: string;
			sparkline: string;
			content: unknown;
		};
	};
}

const columns: DataTableColumn<TrendingCoin>[] = [
	{
		header: 'Name',
		cellClassName: 'name-cell',
		cell: (coin) => {
			const item = coin.item;

			return (
				<Link href={`/coins/${item.id}`} className='flex items-center gap-2'>
					<Image src={item.small} alt={item.name} width={24} height={24} />
					<span>{item.name}</span>
				</Link>
			);
		},
	},
	{
		header: '24h Change',
		cellClassName: 'change-cell',
		cell: (coin) => {
			const item = coin.item;
			const priceChange = item.data.price_change_percentage_24h?.usd ?? 0;
			const isTrending = priceChange >= 0;

			return (
				<span
					className={`flex items-center gap-1 ${
						isTrending ? 'text-green-500' : 'text-red-500'
					}`}>
					{isTrending ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
					{priceChange >= 0 ? '+' : ''}
					{priceChange.toFixed(2)}%
				</span>
			);
		},
	},
	{
		header: 'Price',
		cellClassName: 'price-cell',
		cell: (coin) => formatCryptoPrice(coin.item.data.price),
	},
];

const TrendingCoins = async () => {
	let trendingCoinsData: { coins: TrendingCoin[] };
	try {
		trendingCoinsData = await coingeckoFetch<{ coins: TrendingCoin[] }>(
			'/search/trending'
		);
	} catch (error) {
		console.error('Error fetching trending coins:', error);
		return <TrendingCoinsSkeleton />;
	}
	return (
		<>
			<p className='text-xl font-semibold mb-4'>Trending Coins</p>
			<DataTable
				columns={columns}
				data={trendingCoinsData.coins.slice(0, 5)}
				rowKey={(coin) => coin.item.id}
			/>
		</>
	);
};

export const TrendingCoinsSkeleton = () => {
	return (
		<>
			<div className='h-7 w-48 bg-gray-700 animate-pulse rounded mb-4' />
			<div className='space-y-3'>
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg'>
						<div className='w-6 h-6 bg-gray-700 animate-pulse rounded-full' />
						<div className='flex-1 h-4 bg-gray-700 animate-pulse rounded' />
						<div className='w-20 h-4 bg-gray-700 animate-pulse rounded' />
						<div className='w-24 h-4 bg-gray-700 animate-pulse rounded' />
					</div>
				))}
			</div>
		</>
	);
};

export default TrendingCoins;
