import { Hero } from '@/components/home/hero'
import { CategoriesGrid } from '@/components/home/categories-grid'
import { Features } from '@/components/home/features'
import { CallbackForm } from '@/components/forms/callback-form'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CategoriesGrid />
      <CallbackForm />
    </>
  )
}
