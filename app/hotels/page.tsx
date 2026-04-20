'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Star, MapPin, Search } from 'lucide-react'

interface Hotel {
  id: string
  name: string
  description: string
  city: string
  country: string
  rating: number
  total_reviews: number
  address: string
}

export default function HotelsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    city: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchLoading(true)

    try {
      const query = new URLSearchParams({
        city: searchParams.city,
        limit: '12',
      })

      const response = await fetch(`/api/hotels?${query}`)
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <>
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <section className="bg-card rounded-lg border border-border p-6">
            <h1 className="text-3xl font-bold mb-6">Find Your Hotel</h1>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., New York, Paris, Tokyo"
                    value={searchParams.city}
                    onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                  />
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" disabled={searchLoading} size="lg">
                <Search className="w-4 h-4 mr-2" />
                {searchLoading ? 'Searching...' : 'Search Hotels'}
              </Button>
            </form>
          </section>

          {/* Results */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {hotels.length > 0 ? `Found ${hotels.length} hotels` : 'Featured Hotels'}
            </h2>
            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="space-y-2">
                          <CardTitle className="line-clamp-2">{hotel.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{hotel.city}, {hotel.country}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-semibold">{hotel.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({hotel.total_reviews} reviews)</span>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Search for a city to see available hotels</p>
                  <p className="text-sm text-muted-foreground">Try searching for New York, Paris, or Tokyo</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
