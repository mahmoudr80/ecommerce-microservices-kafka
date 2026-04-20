'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star, MapPin, Phone, Mail, Globe, ArrowLeft } from 'lucide-react'

interface Hotel {
  id: string
  name: string
  description: string
  city: string
  country: string
  address: string
  phone: string
  email: string
  website: string
  rating: number
  total_reviews: number
}

interface Room {
  id: string
  room_type: string
  price_per_night: number
  max_guests: number
  amenities: string[]
}

export default function HotelDetailsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const hotelId = params.id as string

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}`)
        if (response.ok) {
          const data = await response.json()
          setHotel(data)
        }
      } catch (error) {
        console.error('Error fetching hotel:', error)
      } finally {
        setPageLoading(false)
      }
    }

    if (hotelId && isAuthenticated) {
      fetchHotel()
    }
  }, [hotelId, isAuthenticated])

  if (pageLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!hotel) {
    return (
      <>
        <DashboardNav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Hotel not found</p>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hotels
        </Button>

        <div className="space-y-8">
          {/* Hotel Header */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">{hotel.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hotel.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-sm text-muted-foreground">({hotel.total_reviews} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-lg">{hotel.description}</p>
          </section>

          {/* Contact Information */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotel.phone && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{hotel.phone}</p>
                </CardContent>
              </Card>
            )}
            {hotel.email && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold break-all">{hotel.email}</p>
                </CardContent>
              </Card>
            )}
            {hotel.website && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Website
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                    Visit
                  </a>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Available Rooms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Available Rooms</h2>
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Room availability feature coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later to book a room</p>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-8">
            <Link href="/hotels">
              <Button className="bg-primary hover:bg-primary/90" size="lg">
                View More Hotels
              </Button>
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}
