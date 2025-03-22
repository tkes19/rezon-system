'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/lib/orders'

interface OrderDetailsHeaderProps {
  order: Order | null
  hasChanges: boolean
  isSaving: boolean
  onSaveChanges: () => void
  onCancelChanges: () => void
}

export default function OrderDetailsHeader({
  order,
  hasChanges,
  isSaving,
  onSaveChanges,
  onCancelChanges
}: OrderDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">
          {order ? (
            <>Szczegóły zamówienia: {order.name} (ID: {order.id})</>
          ) : (
            <>Ładowanie zamówienia...</>
          )}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        {hasChanges && (
          <>
            <Button 
              variant="destructive" 
              onClick={onCancelChanges}
              disabled={isSaving}
            >
              Anuluj zmiany
            </Button>
            <Button 
              variant="default" 
              onClick={onSaveChanges}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Zapisz wszystkie zmiany
            </Button>
          </>
        )}
      </div>
    </div>
  )
} 