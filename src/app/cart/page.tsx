import { CartItems } from '@/components/cart/cart-items'
import { OrderForm } from '@/components/cart/order-form'

export const metadata = {
  title: 'Корзина',
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div>
          <OrderForm />
        </div>
      </div>
    </div>
  )
}
