'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/layout/sidebar'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen flex bg-gray-50 ${inter.className}`}>
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}