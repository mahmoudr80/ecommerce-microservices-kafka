import { NextRequest, NextResponse } from 'next/server'

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000'

export async function GET(request: NextRequest, { params }: { params: { user_id?: string; id?: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    let url = `${API_GATEWAY_URL}/api/bookings`

    if (params?.id) {
      url = `${API_GATEWAY_URL}/api/bookings/${params.id}`
    } else if (params?.user_id) {
      url = `${API_GATEWAY_URL}/api/bookings/user/${params.user_id}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_GATEWAY_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
