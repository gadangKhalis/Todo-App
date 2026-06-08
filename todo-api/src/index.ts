import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todo.routes";
import errorHandler from "./middlewares/errorHandler";
import authMiddleware from "./middlewares/authMiddlewares";
import premiumRoutes from "./routes/premium.routes";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://todo-app-sandy-seven-23.vercel.app",
      "https://todo-app-ruby-beta-32.vercel.app",
    ],
    credentials: true, // must be, so cookie can be sent cross-origin
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes); //protect all /todos
app.use("/premium", premiumRoutes); //premium routes

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
