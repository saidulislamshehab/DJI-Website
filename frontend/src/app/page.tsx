import Header from "@/components/layout/Header";
import HeroBanner from "@/components/home/HeroBanner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <HeroBanner />
      </main>
    </>
  );
}
