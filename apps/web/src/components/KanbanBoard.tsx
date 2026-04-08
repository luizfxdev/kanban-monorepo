"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/store/useTaskStore";
import KanbanColumn from "./KanbanColumn";
import AddCardModal from "./AddCardModal";

type ColumnStatus = "total" | Task["status"];
const COLUMNS: ColumnStatus[] = ["total", "pendentes", "concluidas"];

export default function KanbanBoard() {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleLike, moveTask } = useTaskStore();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; status: Task["status"]; editTask?: Task | null }>({
    open: false,
    status: "pendentes",
  });

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const getByStatus = (status: ColumnStatus) =>
    status === "total" ? tasks : tasks.filter((t) => t.status === status);

  const counts = {
    total: tasks.length,
    pendentes: tasks.filter((t) => t.status === "pendentes").length,
    concluidas: tasks.filter((t) => t.status === "concluidas").length,
  };

  const handleDrop = (targetStatus: ColumnStatus) => {
    if (draggingId && targetStatus !== "total") moveTask(draggingId, targetStatus);
    setDraggingId(null);
  };

  const openAdd  = (status: Task["status"]) => setModal({ open: true, status, editTask: null });
  const openEdit = (task: Task) => setModal({ open: true, status: task.status, editTask: task });
  const closeModal = () => setModal((m) => ({ ...m, open: false, editTask: null }));

  const handleSave = async (data: Parameters<typeof createTask>[0]) => {
    if (modal.editTask) {
      await updateTask(modal.editTask.id, data);
    } else {
      await createTask(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080818" }}>
        <span className="text-slate-400 text-sm">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#080818" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #d97706 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-medium">
              <i className="bi bi-kanban mr-2" />Task Manager
            </p>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Kanban{" "}
              <span style={{ background: "linear-gradient(135deg, #7c3aed, #4cc9a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Board
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/8 text-sm" style={{ background: "rgba(14,14,32,0.8)" }}>
              <span className="text-slate-400"><span className="text-white font-semibold">{counts.total}</span> total</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-amber-400"><span className="font-semibold">{counts.pendentes}</span> pendentes</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-emerald-400"><span className="font-semibold">{counts.concluidas}</span> concluídas</span>
            </div>
            <button
              onClick={() => openAdd("pendentes")}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <i className="bi bi-plus-lg" />Novo card
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Progresso geral</span>
            <span>{counts.total > 0 ? Math.round((counts.concluidas / counts.total) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${counts.total > 0 ? (counts.concluidas / counts.total) * 100 : 0}%`,
                background: "linear-gradient(90deg, #7c3aed, #4cc9a0)",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getByStatus(status)}
              draggingId={draggingId}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
              onDrop={handleDrop}
              onLike={toggleLike}
              onEdit={openEdit}
              onDelete={deleteTask}
              onAddCard={openAdd}
            />
          ))}
        </div>
      </div>

      {modal.open && (
        <AddCardModal
          onClose={closeModal}
          onSave={handleSave}
          editTask={modal.editTask}
          defaultStatus={modal.status}
        />
      )}
    </div>
  );
}