import TrademarkChecker from './components/TrademarkChecker';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen p-4 gap-16 font-[family-name:var(--font-geist-sans)]'>
      <TrademarkChecker />
    </div>
  );
}
