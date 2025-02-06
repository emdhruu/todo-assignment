import { ArrowLeftIcon, ArrowRightIcon, Plus, Trash2, X } from "lucide-react";
import React, { useEffect } from "react";
import useTodoStore from "../store/todoStore";
import toast from "react-hot-toast";
import GridBoxSkeleton from "./skeleton/GridBoxSkeleton";
import { formatDate } from "../lib/utils";

const TodoForm = () => {
  const {
    status,
    setCurrentTabStatus,
    currentTabStatus,
    todos,
    fetchTodos,
    toggleTodo,
    currentPage,
    totalPages,
    setPage,
    loading,
    fetchCompletedTodo,
    randomTodos,
    deleteTodo,
    setAddToggleModal,
    addModal,
  } = useTodoStore();

  useEffect(() => {
    fetchTodos(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchCompletedTodo();
  }, []);

  const currentDate = new Date();

  return (
    <div className="mt-6 w-full">
      <div className="flex justify-between items-center">
        {/* Title and Button */}
        <div className="flex flex-col gap-y-1 ">
          <h3 className="lg:text-4xl text-3xl dark:text-white">Today's Task</h3>
          <span className="text-gray-400 lg:text-base text-sm pl-0.5">
            {formatDate(currentDate)}
          </span>
        </div>
        <div>
          <button
            onClick={setAddToggleModal}
            className="flex lg:justify-start items-center gap-1 bg-purple-200 text-purple-800 py-3 px-6 rounded-2xl hover:cursor-pointer"
          >
            <span>
              <Plus className="w-5 h-5 hidden md:inline-block" />
            </span>

            <span className="text-base">New Task</span>
          </button>
        </div>
      </div>
      {/* Tab Status */}
      <div className="w-full flex justify-around mt-5 ">
        {status.map((idx, i) => (
          <div
            className="flex items-center hover:cursor-pointer"
            onClick={() => setCurrentTabStatus(idx.name)}
          >
            <span
              className={` lg:text-xl md:text-xl text-lg mr-2 ${
                currentTabStatus === idx.name
                  ? "text-purple-800"
                  : "text-gray-500"
              }`}
              key={idx}
            >
              {idx.name}
            </span>
            <span
              className={` text-white p-1 px-2 text-xs rounded-2xl ${
                currentTabStatus === idx.name ? "bg-purple-800" : "bg-gray-400"
              }`}
            >
              {idx.number}
            </span>
          </div>
        ))}
      </div>
      <div className="relative w-full mt-5 ">
        {/* Loading State */}
        {loading && <GridBoxSkeleton />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentTabStatus === "All" ? todos : randomTodos).map((todo) => (
              <div
                key={todo.id}
                className="rounded-2xl bg-purple-100 p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Todo Content */}
                <div className="flex flex-col">
                  <span
                    className={`${
                      todo.completed ? "line-through text-gray-500" : ""
                    } font-semibold text-lg`}
                  >
                    {todo.todo}
                  </span>
                </div>

                {/* Actions - Delete & Checkbox */}
                <div className="flex justify-between items-center mt-4">
                  <Trash2
                    className="w-5 h-5 hover:cursor-pointer text-red-500"
                    onClick={() => deleteTodo(todo.id)}
                  />

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-purple-500 cursor-pointer"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {currentTabStatus === "All" && (
          <div className="flex flex-wrap justify-center mt-6 space-x-4 space-y-2 sm:space-y-0">
            <button
              className="border dark:border-white dark:text-white border-purple-800 text-purple-800 px-3 py-1 rounded disabled:opacity-50 flex gap-1 hover:cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ArrowLeftIcon />
              Previous
            </button>
            <span className="px-4 py-1 text-lg font-semibold dark:text-white ">
              {currentPage} / {totalPages}
            </span>
            <button
              className="border dark:border-white dark:text-white border-purple-800 text-purple-800 px-4 py-1 rounded disabled:opacity-50 flex gap-1 hover:cursor-pointer"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
              <ArrowRightIcon />
            </button>
          </div>
        )}

        {addModal && <Modal />}
      </div>
    </div>
  );
};

export default TodoForm;

const Modal = () => {
  const { setAddToggleModal, task, setTask, addTodo } = useTodoStore();

  const handleSubmit = () => {
    if (task.trim === "") {
      toast.error("Task can't be empty");
      return;
    }
    addTodo({ todo: task, completed: false });
    setTask("");
    setAddToggleModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-xs z-50">
      <div className="bg-slate-100 p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 sm:mx-0 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h1 className="text-lg font-semibold text-gray-800">Add Task</h1>
          <button
            className="text-black hover:text-red-500 hover:cursor-pointer transition"
            onClick={setAddToggleModal}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Textarea */}
        <div className="mt-4">
          <textarea
            className="w-full border rounded-lg p-3 text-gray-700 focus:ring focus:ring-purple-300 outline-none resize-none"
            rows="3"
            placeholder="Write something here..."
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="px-4 py-2 border text-gray-800 rounded-lg hover:bg-gray-400 hover:cursor-pointer hover:text-white  transition"
            onClick={setAddToggleModal}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 border rounded-lg transition ${
              task.trim() === ""
                ? "border border-purple-300 text-purple-300 cursor-not-allowed"
                : "text-purple-800 hover:bg-purple-700 hover:text-white hover:cursor-pointer"
            }`}
            disabled={task.trim() === ""}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};
