'use client'

import { useEffect } from 'react'
import { useOrderDetails } from '@/hooks/useOrderDetails'
import OrderDetailsHeader from '@/components/orders/OrderDetailsHeader'
import OrderDetailsList from '@/components/orders/OrderDetailsList'
import AddOrderDetail from '@/components/orders/AddOrderDetail'

interface OrderDetailsManagerProps {
  orderId: number
}

export default function OrderDetailsManager({ orderId }: OrderDetailsManagerProps) {
  const { 
    order,
    orderDetails,
    editingDetail,
    isSaving,
    hasChanges,
    loadOrderData,
    handleAddDetail,
    handleUpdateLocalDetail,
    handleDeleteLocalDetail,
    handleFinishEditing,
    handleSaveAllChanges,
    handleCancelAllChanges,
    setEditingDetail
  } = useOrderDetails(orderId)

  useEffect(() => {
    loadOrderData()
  }, [orderId])

  if (!order && orderDetails.length === 0) {
    return <div className="p-4">Ładowanie danych zamówienia...</div>
  }

  return (
    <div className="p-4 space-y-6">
      <OrderDetailsHeader 
        order={order}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSaveChanges={handleSaveAllChanges}
        onCancelChanges={handleCancelAllChanges}
      />

      <div className="space-y-6">
        <AddOrderDetail onAddDetail={handleAddDetail} />

        <div>
          <h3 className="font-medium mb-4">Lista elementów zamówienia</h3>
          <OrderDetailsList 
            orderDetails={orderDetails}
            editingDetail={editingDetail}
            setEditingDetail={setEditingDetail}
            handleUpdateLocalDetail={handleUpdateLocalDetail}
            handleDeleteLocalDetail={handleDeleteLocalDetail}
            handleFinishEditing={handleFinishEditing}
          />
        </div>
      </div>
    </div>
  )
} 