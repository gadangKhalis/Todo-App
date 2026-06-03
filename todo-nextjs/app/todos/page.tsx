"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/lib/todoApi";
import { logoutUser, getMe } from "@/lib/authApi";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import { useToast } from "./hooks/useToast";
import Toast from "./components/Toast";
import PremiumBadge from "./components/PremiumBadge";
import AIButton from "./components/AIButton";
import UpgradeModal from "./components/UpgradeModal";
import SearchBar from "./components/SearchBar";
import FilterTabs from "./components/FilterTabs";

interface Todo {
  id: number | string;
  title: string;
  done: boolean;
  parentId: number | null;
  children: Todo[];
  dueDate: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

// add child to todo (recursive)
function addChildToTodo(todos: Todo[], parentId: number, child: Todo): Todo[] {
  return todos.map((todo) => {
    if (todo.id === parentId) {
      return { ...todo, children: [...todo.children, child] };
    }
    if (todo.children?.length > 0) {
      return {
        ...todo,
        children: addChildToTodo(todo.children, parentId, child),
      };
    }
    return todo;
  });
}

// exchange tempId with real data from server (recursive)
function replaceChildInTodo(
  todos: Todo[],
  tempId: string | number,
  realTodo: Todo,
): Todo[] {
  return todos.map((todo) => {
    if (todo.id === tempId) return realTodo;
    if (todo.children?.length > 0) {
      return {
        ...todo,
        children: replaceChildInTodo(todo.children, tempId, realTodo),
      };
    }
    return todo;
  });
}

// delete todo from children (rollback, rekursif)
function removeChildFromTodo(todos: Todo[], id: string | number): Todo[] {
  return todos
    .filter((todo) => todo.id !== id)
    .map((todo) => ({
      ...todo,
      children: removeChildFromTodo(todo.children ?? [], id),
    }));
}

function toggleInTree(
  todos: Todo[],
  id: number | string,
  data: { done?: boolean; title?: string },
): Todo[] {
  return todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, ...data };
    }
    if (todo.children?.length > 0) {
      return {
        ...todo,
        children: toggleInTree(todo.children, id, data),
      };
    }
    return todo;
  });
}

function filterTree(todos: Todo[], query: string, filter: string): Todo[] {
  return todos.reduce<Todo[]>((acc, todo) => {
    const filteredChildren = filterTree(todo.children ?? [], query, filter);

    const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "done" && todo.done) ||
      (filter === "active" && !todo.done);

    const shouldShow =
      (matchesQuery && matchesFilter) || filteredChildren.length > 0;
    if (shouldShow) {
      acc.push({ ...todo, children: filteredChildren });
    }
    return acc;
  }, []);
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ready, setReady] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loadingMe, setLoadingMe] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
        setReady(true); //auth success, show UI
      } catch (err: any) {
        // If 401 Unauthorized/expired, push to login
        if (err.response?.status === 401) {
          router.push("/auth/login");
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMe();
        setIsPremium(me.isPremium);
      } catch {
        setIsPremium(false);
      } finally {
        setLoadingMe(false);
      }
    };
    fetchMe();
  }, []);

  if (!ready) return <p>Loading...</p>;

  const handleCreate = async (
    title: string,
    parentId: number | null,
    dueDate?: string | null,
    priority?: string | null,
  ) => {
    //prevent double submit
    if (isCreating) return;
    setIsCreating(true);

    //create temp todo
    const tempTodo: Todo = {
      id: `temp-${Date.now()}`,
      title,
      done: false,
      parentId: parentId ?? null,
      children: [],
      dueDate: dueDate ?? null,
      priority: priority ?? null,
    };
    if (parentId) {
      setTodos((prev) => addChildToTodo(prev, parentId, tempTodo));
    } else {
      //display immediately
      setTodos((prev) => [...prev, tempTodo]);
    }
    try {
      const realTodo = await createTodo(title, parentId, dueDate, priority);
      if (parentId) {
        setTodos((prev) => replaceChildInTodo(prev, tempTodo.id, realTodo));
      } else {
        // change tempId to realID
        setTodos((prev) =>
          prev.map((t) => (t.id === tempTodo.id ? realTodo : t)),
        );
      }
    } catch (err: any) {
      if (parentId) {
        setTodos((prev) => removeChildFromTodo(prev, tempTodo.id));
      } else {
        // rollback, delete fake todo
        setTodos((prev) => prev.filter((t) => t.id !== tempTodo.id));
      }
      showToast("Failed to create todo", "error");
      console.error("Failed to create todo:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (
    id: number | string,
    data: { done?: boolean; title?: string },
  ) => {
    // save snapshot
    const previousState = todos;
    setUpdatingId(id);
    // update data immediately
    setTodos((prev) => toggleInTree(prev, id, data));
    try {
      // send to server, sync with real data
      const updated = await updateTodo(id as number, data);
      setTodos((prev) => toggleInTree(prev, id, updated));
    } catch (err: any) {
      //Rollback if fail
      setTodos(previousState);
      showToast("Failed to update todo:", "error");
      console.error("Failed to update todo:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number | string) => {
    const previousState = todos;
    setDeletingId(id as number);
    setTodos((prev) => removeChildFromTodo(prev, id));

    try {
      await deleteTodo(id as number);
    } catch (err: any) {
      if (err.response?.status === 404) return;
      setTodos(previousState);
      showToast("Failed to delete todo", "error");
      console.error("Failed to delete todo:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth/login");
  };

  const displayedTodos = filterTree(todos, searchQuery, activeFilter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Todo List </h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <TodoForm
        onSubmit={(title, dueDate, priority) =>
          handleCreate(title, null, dueDate, priority)
        }
        isCreating={isCreating}
        className={styles.inputGroup}
      />

      {!loadingMe && (
        <div className={styles.premiumBar}>
          <PremiumBadge isPremium={isPremium} />
          <AIButton
            isPremium={isPremium}
            onLocked={() => setShowUpgrade(true)}
          />
        </div>
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <div className={styles.searchFilterRow}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterTabs active={activeFilter} onChange={setActiveFilter} />
      </div>

      {displayedTodos.length === 0 && (
        <p className={styles.emptyState}>
          {searchQuery
            ? `No todo with word "${searchQuery}"`
            : "No todo in this category"}
        </p>
      )}

      <ul className={styles.list}>
        {displayedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onChanged={(id, data) => handleUpdate(id, data)}
            onDeleted={(id) => handleDelete(id)}
            onSubtaskCreated={(parentId, title) =>
              handleCreate(title, parentId)
            }
            isDeleting={deletingId === todo.id}
            isUpdating={updatingId === todo.id}
          />
        ))}
      </ul>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
