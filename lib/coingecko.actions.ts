'use server';
import qs from 'query-string';

const COINGECKO_BASE_URL = process.env.COINGECKO_BASE_URL;
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

type QueryParams = Record<string, string | number | boolean | undefined>;

if (!COINGECKO_BASE_URL) {
  throw new Error('COINGECKO_BASE_URL is not defined in environment variables');
}
if (!COINGECKO_API_KEY) {
  throw new Error('COINGECKO_API_KEY is not defined in environment variables');
}

export async function coingeckoFetch<T>(endpoint: string, params?: QueryParams, revalidate?: number): Promise<T> {
  const url = qs.stringifyUrl({
    url: `${COINGECKO_BASE_URL}/${endpoint}`,
    query: params,
  }, { skipNull: true, skipEmptyString: true });

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-cg-demo-api-key': COINGECKO_API_KEY,
      // 'X-CG-Pro-API-Key': COINGECKO_API_KEY,
    } as Record<string, string>,
    next: revalidate ? { revalidate } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from CoinGecko: ${response.statusText}`);
  }
  return response.json();
};
