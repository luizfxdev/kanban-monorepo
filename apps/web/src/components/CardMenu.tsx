"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/types/task";

interface Props {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CardMenu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <i className="bi bi-three-dots-vertical text-sm" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-36 rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <i className="bi bi-pencil text-violet-400" />Editar
          </button>
          <div className="h-px bg-white/5" />
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <i className="bi bi-trash text-rose-400" />Deletar
          </button>
        </div>
      )}
    </div>
  );
}