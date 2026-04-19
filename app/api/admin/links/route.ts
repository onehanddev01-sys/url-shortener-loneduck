import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { orderIndex: 'asc' }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, url, isActive } = await request.json()

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    // Get the highest order index
    const lastLink = await prisma.link.findFirst({
      orderBy: { orderIndex: 'desc' }
    })

    const newOrderIndex = lastLink ? lastLink.orderIndex + 1 : 0

    // Get or create default profile
    let profile = await prisma.profile.findFirst()
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          username: 'user',
          bio: 'Welcome to my bio page!',
        }
      })
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        isActive: isActive ?? true,
        orderIndex: newOrderIndex,
        profileId: profile.id
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
