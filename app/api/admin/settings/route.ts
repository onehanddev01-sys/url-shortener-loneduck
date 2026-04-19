import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, hashPassword } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new passwords are required' },
        { status: 400 }
      )
    }

    // Get admin user
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 500 }
      )
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, admin.passwordHash)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newPasswordHash }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
