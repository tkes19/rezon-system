import OrderDetailsManager from '@/components/OrderDetailsManager'

interface OrderPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  const orderId = parseInt(params.id)

  return (
    <div>
      <OrderDetailsManager orderId={orderId} />
    </div>
  )
} 