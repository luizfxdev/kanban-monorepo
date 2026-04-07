"use client";

import { useState } from "react";
import { Task, CreateTaskInput } from "@/types/task";

const TAGS = [
  { label: "Backend",    color: "emerald" },
  { label: "Frontend",   color: "sky" },
  { label: "API",        color: "violet" },
  { label: "QA",         color: "amber" },
  { label: "DevOps",     color: "rose" },
  { label: "Design",     color: "pink" },
];

interface Props {
  onClose: () => void;
  onSave: (data: CreateTaskInput) => Promise<void>;
  editTask?: Task | null;
  defaultStatus: Task["status"];
}

export default function AddCardModal({ onClose, onSave, editTask, defaultStatus }: Props) {
  const [title,       setTitle]       = useState(editTask?.title ?? "");
  const [description, setDescription] = useState(editTask?.description ?? "");
  const [status,      setStatus]      = useState<Task["status"]>(editTask?.status ?? defaultStatus);
  const [tag,         setTag]         = useState(editTask?.tag ?? "");
  const [tagColor,    setTagColor]    = useState(editTask?.tag_color ?? "");
  const [saving,      setSaving]      = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || saving) return;
    setSaving(true);
    await onSave({ title: title.trim(), description, status, tag, tag_color: tagColor });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl"
        style={{ background: "#12122a" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{editTask ? "Editar card" : "Novo card"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Título *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Nome da tarefa..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes opcionais..."
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-all"
              >
                <option value="pendentes">Pendentes</option>
                <option value="concluidas">Concluídas</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Tag</label>
              <select
                value={tag}
                onChange={(e) => {
                  const opt = TAGS.find((t) => t.label === e.target.value);
                  setTag(e.target.value);
                  setTagColor(opt?.color ?? "");
                }}
                className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-all"
              >
                <option value="">Sem tag</option>
                {TAGS.map((t) => (
                  <option key={t.label} value={t.label}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || saving}
            className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {saving ? "Salvando..." : editTask ? "Salvar" : "Criar card"}
          </button>
        </div>
      </div>
    </div>
  );
}