import { z } from 'zod'

export const callbackSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  message: z.string().optional(),
})

export const orderSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  company: z.string().optional(),
  comment: z.string().optional(),
})

export const priceRequestSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  productName: z.string(),
  message: z.string().optional(),
})

export type CallbackFormData = z.infer<typeof callbackSchema>
export type OrderFormData = z.infer<typeof orderSchema>
export type PriceRequestFormData = z.infer<typeof priceRequestSchema>
