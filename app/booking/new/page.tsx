'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

export default function BookingPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    hotel_id: '',
    room_id: '',
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    special_requests: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number_of_guests' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (!user?.id) throw new Error('User not found')

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          total_price: 0, // Will be calculated by backend
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/bookings')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (success) {
    return (
      <>
        <DashboardNav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-700 font-semibold">Booking created successfully! Redirecting...</p>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardNav />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Booking</CardTitle>
            <CardDescription>Reserve your next hotel stay</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in_date">Check-in Date</Label>
                  <Input
                    id="check_in_date"
                    name="check_in_date"
                    type="date"
                    value={formData.check_in_date}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="check_out_date">Check-out Date</Label>
                  <Input
                    id="check_out_date"
                    name="check_out_date"
                    type="date"
                    value={formData.check_out_date}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_of_guests">Number of Guests</Label>
                <Input
                  id="number_of_guests"
                  name="number_of_guests"
                  type="number"
                  min="1"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  placeholder="Any special requests?"
                  value={formData.special_requests}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={submitting}
                size="lg"
              >
                {submitting ? 'Creating booking...' : 'Create Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
