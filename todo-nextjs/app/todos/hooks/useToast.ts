import { useState } from "react";

export interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastItem["type"] = "error") => {
    const id = Date.now();

    // add new toast to array
    setToasts((prev) => [...prev, { id, message, type }]);

    // auto dismiss after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return { toasts, showToast, removeToast };
}
