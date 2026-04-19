'use client'

import { useState, useEffect } from 'react'

export default function AppearanceTab() {
  const [profile, setProfile] = useState({
    theme: {
      primaryColor: '#3b82f6',
      backgroundColor: '#f8fafc'
    },
    layout: 'LIST'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        // Update preview
        if (profile.theme) {
          document.documentElement.style.setProperty('--color-primary', profile.theme.primaryColor)
          document.documentElement.style.setProperty('--color-background', profile.theme.backgroundColor)
        }
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const layouts = [
    { value: 'LIST', label: 'List', description: 'Simple vertical list of links' },
    { value: 'CARD', label: 'Card', description: 'Grid layout with cards' },
    { value: 'MINIMAL', label: 'Minimal', description: 'Clean, minimal design' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme Colors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Colors</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={profile.theme?.primaryColor || '#3b82f6'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: {
                        ...profile.theme,
                        primaryColor: e.target.value
                      }
                    })}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={profile.theme?.primaryColor || '#3b82f6'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: {
                        ...profile.theme,
                        primaryColor: e.target.value
                      }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={profile.theme?.backgroundColor || '#f8fafc'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: {
                        ...profile.theme,
                        backgroundColor: e.target.value
                      }
                    })}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={profile.theme?.backgroundColor || '#f8fafc'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: {
                        ...profile.theme,
                        backgroundColor: e.target.value
                      }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Style</h3>
            
            <div className="space-y-3">
              {layouts.map((layout) => (
                <label key={layout.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="layout"
                    value={layout.value}
                    checked={profile.layout === layout.value}
                    onChange={(e) => setProfile({ ...profile, layout: e.target.value as any })}
                    className="mt-1 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{layout.label}</p>
                    <p className="text-sm text-gray-600">{layout.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h3>
        
        <div 
          className="rounded-lg overflow-hidden shadow-lg"
          style={{ backgroundColor: profile.theme?.backgroundColor || '#f8fafc' }}
        >
          <div className="p-8">
            {/* Preview Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">@username</h4>
              <p className="text-gray-600">Bio preview text goes here</p>
            </div>

            {/* Preview Links */}
            <div className="space-y-3">
              {['GitHub', 'Twitter', 'LinkedIn'].map((title, index) => (
                <div
                  key={index}
                  className="w-full px-6 py-4 rounded-lg font-medium text-white"
                  style={{ backgroundColor: profile.theme?.primaryColor || '#3b82f6' }}
                >
                  <div className="flex items-center justify-between">
                    <span>{title}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
