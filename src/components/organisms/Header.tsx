'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/utils/classname.util'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() =>{
    const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]
    setIsLoggedIn(!!token)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    // Hapus token dari cookie
    document.cookie = 'token=; path=/; max-age=0'
    setIsLoggedIn(false)
    router.push('/login') // redirect ke login
  }

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Admin Management', path: '/admin' },
    ...(!isLoggedIn ? [{ name: 'Login', path: '/login' }] : [])
  ]

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Queue Management System
            </Link>
          </div>
          <nav className="flex space-x-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  isActive(item.path) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
            {!isLoggedIn ? (
              <Link
              href="/login"
              className="px-3 py2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">Login</Link>
            ) : (
              <button
              onClick={handleLogout}
              className="px-3 py2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100">Logout</button>
            )

            }
          </nav>
        </div>
      </div>
    </header>
  )
}
