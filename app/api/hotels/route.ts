import { NextRequest, NextResponse } from 'next/server'

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000'

export async function GET(request: NextRequest, { params }: { params: { id?: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const limit = searchParams.get('limit') || '10'

    let url = `${API_GATEWAY_URL}/api/hotels`
    if (params?.id) {
      url = `${API_GATEWAY_URL}/api/hotels/${params.id}`
    } else if (city) {
      url = `${API_GATEWAY_URL}/api/hotels?city=${city}&limit=${limit}`
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
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 })
  }
}
