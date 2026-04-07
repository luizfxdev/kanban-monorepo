"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

type ColumnStatus = "total" | Task["status"];

const CONFIG: Record<ColumnStatus, { label: string; icon: string; accent: string; headerBg: string; countBg: string }> = {
  total:     { label: "Total",      icon: "bi-layers",        accent: "border-slate-500/30",   headerBg: "from-slate-500/10",   countBg: "bg-slate-500/20 text-slate-300" },
  pendentes: { label: "Pendentes",  icon: "bi-hourglass-split", accent: "border-amber-500/30", headerBg: "from-amber-500/10",   countBg: "bg-amber-500/20 text-amber-300" },
  concluidas:{ label: "Concluídas", icon: "bi-check2-circle", accent: "border-emerald-500/30", headerBg: "from-emerald-500/10", countBg: "bg-emerald-500/20 text-emerald-300" },
};

interface Props {
  status: ColumnStatus;
  tasks: Task[];
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (status: ColumnStatus) => void;
  onLike: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddCard: (status: Task["status"]) => void;
}

export default function KanbanColumn({ status, tasks, draggingId, onDragStart, onDragEnd, onDrop, onLike, onEdit, onDelete, onAddCard }: Props) {
  const [isOver, setIsOver] = useState(false);
  const cfg = CONFIG[status];
  const iconColor = status === "pendentes" ? "text-amber-400" : status === "concluidas" ? "text-emerald-400" : "text-slate-400";

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => { setIsOver(false); onDrop(status); }}
      className={`flex flex-col rounded-2xl border transition-all duration-200 ${cfg.accent} ${isOver ? "scale-[1.01] border-violet-500/50 shadow-lg shadow-violet-500/10" : ""}`}
      style={{ background: "rgba(14,14,32,0.8)", minHeight: 480 }}
    >
      <div className={`bg-gradient-to-b ${cfg.headerBg} to-transparent rounded-t-2xl px-4 pt-4 pb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <i className={`bi ${cfg.icon} text-base ${iconColor}`} />
            <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">{cfg.label}</span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.countBg}`}>{tasks.length}</span>
        </div>
      </div>

      <div className="h-px bg-white/5 mx-4" />

      <div className="flex-1 flex flex-col gap-2.5 p-3 overflow-y-auto">
        {tasks.length === 0 && (
          <div className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all ${isOver ? "border-violet-500/40 bg-violet-500/5" : "border-white/5"}`}>
            <i className="bi bi-inbox text-2xl text-slate-700" />
            <span className="text-xs text-slate-600">{isOver ? "Soltar aqui" : "Sem cards"}</span>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnStatus={status}
            isDragging={draggingId === task.id}
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
            onLike={() => onLike(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        ))}

        {tasks.length > 0 && isOver && (
          <div className="h-16 rounded-xl border-2 border-dashed border-violet-500/40 bg-violet-500/5 flex items-center justify-center">
            <span className="text-xs text-violet-400">Soltar aqui</span>
          </div>
        )}
      </div>

      {status !== "total" && (
        <div className="p-3 pt-0">
          <button
            onClick={() => onAddCard(status)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/8 text-slate-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm"
          >
            <i className="bi bi-plus text-lg" />Adicionar card
          </button>
        </div>
      )}
    </div>
  );
}