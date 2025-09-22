export default function Footer() {
  const footerLinks = {
    'Movies': [
      'Now Playing',
      'Coming Soon', 
      'IMAX Movies',
      'Dolby Cinema',
      'Premium Experiences',
      'Movie Merchandise'
    ],
    'Theatres': [
      'Find a Theatre',
      'Theatre Amenities',
      'Accessibility',
      'Group Sales',
      'Private Events',
      'Birthday Parties'
    ],
    'Food & Drinks': [
      'Concessions',
      'Dine-In Theatres',
      'Mobile Ordering',
      'Special Offers',
      'Nutritional Info',
      'Gift Cards'
    ],
    'More': [
      'MovieRewards',
      'Mobile App',
      'Corporate',
      'Careers',
      'Investor Relations',
      'Press Center'
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' },
    { name: 'TikTok', icon: '🎵', url: '#' }
  ]

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="bg-red-600">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-red-100">Get the latest movie news and exclusive offers</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto md:min-w-96">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold text-red-500 mb-4">
              🎬 MovieTheater
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              Your premier destination for the latest movies, premium experiences, and unforgettable entertainment.
            </p>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="text-2xl hover:text-red-400 transition-colors"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-lg mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-lg mb-4">Download Our App</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#" className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                <span>📱</span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                <span>🤖</span>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-2">Customer Service</h4>
              <p className="text-gray-300 text-sm">1-888-MOVIE-GO</p>
              <p className="text-gray-300 text-sm">support@movietheater.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <p className="text-gray-300 text-sm">Mon-Thu: 10AM - 11PM</p>
              <p className="text-gray-300 text-sm">Fri-Sun: 10AM - 12AM</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Corporate Office</h4>
              <p className="text-gray-300 text-sm">123 Cinema Boulevard</p>
              <p className="text-gray-300 text-sm">Atlanta, GA 30309</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 MovieTheater Entertainment. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">California Privacy Rights</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}