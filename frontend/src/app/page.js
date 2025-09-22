import Header from '../components/Header'
import Hero from '../components/Hero'
import MovieListings from '../components/MovieListings'
import TheaterLocator from '../components/TheaterLocator'
import Promotions from '../components/Promotions'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <MovieListings />
        <TheaterLocator />
        <Promotions />
      </main>
      <Footer />
    </div>
  );
}
