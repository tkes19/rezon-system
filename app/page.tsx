import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Promise<Message> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Jeśli użytkownik jest zalogowany, przekieruj go na stronę zamówień
  if (user) {
    return redirect("/orders");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto">
      <div className="w-full p-6 bg-white/5 rounded-xl shadow-lg backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Rezon System</h1>
        <form className="flex-1 flex flex-col w-full">
          <div className="flex flex-col gap-2 [&>input]:mb-3">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Hasło</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Twoje hasło"
              required
            />
            <SubmitButton pendingText="Logowanie..." formAction={signInAction}>
              Zaloguj się
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
          <p className="mt-4 text-sm text-center">
            Nie masz konta?{" "}
            <Link className="text-foreground font-medium underline" href="/sign-up">
              Zarejestruj się
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
