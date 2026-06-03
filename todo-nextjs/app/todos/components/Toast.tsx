"use client";

import styles from "./Toast.module.css";
import { ToastItem } from "../hooks/useToast";

const ICONS = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
};

export default function Toast({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.icon}>{ICONS[toast.type]}</span>
          <span className={styles.message}>{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className={styles.close}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}
