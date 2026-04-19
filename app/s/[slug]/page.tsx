import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ShortUrlRedirect({ params }: PageProps) {
  const shortUrl = await prisma.shortUrl.findUnique({
    where: { slug: params.slug }
  })

  if (!shortUrl) {
    notFound()
  }

  // Increment click count
  await prisma.shortUrl.update({
    where: { id: shortUrl.id },
    data: { clickCount: { increment: 1 } }
  })

  // Redirect to target URL
  redirect(shortUrl.targetUrl)
}
