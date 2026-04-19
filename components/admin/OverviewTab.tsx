'use client'

import { useState, useEffect } from 'react'

export default function OverviewTab() {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    totalShortUrls: 0,
    topLinks: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Links</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Short URLs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalShortUrls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👆</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Links */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Links</h3>
        {stats.topLinks.length > 0 ? (
          <div className="space-y-3">
            {stats.topLinks.map((link: any, index: number) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{link.title}</p>
                    <p className="text-sm text-gray-600 truncate">{link.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{link.clickCount}</p>
                  <p className="text-sm text-gray-600">clicks</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No links found</p>
        )}
      </div>
    </div>
  )
}
