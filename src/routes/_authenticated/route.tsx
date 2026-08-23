import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { StoreProvider } from "../../lib/store";
import { DueRemindersWatcher } from "../../components/reminder-settings";
import { needsPasswordSetup } from "../../lib/password-setup";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    if (needsPasswordSetup(data.user)) throw redirect({ to: "/definir-senha" });
    return { user: data.user };
  },

  component: () => (
    <StoreProvider>
      <DueRemindersWatcher />
      <Outlet />
    </StoreProvider>
  ),
});
