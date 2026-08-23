import { useState } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

/** Campo de senha com botão para mostrar/ocultar o texto digitado. */
export function PasswordInput({ label, className, ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
        {label}
      </span>
      <div className="relative">
        <input
          {...rest}
          type={visible ? "text" : "password"}
          className={
            className ??
            "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest pl-md pr-12 outline-none focus:border-primary"
          }
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined !text-[20px]">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </label>
  );
}
