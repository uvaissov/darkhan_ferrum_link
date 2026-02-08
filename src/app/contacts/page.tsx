import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CallbackForm } from '@/components/forms/callback-form'

export const metadata = {
  title: 'Контакты',
  description: 'Контактная информация ТОО Ferrum Link',
}

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Контакты</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <a href="tel:+77172123456" className="font-medium hover:text-orange-500">
                      +7 (7172) 12-34-56
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:info@ferrumlink.kz" className="font-medium hover:text-orange-500">
                      info@ferrumlink.kz
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Адрес</p>
                    <p className="font-medium">г. Астана, ул. Циолковского 11, офис 305</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Режим работы</p>
                    <p className="font-medium">Пн-Пт: 9:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Карта</p>
          </div>
        </div>

        <div>
          <CallbackForm />
        </div>
      </div>
    </div>
  )
}
