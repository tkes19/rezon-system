import OrdersManager from '@/components/OrdersManager'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Jeśli użytkownik nie jest zalogowany, przekieruj go na stronę główną
  if (!user) {
    return redirect("/");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">System zarządzania zamówieniami</h1>
      <OrdersManager />
    </div>
  )
} 