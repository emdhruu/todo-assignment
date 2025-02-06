import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useTodoStore = create((set, get) => ({
  //handling todos list at localstorage with undefined and empty array
  todos: (() => {
    const storedTodos = localStorage.getItem("todos");
    try {
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
      console.error("Error parsing todos from localStorage:", error);
      return [];
    }
  })(),
  randomTodos: [],
  task: "",
  loading: false,
  addModal: false,
  error: null,
  currentPage: 1,
  totalPages: 2,
  limit: 6,
  status: [
    {
      name: "All",
      number: 20,
    },
    {
      name: "Closed",
      number: 5,
    },
  ],
  currentTabStatus: "All",

  // toggle the current tab based on the status
  setCurrentTabStatus: (currentTabStatus) => set({ currentTabStatus }),
  
  setAddToggleModal: () => set((state) => ({ addModal: !state.addModal })),

  setTask: (task) => set({ task: task }),

  // fetch todos list from API
  fetchTodos: async (page = 1) => {
    const limit = get().limit;
    const skip = (page - 1) * limit;
    set({ loading: true, error: null });

    try {
      let storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

      if (storedTodos.length > 0) {
        const paginatedTodos = storedTodos.slice(skip, skip + limit);

        set({
          todos: paginatedTodos,
          currentPage: page,
          totalPages: Math.ceil(storedTodos.length / limit),
          loading: false,
        });
      } else {
        // Fetch from API if no data is in localStorage
        const res = await axiosInstance.get(`/todos?limit=100`);

        if (res.data.todos.length > 0) {
          localStorage.setItem("todos", JSON.stringify(res.data.todos)); // Store all todos

          const paginatedTodos = res.data.todos.slice(skip, skip + limit);

          set({
            todos: paginatedTodos,
            currentPage: page,
            totalPages: Math.ceil(res.data.todos.length / limit), // Calculate total pages based on all todos
            loading: false,
          });
        }
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new todo to todo's list
  addTodo: async (todo) => {
    try {
      const userId = 5;
      const res = await axiosInstance.post("/todos/add", { ...todo, userId });

      set((state) => {
        // Get all stored todos from localStorage
        const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

        const updatedTodos = [res.data, ...storedTodos]; 

        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        const limit = get().limit;
        const totalPages = Math.ceil(updatedTodos.length / limit);
        const currentPage = 1; 

        const paginatedTodos = updatedTodos.slice(0, limit);

        return {
          todos: paginatedTodos,
          totalPages,
          currentPage,
        };
      });
      toast.success("Added in Task list and stored successfully in localStorage.");
    } catch (error) {
      set({ error: error.message });
    }
  },

  // update status of todo from todo's list
  toggleTodo: async (id) => {
    try {
      let storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

      // Update the todo in all stored todos not just the current page
      const updatedTodos = storedTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      const limit = get().limit;
      const skip = (get().currentPage - 1) * limit;
      const paginatedTodos = updatedTodos.slice(skip, skip + limit);

      set({
        todos: paginatedTodos,
        totalPages: Math.ceil(updatedTodos.length / limit), 
      });

      toast.success("Status updated and saved in localStorage!");
      // Send API request (won't persist but keeps API in sync)
      await axiosInstance.put(`/todos/${id}`, {
        completed: !storedTodos.find((todo) => todo.id === id).completed,
      });
    } catch (error) {
      set({ error: error.message });
      console.log("error", error);
    }
  },

  //delete todo item from list
  deleteTodo: async (id) => {
    try {
      let storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

      // Remove the todo from localStorage without affecting pagination
      const updatedTodos = storedTodos.filter((todo) => todo.id !== id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Persist updated list

      const limit = get().limit;
      const totalPages = Math.ceil(updatedTodos.length / limit);
      let currentPage = get().currentPage;

      if ((currentPage - 1) * limit >= updatedTodos.length) {
        currentPage = Math.max(1, currentPage - 1);
      }

      const paginatedTodos = updatedTodos.slice(
        (currentPage - 1) * limit,
        currentPage * limit
      );

      set({
        todos: paginatedTodos,
        currentPage: currentPage, 
        totalPages: totalPages,
      });

      toast.success("Task deleted successfuly from localStorage.");

      // Send delete request to API (this would be for valid ids in real use cases)
      await axiosInstance.delete(`/todos/${id}`);
    } catch (error) {
      set({ error: error.message });
      toast.error("This is a dummy request, therefore shows error");
      toast.success("Selected Id deleted from localStorage.");
    }
  },

  //Set-Page on update
  setPage: (page) => {
    const totalPages = get().totalPages;
    if (page > 0 && page <= totalPages) {
      set({ currentPage: page });
      get().fetchTodos(page);
    }
  },

  fetchCompletedTodo: () => {
    try {
      const completedTodos = get().todos.filter(
        (todo) => todo.completed === true
      );
      set({
        randomTodos: completedTodos,
      });
    } catch (error) {}
  },
}));

export default useTodoStore;
