'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, MapPin, Users, DollarSign, Shield } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Hotel Booking
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
                <Button className="bg-primary hover:bg-primary/90">My Account</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
          Find Your Perfect Hotel <span className="text-primary">Anywhere</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Search, compare, and book the best hotels worldwide with our microservices-powered booking platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
            <Link href={isAuthenticated ? '/hotels' : '/register'} className="flex items-center gap-2">
              Explore Hotels
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          {!isAuthenticated && (
            <Button size="lg" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: MapPin,
              title: '5,000+ Hotels',
              description: 'Hotels in over 200 destinations worldwide',
            },
            {
              icon: DollarSign,
              title: 'Best Prices',
              description: 'Price match guarantee on all bookings',
            },
            {
              icon: Users,
              title: '24/7 Support',
              description: 'Round-the-clock customer service team',
            },
            {
              icon: Shield,
              title: 'Secure Booking',
              description: 'Encrypted payments and instant confirmation',
            },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="space-y-3 text-center">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-card rounded-2xl border border-border">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: '1',
              title: 'Search',
              description: 'Enter your destination and dates to find available hotels',
            },
            {
              number: '2',
              title: 'Compare',
              description: 'Browse prices, amenities, and guest reviews',
            },
            {
              number: '3',
              title: 'Book',
              description: 'Complete your booking with secure payment',
            },
          ].map((step) => (
            <div key={step.number} className="space-y-3">
              <div className="text-4xl font-bold text-primary">{step.number}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Book Your Next Hotel?</h2>
        <p className="text-muted-foreground">Join thousands of happy travelers using our platform</p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          <Link href={isAuthenticated ? '/hotels' : '/register'} className="flex items-center gap-2">
            {isAuthenticated ? 'Browse Hotels' : 'Create Free Account'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 Hotel Booking Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
