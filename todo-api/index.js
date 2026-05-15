const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let todos = [
  { id: 1, title: "Belajar Express", done: false },
  { id: 2, title: "Ngopi dulu", done: true },
  { id: 3, title: "Makan siang", done: false },
  { id: 4, title: "Tidur siang", done: false },
  { id: 5, title: "Belajar JavaScript", done: true },
  { id: 6, title: "Olahraga", done: false },
];
let nextId = 7;

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title must be provided" });
  }
  const newTodo = {
    id: nextId++,
    title: title,
    done: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;
  const todo = todos.find((todo) => todo.id === parseInt(id));

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  
  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ message: "Title must not be empty" });
  }

  if (title !== undefined) {
    todo.title = title;
  }
  
  if (done !== undefined) {
    todo.done = done;
  }

  return res.status(200).json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  todos.splice(index, 1);
  return res.status(200).json({ message: "Todo deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
