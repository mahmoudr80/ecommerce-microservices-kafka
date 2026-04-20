'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Hotel, Users, Calendar } from 'lucide-react'

interface Hotel {
  id: string
  name: string
  city: string
  country: string
  total_rooms: number
  rating: number
}

export default function AdminPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchHotels = async () => {
      if (!user?.id) return

      try {
        // This would fetch hotels owned by the user
        // For now, we'll show a placeholder
        setPageLoading(false)
      } catch (error) {
        console.error('Error fetching hotels:', error)
        setPageLoading(false)
      }
    }

    if (!loading && isAuthenticated && user?.id) {
      fetchHotels()
    }
  }, [isAuthenticated, loading, user?.id])

  if (pageLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <>
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <section className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Hotel Management</h1>
              <p className="text-muted-foreground">Manage your hotel properties and bookings</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Add New Hotel
            </Button>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Hotel className="w-4 h-4" />
                  My Hotels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{hotels.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Active properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Average rating</p>
              </CardContent>
            </Card>
          </section>

          {/* Hotels List */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Your Hotels</h2>
            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotels.map((hotel) => (
                  <Link key={hotel.id} href={`/admin/hotels/${hotel.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle>{hotel.name}</CardTitle>
                        <CardDescription>{hotel.city}, {hotel.country}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rooms:</span>
                          <span className="font-semibold">{hotel.total_rooms}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="font-semibold">{hotel.rating.toFixed(1)}★</span>
                        </div>
                        <Button className="w-full" variant="outline">Manage Hotel</Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Hotel className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No hotels yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Add your first hotel property to get started</p>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Hotel
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
