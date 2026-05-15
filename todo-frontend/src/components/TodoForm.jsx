import { useState } from "react";

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("1. handleSubmit called, title:", title); // ← tambah

    if (title.trim() === "") return;
    onSubmit(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new Todo..."
        style={{ padding: "8px", marginRight: "8px", width: "300px" }}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;
