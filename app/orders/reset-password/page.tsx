import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Jeśli użytkownik nie jest zalogowany, przekieruj go na stronę główną
  if (!user) {
    return redirect("/");
  }
  
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Resetuj hasło</h1>
      <p className="text-sm text-foreground/60">
        Wprowadź nowe hasło poniżej.
      </p>
      <Label htmlFor="password">Nowe hasło</Label>
      <Input
        type="password"
        name="password"
        placeholder="Nowe hasło"
        required
      />
      <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Potwierdź hasło"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Resetuj hasło
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
} 