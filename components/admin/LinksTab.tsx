'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

interface Link {
  id: string
  title: string
  url: string
  isActive: boolean
  clickCount: number
  orderIndex: number
}

export default function LinksTab() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    isActive: true
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLink ? `/api/admin/links/${editingLink.id}` : '/api/admin/links'
      const method = editingLink ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingLink(null)
        setFormData({ title: '', url: '', isActive: true })
        fetchLinks()
      }
    } catch (error) {
      console.error('Error saving link:', error)
    }
  }

  const handleEdit = (link: Link) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      isActive: link.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const response = await fetch(`/api/admin/links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchLinks()
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order indices
    const updatedLinks = items.map((link: any, index) => ({
      ...link,
      orderIndex: index
    }))

    setLinks(updatedLinks)

    // Update in database
    try {
      await fetch('/api/admin/links/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          links: updatedLinks.map((link: any) => ({
            id: link.id,
            orderIndex: link.orderIndex
          }))
        }),
      })
    } catch (error) {
      console.error('Error reordering links:', error)
      // Revert on error
      fetchLinks()
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
        <h2 className="text-2xl font-bold text-gray-900">Links</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add Link
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingLink ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingLink(null)
                  setFormData({ title: '', url: '', isActive: true })
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List with Drag and Drop */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {links.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="links">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-gray-200"
                >
                  {links.map((link: Link, index: number) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            hover:bg-gray-50 transition-colors duration-200
                            ${snapshot.isDragging ? 'bg-gray-100 shadow-lg' : ''}
                          `}
                        >
                          <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move text-gray-400 hover:text-gray-600"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{link.title}</p>
                                  <p className="text-sm text-gray-600 truncate">{link.url}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                  {link.clickCount} clicks
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  link.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {link.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                  onClick={() => handleEdit(link)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(link.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No links found</p>
          </div>
        )}
      </div>
    </div>
  )
}
