import axios from "axios";

const API_URL = "http://localhost:3000/todos";

const todoApi = {
  getTodos: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createTodo: async (title) => {
    const res = await axios.post(API_URL, { title });
    return res.data;
  },

  updateTodo: async (id, updates) => {
    const res = await axios.put(`${API_URL}/${id}`, updates);
    return res.data;
  },

  deleteTodo: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};

export default todoApi;
