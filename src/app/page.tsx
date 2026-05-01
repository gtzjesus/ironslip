import Header from './components/common/header';
import IronHero from './components/landing/IronHero';

export default function Home() {
  return (
    <main className="min-h-screen w-screen bg-black">
      <Header />
      <IronHero />
    </main>
  );
}
