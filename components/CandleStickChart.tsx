'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { OHLC } from './CoinOverview';
import { CHART_COLORS, CHART_PERIODS, PERIOD_BUTTONS } from '@/consts';
import {
	CandlestickSeries,
	ChartOptions,
	ColorType,
	createChart,
	DeepPartial,
	IChartApi,
	ISeriesApi,
} from 'lightweight-charts';
import { coingeckoFetch } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';

type CandleStickChartProps = {
	coinId?: string;
	data: OHLC[];
	children: React.ReactNode;
	height?: number;
};

const CandleStickChart = ({
	coinId = 'bitcoin',
	data,
	height = 400,
	children,
}: CandleStickChartProps) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

	const [period, setPeriod] = useState('daily');
	const [ohlcData, setOhlcData] = useState<OHLC[]>(data ?? []);

	const [isPending, startTransition] = useTransition();

	const fetchOhlcData = async (period: string) => {
		const { value: selectedPeriod } =
			CHART_PERIODS.find((p) => p.label === period) ?? {};
		try {
			// Fetch OHLC data based on the selected period
			const response = await coingeckoFetch<OHLC[]>(`/coins/${coinId}/ohlc`, {
				vs_currency: 'usd',
				days: selectedPeriod,
				precision: 'full',
			});
			setOhlcData(response ?? []);
		} catch (error) {
			console.error('Error fetching OHLC data:', error);
		}
	};

	const handlePeriodCHange = (newPeriod: string) => {
		console.log('Period changed to:', newPeriod);
		if (newPeriod === period) return;

		// Fetch new OHLC data for the selected period. useTransition ensures UI remains responsive.
		startTransition(async () => {
			setPeriod(newPeriod);
			await fetchOhlcData(newPeriod);
		});
	};

	const getChartConfig = (
		height: number,
		timeVisible: boolean = true
	): DeepPartial<ChartOptions> => ({
		width: 0,
		height,
		layout: {
			background: { type: ColorType.Solid, color: CHART_COLORS.background },
			textColor: CHART_COLORS.text,
			fontSize: 12,
			fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
		},
		grid: {
			vertLines: { visible: false },
			horzLines: {
				visible: true,
				color: CHART_COLORS.grid,
				style: 2,
			},
		},
		rightPriceScale: {
			borderColor: CHART_COLORS.border,
		},
		timeScale: {
			borderColor: CHART_COLORS.border,
			timeVisible,
			secondsVisible: false,
		},
		handleScroll: true,
		handleScale: true,
		crosshair: {
			mode: 1,
			vertLine: {
				visible: true,
				color: CHART_COLORS.crosshairVertical,
				width: 1,
				style: 0,
			},
			horzLine: {
				visible: true,
				color: CHART_COLORS.crosshairHorizontal,
				width: 1,
				style: 0,
			},
		},
		localization: {
			priceFormatter: (price: number) =>
				'$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
		},
	});

	useEffect(() => {
		if (!chartContainerRef.current) return;
		const showTime = ['daily', 'weekly', 'monthly'].includes(period);
		chartRef.current = createChart(chartContainerRef.current, {
			...getChartConfig(height, showTime),
			width: chartContainerRef.current.clientWidth,
		});

		candlestickSeriesRef.current = chartRef.current.addSeries(
			CandlestickSeries,
			{
				upColor: CHART_COLORS.candleUp,
				downColor: CHART_COLORS.candleDown,
				wickUpColor: CHART_COLORS.candleUp,
				wickDownColor: CHART_COLORS.candleDown,
				borderVisible: true,
				wickVisible: true,
			}
		);

		candlestickSeriesRef.current.setData(convertOHLCData(ohlcData));
		chartRef.current?.timeScale().fitContent();

		const observer = new ResizeObserver((entries) => {
			if (!entries.length) return;
			chartRef.current?.applyOptions({
				width: entries[0].contentRect.width ?? 0,
			});
		});

		if (chartContainerRef.current) {
			observer.observe(chartContainerRef.current);
		}

		return () => {
			chartRef.current?.remove();
			observer.disconnect();
			chartContainerRef.current = null;
			candlestickSeriesRef.current = null;
		};
	}, [height]);

	useEffect(() => {
		if (candlestickSeriesRef.current) {
			const convertedToSeconds = ohlcData.map(
				([time, open, high, low, close]: OHLC) =>
					[Math.floor(time / 1000), open, high, low, close] as OHLC
			);
			candlestickSeriesRef.current.setData(convertOHLCData(convertedToSeconds));
		}
	}, [ohlcData, period]);

	return (
		<div id='candlestick-chart'>
			<div className='chart-header'>
				<div className='flex-1'>{children}</div>
			</div>
			<div className='button-group'>
				<span className='text-sm'>Period:</span>
				{PERIOD_BUTTONS.map(({ value, label }) => (
					<button
						key={value}
						className={` ${
							value === period ? 'config-button-active' : 'config-button'
						}`}
						onClick={() => handlePeriodCHange(value)}
						disabled={isPending}>
						{label}
					</button>
				))}
			</div>

			<div
				className='chart'
				ref={chartContainerRef}
				style={{ height: `${height}px` }}
			/>
		</div>
	);
};

export default CandleStickChart;
