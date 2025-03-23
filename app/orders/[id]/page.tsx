import OrderDetailsManager from '@/components/OrderDetailsManager'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// @ts-ignore - Ignorowanie błędów typowania z Next.js 15.2.3
export default async function OrderPage({ 
  params, 
  searchParams 
}: { 
  params: any, 
  searchParams: any 
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Jeśli użytkownik nie jest zalogowany, przekieruj go na stronę główną
  if (!user) {
    return redirect("/");
  }

  const orderId = parseInt(params.id)

  return (
    <div>
      <OrderDetailsManager orderId={orderId} />
    </div>
  )
} 