import React from 'react';

const CoinOverviewSkeleton = () => {
	return (
		<>
			<div className='w-[100px] h-[100px] bg-gray-700 animate-pulse rounded-lg' />
			<div className='info'>
				<div className='h-4 w-32 bg-gray-700 animate-pulse rounded mb-2' />
				<div className='h-8 w-48 bg-gray-700 animate-pulse rounded' />
			</div>
		</>
	);
};

export default CoinOverviewSkeleton;
