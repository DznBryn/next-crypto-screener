import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React from 'react';

export interface DataTableColumn<T> {
	header: React.ReactNode;
	cell: (row: T, index: number) => React.ReactNode;
	headerClassName?: string;
	cellClassName?: string;
}

export interface DataTableProps<T> {
	columns: DataTableColumn<T>[];
	data: T[];
	rowKey: (row: T, index: number) => React.Key;
	styles?: {
		table?: string;
		header?: string;
		headerRow?: string;
		headerCell?: string;
		bodyRow?: string;
		bodyCell?: string;
	};
}

const DataTable = <T,>({
	columns,
	data,
	rowKey,
	styles,
}: DataTableProps<T>) => {
	return (
		<Table className={cn('custom-scrollbar', styles?.table)}>
			{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
			<TableHeader className={styles?.header}>
				<TableRow className={styles?.headerRow}>
					{columns?.length > 0 && columns.map((column, index) => (
						<TableHead
							key={index}
							className={cn(
								styles?.headerCell,
								`bg-dark-400 text-purple-100 ${column.headerClassName}`
							)}>
							{column.header}
						</TableHead>
						//   <TableHead className={cn('w-25px', styles?.headerCell)}>Invoice</TableHead>
						// <TableHead className={styles?.headerCell}>Status</TableHead>
						// <TableHead className={styles?.headerCell}>Method</TableHead>
						// <TableHead className={cn('text-right', styles?.headerCell)}>Amount</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data?.length > 0 && data.map((row, rowIndex) => (
					<TableRow key={rowKey(row, rowIndex)} className={styles?.bodyRow}>
						{columns?.length > 0 && columns?.map((column, colIndex) => (
							<TableCell
								key={colIndex}
								className={cn(
									styles?.bodyCell,
									'overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-300/30:important relative',
									column.cellClassName
								)}>
								{column.cell(row, rowIndex)}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DataTable;
