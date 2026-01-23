import dynamic from "next/dynamic"

const Coins = dynamic(() => import("../../components/Coins"),{
  loading: () => <p>Loading...</p>,
  ssr: true
})

export default async function Page({ searchParams }: { searchParams: { page?: number } }) {
  const params = await searchParams;
  const page = params.page || 1;
console.log(`Rendering page: ${page}`);
  return <main className="main-container">
    <Coins page={page} />
  </main>
}
