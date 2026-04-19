import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function createSession() {
  const cookieStore = cookies()
  const sessionToken = generateSessionToken()
  
  cookieStore.set('admin-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  
  return sessionToken
}

export async function removeSession() {
  const cookieStore = cookies()
  cookieStore.delete('admin-session')
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = cookies()
  return cookieStore.get('admin-session')?.value
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
