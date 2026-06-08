"use client";

import styles from "./TodoForm.module.css";
import { useState, useRef } from "react";

interface TodoFormProps {
  onSubmit: (
    title: string,
    dueDate: string | null,
    priority: string | null,
  ) => void;
  isCreating: boolean;
  placeholder?: string;
  className?: string;
}

export default function TodoForm({
  onSubmit,
  isCreating,
  placeholder,
  className,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), dueDate || null, priority || null);
    setTitle("");
    setDueDate("");
    setPriority("");
  };

  return (
    <div className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={"Add Todo...."}
        disabled={isCreating}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        disabled={isCreating}
        className={styles.dateInput}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        disabled={isCreating}
        className={styles.prioritySelect}
      >
        <option value="">Prioritas</option>
        <option value="LOW">🟢 Low</option>
        <option value="MEDIUM">🟡 Medium</option>
        <option value="HIGH">🔴 High</option>
      </select>
      <button onClick={handleSubmit} disabled={isCreating}>
        {isCreating ? "..." : "tambah"}
      </button>
    </div>
  );
}
