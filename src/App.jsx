import React, { useEffect } from "react";
import useThemeStore from "./store/themeStore";
import TodoContainer from "./components/TodoContainer";

const App = () => {
  const { darkMode, toggleTheme } = useThemeStore();

  // Apply theme on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="relative h-screen min-h-screen flex flex-col items-center justify-center transition-all bg-white dark:bg-black">
      {/* Background with Gradient and Mask */}
      <div
        className={`absolute inset-0 w-full h-full bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#9333ea_100%)]`}
      />
      <div className="relative w-full h-full overflow-auto z-10 mb-3">
        <div className="relative flex flex-col items-end mr-3 md:mb z-20">
          <button
            onClick={toggleTheme}
            className="mt-4 px-4 py-2 rounded border border-purple-800 text-purple-800 "
          >
            Toggle Theme
          </button>
        </div>
        {/* Todo Container */}
        <div className="w-full z-10">
          <TodoContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
