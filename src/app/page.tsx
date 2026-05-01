import Header from './components/common/header';
import IronHero from './components/landing/IronHero';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <Header />
      <IronHero />
    </main>
  );
}
