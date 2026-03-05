"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch {
        setTodos([]);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">待办事项</h1>
        <p className="text-amber-600">高效管理你的每日任务</p>
      </div>

      {/* 输入框 */}
      <div className="bg-white rounded-2xl shadow-lg shadow-amber-200/50 p-2 mb-6 border border-amber-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="添加新任务..."
            className="flex-1 px-4 py-3 text-amber-900 placeholder-amber-400 bg-transparent border-none outline-none text-lg"
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-md shadow-amber-500/25"
          >
            添加
          </button>
        </div>
      </div>

      {/* 统计和筛选 */}
      {todos.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-sm text-amber-700">
            <span className="font-medium text-amber-900">{activeCount}</span> 个待完成
            {completedCount > 0 && (
              <span className="ml-3">
                <span className="font-medium text-amber-900">{completedCount}</span> 个已完成
              </span>
            )}
          </div>
          
          <div className="flex gap-1 bg-amber-100/50 p-1 rounded-lg">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  filter === f
                    ? "bg-white text-amber-800 shadow-sm"
                    : "text-amber-600 hover:text-amber-800"
                }`}
              >
                {f === "all" ? "全部" : f === "active" ? "进行中" : "已完成"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-amber-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-amber-500">
              {filter === "all"
                ? "还没有任务，添加一个吧！"
                : filter === "active"
                ? "没有进行中的任务"
                : "没有已完成的任务"}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group bg-white rounded-xl p-4 shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all duration-200 ${
                todo.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    todo.completed
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 border-transparent"
                      : "border-amber-300 hover:border-orange-400"
                  }`}
                >
                  {todo.completed && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-amber-900 ${
                    todo.completed ? "line-through text-amber-400" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-amber-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 清空已完成 */}
      {completedCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={clearCompleted}
            className="text-sm text-amber-400 hover:text-red-500 transition-colors duration-200"
          >
            清空已完成任务
          </button>
        </div>
      )}
    </div>
  );
}
