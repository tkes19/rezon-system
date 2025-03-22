'use client'

import { useState, useEffect } from 'react'
import { Order, getOrders } from '@/lib/orders'
import { OrderDetail, getOrderDetails, addOrderDetail, updateOrderDetail, deleteOrderDetail } from '@/lib/orderDetails'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface OrderDetailsManagerProps {
  orderId: number
}

type LocalOrderDetail = OrderDetail & { isNew?: boolean; isDeleted?: boolean; isModified?: boolean }

export default function OrderDetailsManager({ orderId }: OrderDetailsManagerProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderDetails, setOrderDetails] = useState<LocalOrderDetail[]>([])
  const [originalOrderDetails, setOriginalOrderDetails] = useState<OrderDetail[]>([])
  const [editingDetail, setEditingDetail] = useState<LocalOrderDetail | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [nextTempId, setNextTempId] = useState(-1) // Tymczasowe ID dla nowych elementów

  useEffect(() => {
    loadOrderData()
  }, [orderId])

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

  if (!order) {
    return <div>Ładowanie...</div>
  }

  const visibleOrderDetails = orderDetails.filter(d => !d.isDeleted)

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">
            Szczegóły zamówienia: {order.name} (ID: {order.id})
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button 
                variant="destructive" 
                onClick={handleCancelAllChanges}
                disabled={isSaving}
              >
                Anuluj zmiany
              </Button>
              <Button 
                variant="default" 
                onClick={handleSaveAllChanges}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Zapisz wszystkie zmiany
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Sekcja dodawania nowego elementu */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Dodaj nowy element</h3>
          <Button onClick={handleAddDetail} className="w-full">Dodaj nowy element</Button>
        </div>

        {/* Lista elementów zamówienia */}
        <div>
          <h3 className="font-medium mb-4">Lista elementów zamówienia</h3>
          {visibleOrderDetails.length === 0 ? (
            <p className="text-gray-500">Brak elementów w tym zamówieniu</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nr identyfikacyjny</TableHead>
                  <TableHead>Indeks</TableHead>
                  <TableHead>Ilość</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrderDetails.map((detail) => (
                  <TableRow 
                    key={detail.id} 
                    className={
                      detail.isNew 
                        ? 'bg-green-50' 
                        : detail.isModified 
                          ? 'bg-yellow-50' 
                          : ''
                    }
                  >
                    <TableCell>{detail.id > 0 ? detail.id : 'Nowy'}</TableCell>
                    <TableCell>
                      {editingDetail?.id === detail.id ? (
                        <Input
                          value={editingDetail.identity_number}
                          onChange={(e) =>
                            setEditingDetail({ ...editingDetail, identity_number: e.target.value })
                          }
                        />
                      ) : (
                        detail.identity_number
                      )}
                    </TableCell>
                    <TableCell>
                      {editingDetail?.id === detail.id ? (
                        <Input
                          type="number"
                          value={editingDetail.index}
                          onChange={(e) =>
                            setEditingDetail({ ...editingDetail, index: parseInt(e.target.value) || 0 })
                          }
                        />
                      ) : (
                        detail.index
                      )}
                    </TableCell>
                    <TableCell>
                      {editingDetail?.id === detail.id ? (
                        <Input
                          type="number"
                          value={editingDetail.quantity}
                          onChange={(e) =>
                            setEditingDetail({ ...editingDetail, quantity: parseInt(e.target.value) || 0 })
                          }
                        />
                      ) : (
                        detail.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      {detail.isNew && (
                        <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-100 rounded-full">Nowy</span>
                      )}
                      {detail.isModified && (
                        <span className="text-yellow-600 text-xs font-medium px-2 py-1 bg-yellow-100 rounded-full">Zmodyfikowany</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingDetail?.id === detail.id ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              handleUpdateLocalDetail(detail.id, editingDetail)
                              handleFinishEditing()
                            }}
                          >
                            OK
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleFinishEditing}
                          >
                            Anuluj
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={() => setEditingDetail(detail)}>Edytuj</Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteLocalDetail(detail.id)}
                          >
                            Usuń
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
} 