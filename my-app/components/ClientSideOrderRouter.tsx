'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Specjalny komponent do obsługi routingu dynamicznych ścieżek na Netlify
 * Używany po stronie klienta do przekierowania użytkownika na właściwą stronę
 */
export default function ClientSideOrderRouter() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Wykonujemy tylko na kliencie
    if (typeof window === 'undefined') return

    // Sprawdzamy, czy jesteśmy na stronie orders/[id]
    if (pathname === '/orders/[id]' || pathname === '/orders/[id]/') {
      // Sprawdź, czy w URL jest ID
      const urlParams = new URLSearchParams(window.location.search)
      const id = urlParams.get('id')

      if (id) {
        // Przekieruj na właściwą ścieżkę z ID
        router.push(`/orders/${id}`)
      } else {
        // Brak ID, przekieruj na listę zamówień
        router.push('/orders')
      }
    }
  }, [pathname, router])

  return null
} 