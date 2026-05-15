import { useEffect, useState } from "react";
import todoApi from "./api/todoApi";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title) => {
    try {
      const newTodo = await todoApi.createTodo(title);
      setTodos([...todos, newTodo]);
    } catch (err) {
      alert("Failed to create todo: " + err.message);
    }
  };

  const handleToggle = async (id, done) => {
    try {
      const updated = await todoApi.updateTodo(id, { done });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert("Failed to update todo: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete todo: " + err.message);
    }
  };

  if (loading) return <p>Loading ....</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1> Todo List</h1>
      <TodoForm onSubmit={handleCreate} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}

export default App;
