import { OHLC } from "@/components/CoinOverview";
import { clsx, type ClassValue } from "clsx";
import { Time } from "lightweight-charts";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Format cryptocurrency with appropriate decimal places
 * @param value - The number to format
 * @param maxDecimals - Maximum decimal places (default: 8)
 * @returns Formatted string with dollar sign
 */
export function formatCryptoPrice(
  value: number,
  maxDecimals: number = 8
): string {
  if (value >= 1) {
    return formatCurrency(value, "USD", "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // For values less than 1, show more decimal places
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/**
 * Format large numbers with abbreviations (K, M, B, T)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with abbreviation
 */
export function formatCompactNumber(
  value: number,
  decimals: number = 2
): string {
  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return `$${(value / 1e12).toFixed(decimals)}T`;
  } else if (absValue >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  }

  return formatCurrency(value);
}

export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.0%';
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}

export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime(); // difference in ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''}`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''}`;

  // Format date as YYYY-MM-DD
  return past.toISOString().split('T')[0];
}

export function convertOHLCData(data: OHLC[]) {
  return data
    .map((d) => ({
      time: d[0] as Time, // ensure seconds, not ms
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }))
    .filter((item, index, arr) => index === 0 || item.time !== arr[index - 1].time);
}

export const ELLIPSIS = 'ellipsis' as const;
export const buildPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | typeof ELLIPSIS)[] => {
  const MAX_VISIBLE_PAGES = 5;
  const pages: (number | typeof ELLIPSIS)[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    Array.from({ length: totalPages }, (_, i) => i + 1).forEach((page) => pages.push(page));
    return pages;
  }

  pages.push(1);
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, Number(currentPage) + 1);

  if (start > 2) {
    pages.push(ELLIPSIS);
  }

  for (let index = start; index <= end; index+=1) {
    pages.push(index);
  }
  if (end < totalPages - 1) {
    pages.push(ELLIPSIS);
  }

  pages.push(totalPages);

  return pages;
};
