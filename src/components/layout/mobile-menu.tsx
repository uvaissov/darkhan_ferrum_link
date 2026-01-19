'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О компании' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/services', label: 'Услуги' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/news', label: 'Новости' },
  { href: '/contacts', label: 'Контакты' },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-3 border-b hover:text-orange-500"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
