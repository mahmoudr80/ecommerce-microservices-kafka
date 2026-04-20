'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CreditCard } from 'lucide-react'

interface BookingDetails {
  id: string
  check_in_date: string
  check_out_date: string
  total_price: number
  hotel_id: string
}

export default function PaymentPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id')

  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [formData, setFormData] = useState({
    card_number: '',
    expiry: '',
    cvc: '',
    name: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setPageLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/bookings?id=${bookingId}`)
        if (response.ok) {
          const data = await response.json()
          setBooking(data)
        }
      } catch (error) {
        console.error('Error fetching booking:', error)
      } finally {
        setPageLoading(false)
      }
    }

    if (isAuthenticated && !loading) {
      fetchBooking()
    }
  }, [bookingId, isAuthenticated, loading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (!bookingId || !user?.id) throw new Error('Missing booking or user information')

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          user_id: user.id,
          amount: booking?.total_price,
          currency: 'USD',
          payment_method: formData.card_number,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/bookings')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pageLoading || !isAuthenticated || !booking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (success) {
    return (
      <>
        <DashboardNav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-700 font-semibold">Payment successful! Your booking is confirmed.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>Enter your card information to complete the booking</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card_number">Card Number</Label>
                    <Input
                      id="card_number"
                      name="card_number"
                      placeholder="4242 4242 4242 4242"
                      value={formData.card_number}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={formData.cvc}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={submitting}
                    size="lg"
                  >
                    {submitting ? 'Processing...' : `Pay $${booking.total_price.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-semibold">{new Date(booking.check_in_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-semibold">{new Date(booking.check_out_date).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="text-primary font-bold text-lg">${booking.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
