import { coingeckoFetch } from '@/lib/coingecko.actions';
import DataTable, { DataTableColumn } from './DataTable';
import { formatCryptoPrice } from '@/lib/utils';
import Image from 'next/image';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Pagination from './Pagination';

const columns: DataTableColumn<Coin>[] = [
	{
		header: 'Rank',
		cellClassName: 'rank-cell',
		cell: (coin) => {
			return (
				<>
					<span>#{coin.market_cap_rank}</span>
					<Link
						href={`/coins/${coin.id}`}
						aria-label={`View details for ${coin.name}`}
					/>
				</>
			);
		},
	},
	{
		header: 'Token',
		cellClassName: 'token-cell',
		cell: (coin) => {
			const item = coin;

			return (
				<div className='token-info cursor-pointer flex gap-2 items-center'>
          {/* {console.log(item.image)} */}
					{item.image && (
						<Image
							key={item.id}
							src={item.image}
							alt={item.name}
							width={24}
							height={24}
						/>
					)}
					<p>
						{item.name} ({item.symbol.toUpperCase()})
					</p>
				</div>
			);
		},
	},
	{
		header: 'Price',
		cellClassName: 'price-cell',
		cell: (coin) => formatCryptoPrice(coin.current_price),
	},
	{
		header: '24h Change',
		cellClassName: 'change-cell',
		cell: (category) => {
			const item = category;
			const priceChange = item.price_change_percentage_24h ?? 0;
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
];

const Coins = async ({ page }: { page?: number }) => {
	console.log(page);
	let coinsData: Coin[];

	const currentPage = page || 1;
	const pageSize = 20;

	try {
		coinsData = await coingeckoFetch<Coin[]>('coins/markets', {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: pageSize,
			page: currentPage,
			sparkline: false,
		});

		// console.log(coinsData);
	} catch (error) {
		console.error('Error fetching coins data:', error);
		return;
	}

	const hasMorePages = coinsData.length === pageSize;
	const estimatedTotalPages =
		currentPage > 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

	return (
		<div id='all-coins'>
			<h4 className='text-xl font-semibold mb-4'>All Coins</h4>
			<DataTable
				columns={columns}
				data={coinsData}
				rowKey={(coin) => coin.id}
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={estimatedTotalPages}
				hasMorePages={hasMorePages}
			/>
		</div>
	);
};

export default Coins;
