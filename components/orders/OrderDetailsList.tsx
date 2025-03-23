'use client'

import { LocalOrderDetail } from '@/hooks/useOrderDetails'
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

interface OrderDetailsListProps {
  orderDetails: LocalOrderDetail[]
  editingDetail: LocalOrderDetail | null
  setEditingDetail: (detail: LocalOrderDetail | null) => void
  handleUpdateLocalDetail: (id: number, detail: any) => void
  handleDeleteLocalDetail: (id: number) => void
  handleFinishEditing: () => void
}

export default function OrderDetailsList({
  orderDetails,
  editingDetail,
  setEditingDetail,
  handleUpdateLocalDetail,
  handleDeleteLocalDetail,
  handleFinishEditing
}: OrderDetailsListProps) {
  if (orderDetails.length === 0) {
    return <p className="text-gray-500">Brak elementów w tym zamówieniu</p>
  }

  return (
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
        {orderDetails.map((detail) => (
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
  )
} 