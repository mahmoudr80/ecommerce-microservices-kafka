'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, Home, Hotel, BookOpen, User } from 'lucide-react'

export function DashboardNav() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated) return null

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Hotel Booking
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/hotels" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              Hotels
            </Link>
            <Link href="/bookings" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              My Bookings
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-primary" />
            <span className="text-foreground">{user?.first_name} {user?.last_name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
