import OrderDetailsManager from '@/components/OrderDetailsManager'

// @ts-ignore - Ignorowanie błędów typowania z Next.js 15.2.3
export default async function OrderPage({ 
  params, 
  searchParams 
}: { 
  params: any, 
  searchParams: any 
}) {
  const orderId = parseInt(params.id)

  return (
    <div>
      <OrderDetailsManager orderId={orderId} />
    </div>
  )
} 