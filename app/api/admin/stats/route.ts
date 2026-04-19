import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalLinks, totalShortUrls, totalClicks, topLinks] = await Promise.all([
      prisma.link.count(),
      prisma.shortUrl.count(),
      prisma.link.aggregate({
        _sum: { clickCount: true }
      }),
      prisma.link.findMany({
        orderBy: { clickCount: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          url: true,
          clickCount: true
        }
      })
    ])

    const totalLinkClicks = totalClicks._sum.clickCount || 0

    const shortUrlClicks = await prisma.shortUrl.aggregate({
      _sum: { clickCount: true }
    })

    const totalAllClicks = totalLinkClicks + (shortUrlClicks._sum.clickCount || 0)

    return NextResponse.json({
      totalLinks,
      totalShortUrls,
      totalClicks: totalAllClicks,
      topLinks
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
