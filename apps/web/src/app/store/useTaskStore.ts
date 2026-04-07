"use client";

import { create } from "zustand";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";

const API = "/api";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  moveTask: (id: string, status: Task["status"]) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    const res = await fetch(`${API}/tasks`);
    const tasks: Task[] = await res.json();
    set({ tasks, loading: false });
  },

  createTask: async (input) => {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const task: Task = await res.json();
    set((s) => ({ tasks: [task, ...s.tasks] }));
  },

  updateTask: async (id, input) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const updated: Task = await res.json();
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
  },

  deleteTask: async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  toggleLike: async (id) => {
    const res = await fetch(`${API}/tasks/${id}/like`, { method: "PATCH" });
    const updated: Task = await res.json();
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
  },

  moveTask: async (id, status) => {
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
    await get().updateTask(id, { status });
  },
}));