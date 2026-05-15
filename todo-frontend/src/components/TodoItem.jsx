function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ marginBottom: "10px" }}>
      <span
        onClick={() => onToggle(todo.id, !todo.done)}
        style={{
          textDecoration: todo.done ? "line-through" : "none",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        {todo.done ? "✅" : "⬜"} {todo.title}
      </span>
      <button onClick={() => onDelete(todo.id)}> Delete</button>
    </li>
  );
}
export default TodoItem;
