import { useImperativeHandle, useState, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";

export type SidebarHandle = {
  open: () => void;
  close: () => void;
};

interface Props {
  children: ReactNode;
  ref: Ref<SidebarHandle>;
}

export function Sidebar({ children, ref }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => handleClose(),
  }));

  function handleClose() {
    setTimeout(() => setIsOpen(false), 300);
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-99999 grid grid-cols-1 grid-rows-1 *:col-span-full *:row-span-full">
      <div
        onMouseDown={() => handleClose()}
        className={`fixed inset-0 z-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-filter-title"
        className={`pointer-events-auto z-1 ml-auto flex h-full w-full max-w-md flex-col border-l border-white/10 bg-slate-950 text-white shadow-2xl transition ${
          isOpen ? "" : "translate-x-full"
        }`}
      >
        {children}
      </aside>
    </div>,
    document.body,
  );
}
