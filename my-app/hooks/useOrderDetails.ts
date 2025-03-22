import { useState, useEffect } from 'react'
import { Order, getOrders } from '@/lib/orders'
import { OrderDetail, getOrderDetails, addOrderDetail, updateOrderDetail, deleteOrderDetail } from '@/lib/orderDetails'

export type LocalOrderDetail = OrderDetail & { 
  isNew?: boolean; 
  isDeleted?: boolean; 
  isModified?: boolean 
}

export function useOrderDetails(orderId: number) {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderDetails, setOrderDetails] = useState<LocalOrderDetail[]>([])
  const [originalOrderDetails, setOriginalOrderDetails] = useState<OrderDetail[]>([])
  const [editingDetail, setEditingDetail] = useState<LocalOrderDetail | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [nextTempId, setNextTempId] = useState(-1) // Tymczasowe ID dla nowych elementów

  // Sprawdzenie, czy są niezapisane zmiany
  useEffect(() => {
    if (!originalOrderDetails.length && !orderDetails.length) return

    const hasNewItems = orderDetails.some(d => d.isNew)
    const hasDeletedItems = orderDetails.some(d => d.isDeleted)
    const hasModifiedItems = orderDetails.some(d => d.isModified)

    setHasChanges(hasNewItems || hasDeletedItems || hasModifiedItems)
  }, [orderDetails, originalOrderDetails])

  const loadOrderData = async () => {
    try {
      // Pobierz dane zamówienia
      const orders = await getOrders()
      const foundOrder = orders.find(o => o.id === orderId)
      setOrder(foundOrder || null)

      // Pobierz szczegóły zamówienia
      const details = await getOrderDetails(orderId)
      setOrderDetails(details)
      setOriginalOrderDetails(details)
      
      // Resetuj lokalne stany
      setHasChanges(false)
      setNextTempId(-1)
    } catch (error) {
      console.error('Błąd podczas ładowania danych zamówienia:', error)
    }
  }

  const handleAddDetail = () => {
    // Generuj nowy lokalny rekord
    const newLocalDetail: LocalOrderDetail = {
      id: nextTempId,
      identity_number: '',
      index: Math.max(0, ...orderDetails.filter(d => !d.isDeleted).map(d => d.index)) + 1,
      quantity: 1,
      order_id: orderId,
      isNew: true
    }
    
    setOrderDetails(prev => [...prev, newLocalDetail])
    setEditingDetail(newLocalDetail)
    setNextTempId(prev => prev - 1) // Zmniejszamy, aby uniknąć kolizji z ID z bazy danych
  }

  const handleUpdateLocalDetail = (id: number, changes: Partial<Omit<OrderDetail, 'id'>>) => {
    setOrderDetails(prev => prev.map(detail => {
      if (detail.id === id) {
        const isExistingRecord = !detail.isNew && id > 0
        return { 
          ...detail, 
          ...changes, 
          isModified: isExistingRecord ? true : detail.isModified 
        }
      }
      return detail
    }))
  }

  const handleDeleteLocalDetail = (id: number) => {
    // Jeśli to nowy element, usuwamy go całkowicie
    if (id < 0) {
      setOrderDetails(prev => prev.filter(d => d.id !== id))
      return
    }
    
    // Jeśli to istniejący element, oznaczamy jako usunięty
    setOrderDetails(prev => prev.map(detail =>
      detail.id === id ? { ...detail, isDeleted: true } : detail
    ))
  }

  const handleFinishEditing = () => {
    setEditingDetail(null)
  }

  const handleSaveAllChanges = async () => {
    if (!hasChanges) return
    
    setIsSaving(true)
    
    try {
      // 1. Zapisz nowe elementy
      const newItems = orderDetails.filter(d => d.isNew && !d.isDeleted)
      for (const item of newItems) {
        const { id, isNew, isModified, isDeleted, ...newItem } = item
        await addOrderDetail(newItem)
      }
      
      // 2. Zaktualizuj zmodyfikowane elementy
      const modifiedItems = orderDetails.filter(d => d.isModified && !d.isNew && !d.isDeleted)
      for (const item of modifiedItems) {
        const { id, isNew, isModified, isDeleted, ...updateItem } = item
        await updateOrderDetail(id, updateItem)
      }
      
      // 3. Usuń oznaczone elementy
      const deletedItems = orderDetails.filter(d => d.isDeleted && !d.isNew)
      for (const item of deletedItems) {
        await deleteOrderDetail(item.id)
      }
      
      // 4. Odśwież dane
      await loadOrderData()
      
      setIsSaving(false)
    } catch (error) {
      console.error('Błąd podczas zapisywania zmian:', error)
      setIsSaving(false)
    }
  }
  
  const handleCancelAllChanges = () => {
    // Przywrócenie oryginalnych danych
    setOrderDetails(originalOrderDetails)
    setEditingDetail(null)
  }

  // Memoizacja listy elementów widocznych (bez usuniętych)
  const visibleOrderDetails = orderDetails.filter(d => !d.isDeleted)

  return {
    order,
    orderDetails: visibleOrderDetails,
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
  }
} 