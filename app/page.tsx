import { CoinOverviewSkeleton } from '@/components/CoinOverview';
import { TrendingCoinsSkeleton } from '@/components/TrendingCoins';
import dynamic from 'next/dynamic';

const CoinOverview = dynamic(() => import('@/components/CoinOverview'), {
	loading: () => <CoinOverviewSkeleton />,
	ssr: true,
});

const TrendingCoins = dynamic(() => import('@/components/TrendingCoins'), {
	loading: () => <TrendingCoinsSkeleton />,
	ssr: true,
});

const Page = async () => {
	return (
		<main className='main-container'>
			<section className='home-grid'>
				<CoinOverview name='bitcoin' />
				<TrendingCoins />
			</section>
			<section className='w-full mt-7 space-y-4'>
				<p>Categories</p>
			</section>
		</main>
	);
};

export default Page;
