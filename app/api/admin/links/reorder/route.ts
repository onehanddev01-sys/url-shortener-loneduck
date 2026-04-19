import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { links } = await request.json()

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { error: 'Links must be an array' },
        { status: 400 }
      )
    }

    // Update order indices for all links
    const updates = links.map((link: any) => 
      prisma.link.update({
        where: { id: link.id },
        data: { orderIndex: link.orderIndex }
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
