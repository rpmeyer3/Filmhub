'use client'

import Image from 'next/image'

export default function Promotions() {
  const promotions = [
    {
      id: 1,
      title: "MovieRewards A-List",
      subtitle: "See up to 3 movies every week for one low price",
      description: "Watch any movie in any format including IMAX, Dolby Cinema, and more. Plus get exclusive member benefits and no online fees.",
      price: "$19.95/month",
      features: ["Up to 3 movies per week", "All formats included", "No online fees", "Exclusive screenings", "Priority lanes"],
      buttonText: "Join Now",
      image: "/api/placeholder/600/400", // Will be replaced with actual promotional images
      gradient: "from-purple-600 to-blue-600"
    },
    {
      id: 2, 
      title: "IMAX Experience",
      subtitle: "The world's most immersive movie experience", 
      description: "Experience movies the way filmmakers intended with crystal clear images, wraparound sound and premium seating.",
      features: ["70ft screens", "12-channel sound", "Reserved seating", "Stadium seating"],
      buttonText: "Find IMAX Movies",
      image: "/api/placeholder/600/400",
      gradient: "from-gray-800 to-gray-600"
    },
    {
      id: 3,
      title: "Dolby Cinema",
      subtitle: "Cinema technology that hits different",
      description: "Spectacular imaging with Dolby Vision and moving audio with Dolby Atmos creates a completely captivating cinematic experience.",
      features: ["Dolby Vision projection", "Dolby Atmos sound", "Luxury recliners", "Reserved seating"],
      buttonText: "Experience Dolby",
      image: "/api/placeholder/600/400", 
      gradient: "from-red-600 to-pink-600"
    }
  ]

  const offers = [
    {
      id: 1,
      title: "Student Discount",
      description: "Show your student ID and save on tickets",
      discount: "25% OFF",
      validity: "Valid Monday-Thursday",
      icon: "🎓"
    },
    {
      id: 2, 
      title: "Matinee Special",
      description: "Early bird catches the savings",
      discount: "$6.99",
      validity: "Shows before 4 PM",
      icon: "🌅"
    },
    {
      id: 3,
      title: "Family Pack",
      description: "4 tickets + 2 large popcorns + 4 drinks",
      discount: "$39.99",
      validity: "Weekends only",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      id: 4,
      title: "Senior Discount",
      description: "Ages 60+ save every day",
      discount: "20% OFF",
      validity: "All showtimes",
      icon: "👴"
    }
  ]

  const PromotionCard = ({ promotion }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className={`relative h-48 bg-gradient-to-r ${promotion.gradient}`}>
        <Image
          src={promotion.image}
          alt={promotion.title}
          fill
          className="object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-6 text-white">
          <h3 className="text-2xl font-bold mb-1">{promotion.title}</h3>
          <p className="text-sm opacity-90">{promotion.subtitle}</p>
        </div>
        {promotion.price && (
          <div className="absolute top-4 right-4 bg-white text-black px-3 py-2 rounded-lg font-bold">
            {promotion.price}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-4">{promotion.description}</p>
        
        <ul className="space-y-2 mb-6">
          {promotion.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors">
          {promotion.buttonText}
        </button>
      </div>
    </div>
  )

  const OfferCard = ({ offer }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center border border-gray-200">
      <div className="text-4xl mb-3">{offer.icon}</div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{offer.title}</h4>
      <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
      <div className="text-2xl font-bold text-red-600 mb-2">{offer.discount}</div>
      <div className="text-xs text-gray-500 mb-4">{offer.validity}</div>
      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
        Learn More
      </button>
    </div>
  )

  return (
    <section id="rewards" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Promotions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Experiences</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elevate your movie experience with our premium formats and membership programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {promotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-xl text-gray-600">
              Save more on your movie experience with our current deals and discounts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Food & Concessions Promo */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">🍿 Concession Combos</h3>
              <p className="text-xl mb-6 opacity-90">
                Perfect pairings for the perfect movie night. Save when you bundle your favorite snacks and drinks.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Large Popcorn + Large Drink - $12.99
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  2 Small Popcorns + 2 Drinks - $18.99
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Large Popcorn + 2 Drinks + Candy - $19.99
                </li>
              </ul>
              <button className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                Order Concessions
              </button>
            </div>
            <div className="relative h-64 md:h-full">
              <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-6xl">
                🍿
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-black text-white rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Stay in the Loop</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive offers, early access to tickets, and be the first to know about new movies and events.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}