import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BioPage from '@/components/BioPage'

interface PageProps {
  params: {
    username: string
  }
}

export default async function UsernamePage({ params }: PageProps) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' }
      }
    }
  })

  if (!profile) {
    notFound()
  }

  return <BioPage profile={profile as any} />
}

export async function generateMetadata({ params }: PageProps) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    select: {
      username: true,
      bio: true,
    }
  })

  if (!profile) {
    return {
      title: 'User not found',
    }
  }

  return {
    title: `${profile.username} - Bio Links`,
    description: profile.bio,
  }
}
