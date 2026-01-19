'use client'

import Link from 'next/link'
import { Phone, Mail, ShoppingCart, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'
import { MobileMenu } from './mobile-menu'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+77172123456" className="flex items-center gap-1 hover:text-orange-400">
              <Phone className="w-4 h-4" />
              +7 (7172) 12-34-56
            </a>
            <a href="mailto:info@metalloprokat.kz" className="hidden sm:flex items-center gap-1 hover:text-orange-400">
              <Mail className="w-4 h-4" />
              info@metalloprokat.kz
            </a>
          </div>
          <div className="text-gray-400">
            Пн-Пт: 9:00 - 18:00
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <span className="text-orange-500">МЕТАЛЛО</span>ПРОКАТ
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/catalog" className="hover:text-orange-500">Каталог</Link>
            <Link href="/about" className="hover:text-orange-500">О компании</Link>
            <Link href="/delivery" className="hover:text-orange-500">Доставка</Link>
            <Link href="/services" className="hover:text-orange-500">Услуги</Link>
            <Link href="/calculator" className="hover:text-orange-500">Калькулятор</Link>
            <Link href="/news" className="hover:text-orange-500">Новости</Link>
            <Link href="/contacts" className="hover:text-orange-500">Контакты</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}
