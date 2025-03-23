import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Sprawdzenie, czy zmienne środowiskowe są dostępne
if (!supabaseUrl || !supabaseKey) {
  console.error("Brak wymaganych zmiennych środowiskowych Supabase dla modułu orderDetails.ts");
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

export interface OrderDetail {
  id: number
  identity_number: string
  index: number
  quantity: number
  order_id: number
}

// Pobieranie wszystkich szczegółów dla danego zamówienia
export async function getOrderDetails(orderId: number) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Brak konfiguracji Supabase. Wymagane: NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const { data, error } = await supabase
    .from('order_details')
    .select('*')
    .eq('order_id', orderId)
    .order('index', { ascending: true })

  if (error) {
    throw new Error(`Błąd podczas pobierania szczegółów zamówienia: ${error.message}`)
  }

  return data || []
}

// Dodawanie nowego szczegółu zamówienia
export async function addOrderDetail(orderDetail: Omit<OrderDetail, 'id'>) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Brak konfiguracji Supabase. Wymagane: NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const { data, error } = await supabase
    .from('order_details')
    .insert([orderDetail])
    .select()

  if (error) {
    throw new Error(`Błąd podczas dodawania szczegółów zamówienia: ${error.message}`)
  }

  return data[0]
}

// Aktualizacja szczegółu zamówienia
export async function updateOrderDetail(id: number, orderDetail: Partial<Omit<OrderDetail, 'id'>>) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Brak konfiguracji Supabase. Wymagane: NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const { data, error } = await supabase
    .from('order_details')
    .update(orderDetail)
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(`Błąd podczas aktualizacji szczegółów zamówienia: ${error.message}`)
  }

  return data[0]
}

// Usuwanie szczegółu zamówienia
export async function deleteOrderDetail(id: number) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Brak konfiguracji Supabase. Wymagane: NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const { error } = await supabase
    .from('order_details')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Błąd podczas usuwania szczegółu zamówienia: ${error.message}`)
  }
} 