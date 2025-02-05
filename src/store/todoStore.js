import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useTodoStore = create((set) => ({
  todos: [], //Array to store todos
  loading: false, //loading state
  error: null, //error state

  // fetch todos list from API
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/todos?limit=10");
      set({ todos: res.data.todos });
    } catch (error) {
      set({ error: error.message, loading: falses });
    } finally {
      set({ loading: false, error: null });
    }
  },

  // add new todo to todo's list
  addTodo: async (todo) => {
    try {
      const res = await axiosInstance.post("/todos/add", todo);
      set((state) => ({ todos: [...state.todos, res.data] }));
    } catch (error) {
      set({ error: error.message });
    }
  },    

  // update todo from todo's list
  update: async (userId, updatedTodo) => {
    try {
      await axiosInstance.post(`/todos/${userId }`, updatedTodo);

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  //delete todo item from list
  delete: async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);

      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useTodoStore;
