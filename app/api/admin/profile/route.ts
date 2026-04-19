import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: {
        links: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    })

    if (!profile) {
      // Create default profile
      const defaultProfile = await prisma.profile.create({
        data: {
          username: 'user',
          bio: 'Welcome to my bio page!',
          theme: {
            primaryColor: '#3b82f6',
            backgroundColor: '#f8fafc'
          },
          layout: 'LIST'
        }
      })
      return NextResponse.json(defaultProfile)
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { theme, layout } = await request.json()

    const profile = await prisma.profile.updateMany({
      data: { theme, layout }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
