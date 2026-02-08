import { CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'О компании',
  description: 'Информация о компании ТОО Ferrum Link',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">О компании</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          ТОО Ferrum Link — один из ведущих поставщиков металлопроката
          и промышленных материалов в Казахстане. За время работы компания
          заслужила доверие сотен клиентов.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Наши преимущества</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Более 2000 наименований продукции',
            'Собственный склад в Астане',
            'Доставка по всему Казахстану',
            'Гибкая система скидок',
            'Сертифицированная продукция',
            'Профессиональные консультации',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Наша миссия</h2>
        <p className="text-gray-600">
          Обеспечивать предприятия Казахстана качественным металлопрокатом
          и промышленными материалами по конкурентным ценам с высоким уровнем сервиса.
        </p>
      </div>
    </div>
  )
}
