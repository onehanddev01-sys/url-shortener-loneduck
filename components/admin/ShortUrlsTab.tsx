'use client'

import { useState, useEffect } from 'react'

export default function ShortUrlsTab() {
  const [shortUrls, setShortUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShortUrl, setEditingShortUrl] = useState(null)
  const [formData, setFormData] = useState({
    slug: '',
    targetUrl: ''
  })

  useEffect(() => {
    fetchShortUrls()
  }, [])

  const fetchShortUrls = async () => {
    try {
      const response = await fetch('/api/admin/short-urls')
      const data = await response.json()
      setShortUrls(data)
    } catch (error) {
      console.error('Error fetching short URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingShortUrl ? `/api/admin/short-urls/${editingShortUrl.id}` : '/api/admin/short-urls'
      const method = editingShortUrl ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingShortUrl(null)
        setFormData({ slug: '', targetUrl: '' })
        fetchShortUrls()
      } else {
        const data = await response.json()
        alert(data.error || 'Error saving short URL')
      }
    } catch (error) {
      console.error('Error saving short URL:', error)
    }
  }

  const handleEdit = (shortUrl: any) => {
    setEditingShortUrl(shortUrl)
    setFormData({
      slug: shortUrl.slug,
      targetUrl: shortUrl.targetUrl
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this short URL?')) return

    try {
      const response = await fetch(`/api/admin/short-urls/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchShortUrls()
      }
    } catch (error) {
      console.error('Error deleting short URL:', error)
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Short URLs</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Create Short URL
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingShortUrl ? 'Edit Short URL' : 'Create New Short URL'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (short code)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="github"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be the short code: {window.location.origin}/s/{formData.slug || 'slug'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL
              </label>
              <input
                type="url"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingShortUrl ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingShortUrl(null)
                  setFormData({ slug: '', targetUrl: '' })
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Short URLs List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {shortUrls.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shortUrls.map((shortUrl: any) => (
                  <tr key={shortUrl.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{shortUrl.slug}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/s/${shortUrl.slug}`)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy link"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="max-w-xs truncate">{shortUrl.targetUrl}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shortUrl.clickCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(shortUrl)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(shortUrl.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No short URLs found</p>
          </div>
        )}
      </div>
    </div>
  )
}
