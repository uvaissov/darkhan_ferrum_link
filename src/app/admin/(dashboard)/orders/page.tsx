'use client'

import { useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { formatPrice } from '@/lib/utils'
import { Loader2, ShoppingCart } from 'lucide-react'

type OrderStatus = 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

interface OrderItem {
  id: string
  name: string
  price: string
  quantity: number
  unit: string
}

interface Order {
  id: string
  number: string
  status: OrderStatus
  name: string
  phone: string
  email: string | null
  company: string | null
  comment: string | null
  items: OrderItem[]
  totalAmount: string
  createdAt: string
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Новый',
  PROCESSING: 'В обработке',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
}

const STATUS_BADGE_VARIANT: Record<OrderStatus, 'warning' | 'default' | 'success' | 'error'> = {
  NEW: 'warning',
  PROCESSING: 'default',
  COMPLETED: 'success',
  CANCELLED: 'error',
}

const FILTER_TABS: { label: string; value: OrderStatus | null }[] = [
  { label: 'Все', value: null },
  { label: 'Новые', value: 'NEW' },
  { label: 'В обработке', value: 'PROCESSING' },
  { label: 'Завершены', value: 'COMPLETED' },
  { label: 'Отменены', value: 'CANCELLED' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<OrderStatus | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalStatus, setModalStatus] = useState<OrderStatus>('NEW')
  const [saving, setSaving] = useState(false)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const url = activeFilter
        ? `/api/admin/orders?status=${activeFilter}`
        : '/api/admin/orders'
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [activeFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  function openModal(order: Order) {
    setSelectedOrder(order)
    setModalStatus(order.status)
  }

  function closeModal() {
    setSelectedOrder(null)
  }

  async function handleStatusChange() {
    if (!selectedOrder || modalStatus === selectedOrder.status) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOrder.id, status: modalStatus }),
      })

      if (res.ok) {
        const updated = await res.json()
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o))
        )
        setSelectedOrder(updated)
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.label}
            variant={activeFilter === tab.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Заказов не найдено</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Номер</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Клиент</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Сумма</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Статус</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Дата</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openModal(order)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      #{order.number}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{order.name}</div>
                      <div className="text-gray-500 text-xs">{order.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={closeModal}
        title={selectedOrder ? `Заказ #${selectedOrder.number}` : ''}
        className="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Customer info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Имя:</span>{' '}
                <span className="font-medium text-gray-900">{selectedOrder.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Телефон:</span>{' '}
                <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
              </div>
              {selectedOrder.email && (
                <div>
                  <span className="text-gray-500">Email:</span>{' '}
                  <span className="font-medium text-gray-900">{selectedOrder.email}</span>
                </div>
              )}
              {selectedOrder.company && (
                <div>
                  <span className="text-gray-500">Компания:</span>{' '}
                  <span className="font-medium text-gray-900">{selectedOrder.company}</span>
                </div>
              )}
              {selectedOrder.comment && (
                <div className="col-span-2">
                  <span className="text-gray-500">Комментарий:</span>{' '}
                  <span className="text-gray-900">{selectedOrder.comment}</span>
                </div>
              )}
            </div>

            {/* Order items table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Товар</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Цена</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Кол-во</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Ед.</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2 text-gray-900">{item.name}</td>
                      <td className="px-3 py-2 text-right text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-900">{item.quantity}</td>
                      <td className="px-3 py-2 text-gray-500">{item.unit}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900">
                        {formatPrice(parseFloat(item.price) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={4} className="px-3 py-2 text-right font-semibold text-gray-900">
                      Итого:
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-gray-900">
                      {formatPrice(selectedOrder.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Status change */}
            <div className="flex items-center gap-3 pt-2 border-t">
              <label className="text-sm font-medium text-gray-700">Статус:</label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value as OrderStatus)}
                className="flex-1 h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleStatusChange}
                disabled={saving || modalStatus === selectedOrder.status}
                size="sm"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Сохранить'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
