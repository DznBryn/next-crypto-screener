import { formatCryptoPrice } from '@/lib/utils';
import DataTable, { DataTableColumn } from './DataTable';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { coingeckoFetch } from '@/lib/coingecko.actions';

const columns: DataTableColumn<CoinCategory>[] = [
	{
		header: 'Category',
		cellClassName: 'name-cell',
		cell: (category) => {
			const item = category;

			return <span>{item.name}</span>;
		},
	},
	{
		header: 'Top 3 Coins',
		cellClassName: 'name-cell',
		cell: (category) => {
			const item = category;

			return (
				<div className='flex gap-1'>
					{item.top_3_coins.map((item_image, index) => (
						<Image
							key={item.top_3_coins_id[index]}
							src={item_image}
							alt={item.top_3_coins_id[index]}
							width={24}
							height={24}
						/>
					))}
				</div>
			);
		},
	},
	{
		header: '24h Change',
		cellClassName: 'change-cell',
		cell: (category) => {
			const item = category;
			const priceChange = item.market_cap_change_24h ?? 0;
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
		header: 'Market Cap',
		cellClassName: 'price-cell',
		cell: (category) => formatCryptoPrice(category.market_cap),
	},
	{
		header: 'Volume 24h',
		cellClassName: 'price-cell',
		cell: (category) => formatCryptoPrice(category.volume_24h),
	},
];

const Categories = async () => {
	let categoriesData: CoinCategory[];
	try {
		categoriesData = await coingeckoFetch<CoinCategory[]>('coins/categories');
	} catch (error) {
		console.error('Error fetching trending coins:', error);
		return <CategorySkeleton />;
	}
	return (
		<div id='categories' className='p-4'>
			<h4 className='text-xl font-semibold mb-4'>Top Categories</h4>
			<DataTable
				columns={columns}
				data={categoriesData.slice(0, 10)}
				rowKey={(category) => category.id}
			/>
		</div>
	);
};

export const CategorySkeleton = () => {
	return (
		<div>
			<div className='h-7 w-48 bg-gray-700 animate-pulse rounded mb-4' />
			<div className='space-y-3'>
				{[...Array(10)].map((_, i) => (
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
		</div>
	);
};

export default Categories;
