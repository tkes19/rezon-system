'use client'

import { useState, useEffect } from 'react'
import { Order, getOrders, addOrder, updateOrder, deleteOrder } from '@/lib/orders'
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
import Link from 'next/link'

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrderName, setNewOrderName] = useState('')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Błąd podczas ładowania zamówień:', error)
    }
  }

  const handleAddOrder = async () => {
    if (!newOrderName.trim()) return
    try {
      await addOrder(newOrderName)
      setNewOrderName('')
      loadOrders()
    } catch (error) {
      console.error('Błąd podczas dodawania zamówienia:', error)
    }
  }

  const handleUpdateOrder = async (id: number, name: string) => {
    try {
      await updateOrder(id, name)
      setEditingOrder(null)
      loadOrders()
    } catch (error) {
      console.error('Błąd podczas aktualizacji zamówienia:', error)
    }
  }

  const handleDeleteOrder = async (id: number) => {
    try {
      await deleteOrder(id)
      loadOrders()
    } catch (error) {
      console.error('Błąd podczas usuwania zamówienia:', error)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Nazwa zamówienia"
          value={newOrderName}
          onChange={(e) => setNewOrderName(e.target.value)}
        />
        <Button onClick={handleAddOrder}>Dodaj zamówienie</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nazwa</TableHead>
            <TableHead>Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {editingOrder?.id === order.id ? (
                  <Input
                    value={editingOrder.name}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, name: e.target.value })
                    }
                  />
                ) : (
                  order.name
                )}
              </TableCell>
              <TableCell>
                {editingOrder?.id === order.id ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleUpdateOrder(editingOrder.id, editingOrder.name)
                      }
                    >
                      Zapisz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingOrder(null)}
                    >
                      Anuluj
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingOrder(order)}>Edytuj</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Usuń
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/orders/${order.id}`}>Szczegóły</Link>
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 