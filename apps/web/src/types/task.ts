export type Status = "pendentes" | "concluidas";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  liked: boolean;
  likes: number;
  tag?: string;
  tag_color?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: Status;
  tag?: string;
  tag_color?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: Status;
  tag?: string;
  tag_color?: string;
}