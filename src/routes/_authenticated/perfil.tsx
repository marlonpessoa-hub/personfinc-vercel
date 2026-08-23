import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "../../components/app-shell";
import { ActivationCard } from "../../components/access-gate";
import { ThemeToggleRow } from "../../components/theme-toggle";
import { LanguageRow } from "../../components/language-selector";
import { useI18n } from "../../lib/i18n";
import { useStore } from "../../lib/store";
import { fileToAvatarDataUrl, googleAvatarFrom } from "../../lib/avatar";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — PersonFinc" },
      { name: "description", content: "Gerencie sua conta e preferências." },
      { property: "og:title", content: "Perfil — PersonFinc" },
      { property: "og:description", content: "Sua conta e preferências no PersonFinc." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [googleAvatar, setGoogleAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftAvatar, setDraftAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [titheEnabled, setTitheEnabled] = useState(true);
  const pickRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useStore();
  const { t } = useI18n();


  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);
      setEmail(data.user.email ?? "");
      const social = googleAvatarFrom(data.user.user_metadata);
      setGoogleAvatar(social);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, tithe_enabled")
        .eq("id", data.user.id)
        .maybeSingle();
      setName(
        profile?.full_name ??
          (data.user.user_metadata?.full_name as string | undefined) ??
          "Minha conta",
      );
      setAvatar(profile?.avatar_url ?? social);
      setTitheEnabled(profile?.tithe_enabled ?? true);
    })();
  }, []);

  function startEdit() {
    setDraftName(name);
    setDraftAvatar(avatar);
    setEditing(true);
  }

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
    try {
      setDraftAvatar(await fileToAvatarDataUrl(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível usar essa imagem");
    }
  }

  async function saveProfile() {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: draftName.trim() || null, avatar_url: draftAvatar })
        .eq("id", userId);
      if (error) throw error;
      setName(draftName.trim() || "Minha conta");
      setAvatar(draftAvatar);
      setEditing(false);
      toast.success("Perfil atualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar o perfil");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate({ to: "/login", replace: true });
  }

  const shown = editing ? draftAvatar : avatar;

  async function toggleTithe() {
    if (!userId) return;
    const next = !titheEnabled;
    const { error } = await supabase
      .from("profiles")
      .update({ tithe_enabled: next })
      .eq("id", userId);
    if (error) {
      toast.error("Não foi possível alterar o dízimo");
      return;
    }
    setTitheEnabled(next);
    toast.success(next ? "Dízimo ativado" : "Dízimo desativado");
  }

  return (
    <AppShell title="Perfil">
      <div className="max-w-2xl mx-auto space-y-lg">
        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow space-y-md">
          <div className="relative flex flex-col items-center text-center gap-md">
            <button
              onClick={startEdit}
              className="absolute top-0 right-0 p-2 rounded-full text-primary hover:bg-surface-container-low"
              aria-label="Editar perfil"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              {shown ? (
                <img src={shown} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined !text-[40px]">person</span>
              )}
            </div>
            <div className="w-full">
              {editing ? (
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full h-11 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary text-center"
                />
              ) : (
                <h1 className="font-headline-md text-headline-md text-primary break-words">{name}</h1>
              )}
              <p
                title={email}
                className="font-body-sm text-body-sm text-on-surface-variant break-words mt-0.5"
              >
                {email}
              </p>
            </div>
          </div>

          {editing && (
            <div className="space-y-md">
              <input
                ref={pickRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              <div className="flex flex-wrap gap-sm">
                <button
                  onClick={() => pickRef.current?.click()}
                  className="h-10 px-md rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined !text-[18px] align-middle mr-xs">image</span>
                  Escolher foto
                </button>
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="h-10 px-md rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low md:hidden"
                >
                  <span className="material-symbols-outlined !text-[18px] align-middle mr-xs">photo_camera</span>
                  Tirar foto
                </button>
                {googleAvatar && (
                  <button
                    onClick={() => setDraftAvatar(googleAvatar)}
                    className="h-10 px-md rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low"
                  >
                    <span className="material-symbols-outlined !text-[18px] align-middle mr-xs">account_circle</span>
                    Usar foto do Google
                  </button>
                )}
                {draftAvatar && (
                  <button
                    onClick={() => setDraftAvatar(null)}
                    className="h-10 px-md rounded-full border border-error text-error font-label-md text-label-md hover:bg-error-container"
                  >
                    Remover foto
                  </button>
                )}
              </div>
              <div className="flex gap-sm">
                <button
                  onClick={() => void saveProfile()}
                  disabled={saving}
                  className="flex-1 h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 h-11 rounded-full border border-outline text-primary font-label-md text-label-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>


        <ActivationCard />

        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-md p-md rounded-xl bg-surface-container-lowest border border-outline-variant card-shadow hover:bg-surface-container-low"
          >
            <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined">key</span>
            </span>
            <span className="flex-1 font-body-lg text-body-lg text-primary">
              {t("profile.adminKeys")}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </Link>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
          <Link
            to="/categorias"
            className="flex items-center gap-md p-md border-b border-outline-variant/60 hover:bg-surface-container-low"
          >
            <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">category</span>
            </span>
            <span className="flex-1 font-body-lg text-body-lg text-primary">{t("profile.categories")}</span>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </Link>
          <ProfileItem icon="notifications" label={t("profile.notifications")} />
          <ThemeToggleRow />
          <LanguageRow />
          <ProfileItem icon="security" label={t("profile.security")} />
          <div className="flex items-center gap-md p-md border-b last:border-b-0 border-outline-variant/60 hover:bg-surface-container-low">
            <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">church</span>
            </span>
            <span className="flex-1 font-body-lg text-body-lg text-primary">{t("profile.tithe")}</span>
            <button
              onClick={() => void toggleTithe()}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${titheEnabled ? "bg-secondary" : "bg-surface-variant"}`}
              aria-label={titheEnabled ? "Desativar dízimo" : "Ativar dízimo"}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-on-secondary transition-transform ${titheEnabled ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
          <ProfileItem icon="download" label={t("profile.export")} />
          <ProfileItem icon="help" label={t("profile.help")} />
        </div>


        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-full border border-error text-error font-label-md text-label-md hover:bg-error-container"
        >
          <span className="material-symbols-outlined !text-[18px] align-middle mr-sm">logout</span>
          {t("profile.signOut")}
        </button>

        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
          PersonFinc v1.0
        </p>
      </div>
    </AppShell>
  );
}

function ProfileItem({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <button className="w-full flex items-center gap-md p-md border-b last:border-b-0 border-outline-variant/60 hover:bg-surface-container-low text-left">
      <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </span>
      <span className="flex-1 font-body-lg text-body-lg text-primary">{label}</span>
      {value && <span className="font-body-sm text-body-sm text-on-surface-variant">{value}</span>}
      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
    </button>
  );
}
