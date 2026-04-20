'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Hotel, MapPin, Star, Users } from 'lucide-react'

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Hotel Booking</h1>
            <p className="text-muted-foreground">Find and book your perfect hotel stay</p>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Featured Hotels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,000+</div>
                <p className="text-xs text-muted-foreground mt-1">Quality properties worldwide</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Best Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24/7</div>
                <p className="text-xs text-muted-foreground mt-1">Customer support available</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verified Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8★</div>
                <p className="text-xs text-muted-foreground mt-1">Average guest rating</p>
              </CardContent>
            </Card>
          </section>

          {/* Browse Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Ready to Book?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Hotel className="w-6 h-6 text-primary" />
                    <CardTitle>Browse Hotels</CardTitle>
                  </div>
                  <CardDescription>Explore thousands of hotels worldwide</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/hotels">
                    <Button className="w-full bg-primary hover:bg-primary/90">Start Browsing</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    <CardTitle>My Bookings</CardTitle>
                  </div>
                  <CardDescription>View and manage your reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/bookings">
                    <Button className="w-full bg-primary hover:bg-primary/90">View Bookings</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Featured Destinations */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { city: 'New York', count: '2,500+ hotels' },
                { city: 'Paris', count: '1,800+ hotels' },
                { city: 'Tokyo', count: '1,600+ hotels' },
              ].map((destination) => (
                <Card key={destination.city} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{destination.city}</CardTitle>
                    <CardDescription>{destination.count}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Search</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
