import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { slug, targetUrl } = await request.json()

    if (!slug || !targetUrl) {
      return NextResponse.json(
        { error: 'Slug and target URL are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists (excluding current)
    const existing = await prisma.shortUrl.findFirst({
      where: {
        slug,
        NOT: { id: params.id }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const shortUrl = await prisma.shortUrl.update({
      where: { id: params.id },
      data: { slug, targetUrl }
    })

    return NextResponse.json(shortUrl)
  } catch (error) {
    console.error('Error updating short URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.shortUrl.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting short URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
