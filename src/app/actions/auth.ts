'use server'

import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const identifier = formData.get('identifier') as string // can be email or phone
  const password = formData.get('password') as string

  if (!identifier || !password) {
    return { error: 'Please enter credentials' }
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier }
      ]
    }
  })

  if (!user) {
    return { error: 'Invalid credentials' }
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return { error: 'Invalid credentials' }
  }

  // Create token
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ id: user.id, name: user.name, email: user.email })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })

  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
