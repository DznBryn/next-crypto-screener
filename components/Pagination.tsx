'use client';
import {
	Pagination as UIPagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { buildPageNumbers } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const Pagination = ({
	currentPage,
	totalPages,
	hasMorePages,
}: {
	currentPage: number;
	totalPages: number;
	hasMorePages: boolean;
}) => {
	const router = useRouter();
	const handlePageChange = (page: number) => {
    console.log(`Changing to page: ${page}`);
		router.push(`?page=${page}`);
	};

	console.log(`Rendering Pagination: currentPage=${currentPage}, totalPages=${totalPages}, hasMorePages=${hasMorePages}`);
	const pageNumbers = buildPageNumbers(currentPage, totalPages);

	const isLastPage = !hasMorePages || currentPage === totalPages;
  console.log(`Is last page: ${isLastPage} ${ currentPage} ${totalPages}`);
	return (
		<UIPagination id={'coins-pagination'}>
			<PaginationContent className='pagination-content'>
				<PaginationItem className='pagination-control prev'>
					<PaginationPrevious
						onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
						className={
							currentPage === 1 ? 'control-disabled' : 'control-button'
						}
					/>
				</PaginationItem>
				<div className='pagination-pages'>
					{pageNumbers.map((pageNumber, index) => (
						<PaginationItem
							key={index}
							className={`pagination-page`}>
							{pageNumber === 'ellipsis' ? (
								<PaginationEllipsis />
								// <span className="ellipsis">...</span>
							) : (
								<PaginationLink className={`page-link ${currentPage === pageNumber ? 'page-link-active' : ''}`} onClick={() => handlePageChange(pageNumber)}>
									{pageNumber}
								</PaginationLink>
							)}
						</PaginationItem>
					))}
				</div>
				<PaginationItem className='pagination-control next'>
					<PaginationNext
						onClick={() => !isLastPage && handlePageChange(Number(currentPage) + 1)}
						className={isLastPage ? 'control-disabled' : 'control-button'}
					/>
				</PaginationItem>
			</PaginationContent>
		</UIPagination>
	);
};

export default Pagination;
