import React from "react";
import Header from "./Header.jsx";
import TodoForm from "./TodoForm.jsx";

const TodoContainer = () => {
  return (
    <div className="min-w-full lg:max-w-4xl md:max-w-3xl lg:px-[20%] md:px-[10%] px-2 lg:absolute lg:top-4 mt-4 lg:mt-0 md:mt-0 md:absolute md:top-4 w-full flex flex-col justify-center items-center ">
      <Header />
      <TodoForm />
    </div>
  );
};

export default TodoContainer;
