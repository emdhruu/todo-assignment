import { create } from "zustand";

const useThemeStore = create((set) => ({
  darkmode:
    typeof window !== "undefined"
      ? localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-schema: dark)").matches)
      : false,

  toggleTheme: () => {
    set((state) => {
      const newTheme = !state.darkmode ? "dark" : "light";
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", newTheme);
      return { darkmode: !state.darkmode };
    });
  },
}));

export default useThemeStore;
