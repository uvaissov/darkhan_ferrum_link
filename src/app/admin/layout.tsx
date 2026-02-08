import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Админ-панель | Ferrum Link',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
