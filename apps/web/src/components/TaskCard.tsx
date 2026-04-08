"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import CardMenu from "./CardMenu";

const TAG_STYLES: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  sky:     "bg-sky-500/15 text-sky-400 border-sky-500/20",
  violet:  "bg-violet-500/15 text-violet-400 border-violet-500/20",
  amber:   "bg-amber-500/15 text-amber-400 border-amber-500/20",
  rose:    "bg-rose-500/15 text-rose-400 border-rose-500/20",
  pink:    "bg-pink-500/15 text-pink-400 border-pink-500/20",
};

interface Props {
  task: Task;
  columnStatus: string;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, isDragging, onDragStart, onDragEnd, onLike, onEdit, onDelete }: Props) {
  const [likeAnim, setLikeAnim] = useState(false);

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    onLike();
  };

  const tagStyle = task.tag_color ? TAG_STYLES[task.tag_color] ?? TAG_STYLES.violet : "";
  const date = new Date(task.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative rounded-2xl border border-white/8 p-4 cursor-grab active:cursor-grabbing transition-all duration-200 select-none ${isDragging ? "opacity-40 scale-95 rotate-1" : "hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"}`}
      style={{ background: "rgba(18,18,42,0.95)" }}
    >
      <div className={`absolute top-3 left-4 w-1 h-1 rounded-full ${task.status === "concluidas" ? "bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" : "bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.4)]"}`} />

      <div className="flex items-start justify-between gap-2 mb-2 pl-3">
        <h3 className={`text-sm font-medium leading-snug text-white/90 ${task.status === "concluidas" ? "line-through text-white/40" : ""}`}>
          {task.title}
        </h3>
        <CardMenu task={task} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed mb-3 pl-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between pl-3 mt-3">
        <div className="flex items-center gap-2">
          {task.tag && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tagStyle}`}>{task.tag}</span>
          )}
          <span className="text-[10px] text-slate-600">{date}</span>
        </div>

        <button onClick={handleLike} className="flex items-center gap-1.5 group/like">
          <span className={`text-base transition-all duration-300 ${likeAnim ? "scale-150" : "scale-100"} ${task.liked ? "" : "grayscale opacity-50 group-hover/like:opacity-100 group-hover/like:grayscale-0"}`}>
            {task.liked ? "❤️" : "🤍"}
          </span>
          <span className={`text-xs font-medium transition-colors ${task.liked ? "text-rose-400" : "text-slate-600 group-hover/like:text-slate-400"}`}>
            {task.likes}
          </span>
        </button>
      </div>
    </div>
  );
}