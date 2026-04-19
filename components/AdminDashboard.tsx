'use client'

import { useState, useEffect } from 'react'
import OverviewTab from '@/components/admin/OverviewTab'
import LinksTab from '@/components/admin/LinksTab'
import ShortUrlsTab from '@/components/admin/ShortUrlsTab'
import AppearanceTab from '@/components/admin/AppearanceTab'
import SettingsTab from '@/components/admin/SettingsTab'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'links', label: 'Links', icon: '🔗' },
    { id: 'shortUrls', label: 'Short URLs', icon: '🔗' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'links':
        return <LinksTab />
      case 'shortUrls':
        return <ShortUrlsTab />
      case 'appearance':
        return <AppearanceTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full text-left px-6 py-3 flex items-center space-x-3
                  transition-colors duration-200
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <a
              href="/api/auth/logout"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 text-center block"
            >
              Logout
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
