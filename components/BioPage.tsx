'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Profile, Link as LinkType, Layout } from '@prisma/client'

interface BioPageProps {
  profile: Profile & {
    links: LinkType[]
  }
}

export default function BioPage({ profile }: BioPageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (profile.theme) {
      const theme = profile.theme as any
      document.documentElement.style.setProperty('--color-primary', theme.primaryColor)
      document.documentElement.style.setProperty('--color-background', theme.backgroundColor)
    }
  }, [profile])

  if (!mounted) return null

  const renderLinks = () => {
    switch (profile.layout) {
      case 'CARD':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )
      case 'MINIMAL':
        return (
          <div className="space-y-1">
            {profile.links.map((link) => (
              <MinimalLink key={link.id} link={link} />
            ))}
          </div>
        )
      default:
        return (
          <div className="space-y-3">
            {profile.links.map((link) => (
              <ListLink key={link.id} link={link} />
            ))}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {profile.avatarUrl && (
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={profile.avatarUrl}
                alt={profile.username}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            @{profile.username}
          </h1>
          {profile.bio && (
            <p className="text-gray-600 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {renderLinks()}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Built with ❤️ using Next.js</p>
        </div>
      </div>
    </div>
  )
}

function ListLink({ link }: { link: LinkType }) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`
        block w-full px-6 py-4 rounded-lg font-medium text-white
        transition-all duration-200 transform hover:scale-105
        ${isClicked ? 'scale-95' : ''}
      `}
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="flex items-center justify-between">
        <span>{link.title}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

function CardLink({ link }: { link: LinkType }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
      <p className="text-sm text-gray-600 truncate">{link.url}</p>
      <div className="mt-4 text-xs text-gray-500">
        {link.clickCount} clicks
      </div>
    </a>
  )
}

function MinimalLink({ link }: { link: LinkType }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-2 py-1 text-gray-700 hover:text-gray-900 transition-colors duration-200"
    >
      {link.title}
    </a>
  )
}
