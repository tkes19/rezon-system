import OrderDetailsManager from '@/components/OrderDetailsManager'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const dynamicParams = true

interface OrderPageProps {
  params: {
    id: string
  }
}

export function generateStaticParams() {
  // Predefiniowanie kilku ID zamówień, które na pewno będą dostępne
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function OrderPage({ params }: OrderPageProps) {
  const orderId = parseInt(params.id)
  
  // Jeśli id nie jest liczbą, przekieruj do 404
  if (isNaN(orderId)) {
    notFound()
  }

  return (
    <div>
      <OrderDetailsManager orderId={orderId} />
    </div>
  )
} 