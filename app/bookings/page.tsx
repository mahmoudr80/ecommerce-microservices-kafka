'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Users, MapPin } from 'lucide-react'

interface Booking {
  id: string
  check_in_date: string
  check_out_date: string
  number_of_guests: number
  total_price: number
  status: string
  hotel_id: string
}

export default function BookingsPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/bookings/user/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setPageLoading(false)
      }
    }

    if (!loading && isAuthenticated && user?.id) {
      fetchBookings()
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
          <section className="space-y-2">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">View and manage all your hotel reservations</p>
          </section>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle>Booking #{booking.id.slice(0, 8)}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            booking.status === 'confirmed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : booking.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${booking.total_price}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="text-muted-foreground">Check-in</p>
                          <p className="font-semibold">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="text-muted-foreground">Check-out</p>
                          <p className="font-semibold">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="text-muted-foreground">Guests</p>
                          <p className="font-semibold">{booking.number_of_guests} {booking.number_of_guests === 1 ? 'guest' : 'guests'}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <p className="text-muted-foreground">You don&apos;t have any bookings yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start by exploring available hotels</p>
                <Link href="/hotels">
                  <Button className="bg-primary hover:bg-primary/90">Browse Hotels</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
