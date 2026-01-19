'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { callbackSchema, CallbackFormData } from '@/lib/validations'
import { useState } from 'react'

export function CallbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
  })

  const onSubmit = async (data: CallbackFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-orange-500">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Заказать обратный звонок
          </h2>
          <p className="text-orange-100 mb-8">
            Оставьте заявку и мы перезвоним вам в течение 15 минут
          </p>

          {isSuccess ? (
            <div className="bg-white rounded-lg p-6 text-green-600 font-semibold">
              Спасибо! Мы скоро вам перезвоним.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                placeholder="Ваше имя"
                {...register('name')}
                error={errors.name?.message}
                className="bg-white"
              />
              <Input
                placeholder="Телефон"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                className="bg-white"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gray-900 hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Перезвоните мне'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
