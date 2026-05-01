import Header from './components/common/header';
import IronHero from './components/landing/IronHero';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <IronHero />
    </main>
  );
}
