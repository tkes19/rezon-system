'use client'

import { Button } from '@/components/ui/button'

interface AddOrderDetailProps {
  onAddDetail: () => void
}

export default function AddOrderDetail({ onAddDetail }: AddOrderDetailProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-medium mb-4">Dodaj nowy element</h3>
      <Button onClick={onAddDetail} className="w-full">Dodaj nowy element</Button>
    </div>
  )
} 