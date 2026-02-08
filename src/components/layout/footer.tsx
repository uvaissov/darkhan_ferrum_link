import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <img src="/logo.svg" alt="Ferrum Link" className="w-7 h-7" />
              <span><span className="text-orange-500">FERRUM</span> LINK</span>
            </h3>
            <p className="text-sm">
              ТОО Ferrum Link — поставщик металлопроката и промышленных материалов в Казахстане.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:text-orange-400">Каталог</Link></li>
              <li><Link href="/about" className="hover:text-orange-400">О компании</Link></li>
              <li><Link href="/delivery" className="hover:text-orange-400">Доставка</Link></li>
              <li><Link href="/services" className="hover:text-orange-400">Услуги</Link></li>
              <li><Link href="/contacts" className="hover:text-orange-400">Контакты</Link></li>
            </ul>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-white font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog/cherniy-metalloprokat" className="hover:text-orange-400">Чёрный металлопрокат</Link></li>
              <li><Link href="/catalog/nerzhaveyka" className="hover:text-orange-400">Нержавеющая сталь</Link></li>
              <li><Link href="/catalog/tsvetnoy-metalloprokat" className="hover:text-orange-400">Цветной металлопрокат</Link></li>
              <li><Link href="/catalog/truboprovodnaya-armatura" className="hover:text-orange-400">Трубопроводная арматура</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>г. Астана, ул. Циолковского 11, офис 305</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+77172123456" className="hover:text-orange-400">+7 (7172) 12-34-56</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@ferrumlink.kz" className="hover:text-orange-400">info@ferrumlink.kz</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ТОО Ferrum Link. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
