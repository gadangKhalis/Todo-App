import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddlewares";

interface TodoUpdateData {
  title?: string;
  done?: boolean;
}

interface TodoIDParams {
  id: string;
}

const prisma = new PrismaClient();

const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as unknown as AuthRequest).user?.userId;
  try {
    // take all todos (parentId: null) root with its children
    const todos = await prisma.todo.findMany({
      where: { parentId: null, userId: userId },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as unknown as AuthRequest).user?.userId;
  const { title, parentId, dueDate, priority } = req.body;
  console.log("body:", req.body);
  console.log("parentId:", parentId);

  try {
    if (!title) {
      return res.status(400).json({ message: "Title must be provided" });
    }
    // validate max depth of 3
    if (parentId) {
      const parent = await prisma.todo.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return res.status(404).json({ message: "Parent todo not found" });
      }
      if (parent.parentId !== null) {
        const grandParent = await prisma.todo.findUnique({
          where: { id: parent.parentId },
        });
        if (grandParent && grandParent.parentId !== null) {
          return res
            .status(400)
            .json({ message: "Maximum depth of 3 level reached" });
        }
      }
    }
    const newTodo = await prisma.todo.create({
      data: {
        title: title,
        done: false,
        userId: userId!,
        parentId: parentId ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority ?? null,
      },
      include: {
        children: true,
      },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request<TodoIDParams>,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as unknown as AuthRequest).user?.userId;
  const { id } = req.params;
  const { title, done, dueDate, priority } = req.body;
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({ message: "Title must not be empty" });
    }

    const updateData: TodoUpdateData = {};
    if (title !== undefined) {
      updateData.title = title;
    }
    if (done !== undefined) {
      updateData.done = done;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(done !== undefined && { done }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(priority !== undefined && { priority }),
      },
    });

    return res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (
  req: Request<TodoIDParams>,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as unknown as AuthRequest).user?.userId;
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (todo.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default { getAllTodos, createTodo, updateTodo, deleteTodo };
