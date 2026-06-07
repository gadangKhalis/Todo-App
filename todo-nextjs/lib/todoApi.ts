import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export const getTodos = async () => {
  const res = await api.get("/todos");
  return res.data;
};

export const createTodo = async (
  title: string,
  parentId?: number | null,
  dueDate?: string | null,
  priority?: string | null,
) => {
  const res = await api.post("/todos", { title, parentId, dueDate, priority });
  return res.data;
};

export const updateTodo = async (
  id: number,
  data: {
    title?: string;
    done?: boolean;
    dueDate?: string | null;
    priority?: string | null;
  },
) => {
  const res = await api.patch(`/todos/${id}`, data);
  return res.data;
};

export const deleteTodo = async (id: number) => {
  const res = await api.delete(`/todos/${id}`);
  return res.data;
};
