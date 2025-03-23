import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Order {
  id: number
  name: string
}

// Pobieranie wszystkich zamówień
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Błąd podczas pobierania zamówień: ${error.message}`)
  }

  return data
}

// Dodawanie nowego zamówienia
export async function addOrder(name: string) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ name }])
    .select()

  if (error) {
    throw new Error(`Błąd podczas dodawania zamówienia: ${error.message}`)
  }

  return data[0]
}

// Aktualizacja zamówienia
export async function updateOrder(id: number, name: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ name })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(`Błąd podczas aktualizacji zamówienia: ${error.message}`)
  }

  return data[0]
}

// Usuwanie zamówienia
export async function deleteOrder(id: number) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Błąd podczas usuwania zamówienia: ${error.message}`)
  }
} 