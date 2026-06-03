"use client";
import { useState, useRef } from "react";
import styles from "./TodoItem.module.css";
import { spawn } from "child_process";

interface Todo {
  id: number | string;
  title: string;
  done: boolean;
  parentId: number | null;
  children: Todo[];
}

function isOverdue(dueDate: string | null, done: boolean): boolean {
  if (!dueDate || done) return false;
  return new Date(dueDate) < new Date();
}

function formatDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

const PRIORITY_CONFIG = {
  LOW: { label: "Low", color: "#16a34a" },
  MEDIUM: { label: "Medium", color: "#d97706" },
  HIGH: { label: "High", color: "#dc2626" },
};

export default function TodoItem({
  todo,
  onChanged,
  onDeleted,
  onSubtaskCreated,
  isDeleting,
  isUpdating,
  depth = 0,
}: {
  todo: Todo;
  onChanged: (id: number | string, data: { done?: boolean }) => void;
  onDeleted: (id: number | string) => void;
  onSubtaskCreated: (parentId: number, title: string) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
  depth?: number;
}) {
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const isLoading = isDeleting || isUpdating;
  const textClass = [styles.text, todo.done ? styles.textDone : ""].join(" ");
  const maxDepthReached = depth >= 2;
  const childCount = todo.children?.length ?? 0;

  const handleSubtaskSubmit = () => {
    if (subtaskTitle.trim() === "") return;
    onSubtaskCreated(todo.id as number, subtaskTitle);
    setSubtaskTitle("");
    setShowSubtaskForm(false);
    subtaskInputRef.current?.focus();
  };

  return (
    <li
      className={`${styles.item} ${isLoading ? styles.itemLoading : ""}`}
      style={{ marginLeft: depth * 24 }}
    >
      <div className={styles.todoMeta}>
        {todo.priority && (
          <span
            className={styles.priorityBadge}
            style={{ color: PRIORITY_CONFIG[todo.priority].color }}
          >
            ● {PRIORITY_CONFIG[todo.priority].label}
          </span>
        )}
        {todo.dueDate && (
          <span
            className={`${styles.dueDate} ${isOverdue(todo.dueDate, todo.done) ? styles.overdue : ""}`}
          >
            📅 {formatDate(todo.dueDate)}
            {isOverdue(todo.dueDate, todo.done) && "(Late)"}
          </span>
        )}
      </div>
      {/* Main Row */}
      <div className={styles.row}>
        {/* collapse/expand button */}
        {childCount > 0 ? (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={styles.expandButton}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <span className={styles.expandPlaceholder} />
        )}

        <span
          onClick={() => onChanged(todo.id, { done: !todo.done })}
          className={textClass}
        >
          {todo.done ? "✅" : "⬜"} {todo.title}
        </span>
        <div className={styles.actions}>
          {childCount > 0 && (
            <span className={styles.childCOunt}>{childCount} Subtask</span>
          )}

          {!maxDepthReached && (
            <button
              onClick={() => setShowSubtaskForm((prev) => !prev)}
              className={styles.subtaskButton}
            >
              {showSubtaskForm ? "Cancel" : "+ Subtask"}
            </button>
          )}
          <button
            onClick={() => onDeleted(todo.id)}
            disabled={isDeleting}
            className={styles.deleteButton}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Add Subtask Form */}
      {showSubtaskForm && (
        <div className={styles.subtaskForm}>
          <input
            ref={subtaskInputRef}
            type="text"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            placeholder="Add Subtask..."
            className={styles.subtaskInput}
            onKeyDown={(e) => e.key === "Enter" && handleSubtaskSubmit()}
            autoFocus
          />
          <button
            onClick={handleSubtaskSubmit}
            className={styles.subtaskSubmit}
          >
            Add
          </button>
        </div>
      )}
      {isExpanded && todo.children && todo.children.length > 0 && (
        <ul className={styles.childList}>
          {todo.children.map((child) => (
            <TodoItem
              key={child.id}
              todo={child}
              onChanged={() => onChanged(child.id, { done: !child.done })}
              onDeleted={() => onDeleted(child.id)}
              onSubtaskCreated={onSubtaskCreated}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
