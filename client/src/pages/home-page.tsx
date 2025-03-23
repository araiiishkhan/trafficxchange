import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-primary font-bold text-2xl">TrafficXchange</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/auth">
                <Button variant="outline" className="mr-4">Log in</Button>
              </Link>
              <Link href="/auth">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="lg:self-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Boost Your Website Traffic
              </h1>
              <p className="mt-4 text-xl">
                Exchange traffic with other users, earn points, and drive more visitors to your website.
              </p>
              <div className="mt-8">
                <Link href="/auth">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:self-center">
              <div className="relative h-64 sm:h-72 lg:h-96 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm p-6 border border-white/20 shadow-xl">
                <div className="h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm font-medium">TrafficXchange App</div>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-md p-4">
                    <div className="h-full flex flex-col">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/20 rounded p-2 text-center">
                          <div className="text-xs opacity-70">Hits</div>
                          <div className="text-lg font-bold">247</div>
                        </div>
                        <div className="bg-white/20 rounded p-2 text-center">
                          <div className="text-xs opacity-70">Points</div>
                          <div className="text-lg font-bold">583</div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white/10 rounded-md p-2">
                        <div className="text-xs mb-2">Active Sessions</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-white/20 p-1 rounded text-xs">
                            <span>Session 1</span>
                            <span className="px-1 bg-green-500/20 rounded">Active</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/20 p-1 rounded text-xs">
                            <span>Session 2</span>
                            <span className="px-1 bg-green-500/20 rounded">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              TrafficXchange helps you increase your website traffic through our exchange system.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-md bg-blue-500 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Sign Up</h3>
                <p className="mt-2 text-gray-500">
                  Create an account and add your website URL to our system.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-md bg-blue-500 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Exchange Traffic</h3>
                <p className="mt-2 text-gray-500">
                  Use our desktop app to view other websites and earn points.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 rounded-md bg-blue-500 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Get Traffic</h3>
                <p className="mt-2 text-gray-500">
                  Your earned points are used to drive traffic to your website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ready to boost your website traffic?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join thousands of users already using our traffic exchange network.
            </p>
            <div className="mt-8">
              <Link href="/auth">
                <Button size="lg">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center -mx-5 -my-2">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-300 hover:text-white">About</a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-300 hover:text-white">Features</a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-300 hover:text-white">FAQ</a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-300 hover:text-white">Contact</a>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2023 TrafficXchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
