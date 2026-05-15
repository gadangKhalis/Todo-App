const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/home", (req, res) => {
  res.status(200).json({ message: "Ini Halaman Utama!" });
});

app.get("/about", (req, res) => {
  res.status(200).json({ message: "Tentang saya" });
});
app.get("/greet", (req, res) => {
  const name = req.query.name || "Tamu";
  res.status(200).json({ message: `Halo, selamat datang, ${name}!` });
});

app.get("/contact", (req, res) => {
  const user = { id: 1, name: "John Doe", email: "john.doe@example.com" };
  res.status(200).json({ user });
  res.send("Kontak saya");
});

app.post("/data", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  res
    .status(200)
    .json({ message: "Data berhasil diterima", data: { username, email } });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
