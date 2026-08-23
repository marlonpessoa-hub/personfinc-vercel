import type { User } from "@supabase/supabase-js";

/**
 * Contas criadas por login social (Google) não têm senha própria.
 * Retorna true quando o usuário ainda precisa definir uma senha no app.
 */
export function needsPasswordSetup(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.user_metadata?.["password_set"] === true) return false;
  const identities = user.identities ?? [];
  if (identities.length === 0) return false;
  const hasEmailIdentity = identities.some((i) => i.provider === "email");
  if (hasEmailIdentity) return false;
  return identities.some((i) => i.provider !== "email");
}
