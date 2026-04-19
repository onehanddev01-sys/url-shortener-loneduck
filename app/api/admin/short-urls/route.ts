import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const shortUrls = await prisma.shortUrl.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(shortUrls)
  } catch (error) {
    console.error('Error fetching short URLs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { slug, targetUrl } = await request.json()

    if (!slug || !targetUrl) {
      return NextResponse.json(
        { error: 'Slug and target URL are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.shortUrl.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const shortUrl = await prisma.shortUrl.create({
      data: { slug, targetUrl }
    })

    return NextResponse.json(shortUrl)
  } catch (error) {
    console.error('Error creating short URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
