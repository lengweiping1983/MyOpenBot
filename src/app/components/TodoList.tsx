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
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

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
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-8">
      {/* 主卡片 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-amber-200/30 border border-amber-100 overflow-hidden">
        {/* 头部区域 */}
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 px-6 py-8 text-white">
          {/* 装饰圆 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative">
            {/* 图标和标题 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">我的待办</h1>
                <p className="text-white/80 text-sm">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
              </div>
            </div>

            {/* 进度条 */}
            {totalCount > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-white/90 mb-2">
                  <span>完成进度</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">{activeCount} 待办</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{completedCount} 已完成</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="p-4 sm:p-6 border-b border-amber-100">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="添加新任务..."
              className="w-full pl-12 pr-4 py-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl text-amber-900 placeholder-amber-400 focus:border-orange-400 focus:bg-white focus:outline-none transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            
            <button
              onClick={addTodo}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              添加
            </button>
          </div>
        </div>

        {/* 筛选标签 */}
        {totalCount > 0 && (
          <div className="px-4 sm:px-6 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {([
                { key: "all", label: "全部", count: totalCount },
                { key: "active", label: "进行中", count: activeCount },
                { key: "completed", label: "已完成", count: completedCount },
              ] as const).map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    filter === key
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {label}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    filter === key ? "bg-white/20" : "bg-amber-200/50"
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 任务列表 */}
        <div className="p-4 sm:p-6 pt-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-50 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-amber-600 font-medium mb-1">
                {filter === "all"
                  ? "开始新的一天"
                  : filter === "active"
                  ? "没有进行中的任务"
                  : "还没有已完成的任务"}
              </p>
              <p className="text-amber-400 text-sm">
                {filter === "all" ? "添加你的第一个任务吧" : ""}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={`group relative bg-gradient-to-r ${
                    todo.completed 
                      ? "from-amber-50/50 to-orange-50/50" 
                      : "from-white to-amber-50/30"
                  } rounded-2xl p-4 border-2 ${
                    todo.completed ? "border-amber-100" : "border-amber-100 hover:border-orange-300"
                  } transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/30 hover:-translate-y-0.5`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* 复选框 */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        todo.completed
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-transparent scale-110"
                          : "border-amber-300 hover:border-orange-400 hover:bg-orange-50"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* 任务文本 */}
                    <span
                      className={`flex-1 text-base transition-all duration-300 ${
                        todo.completed 
                          ? "line-through text-amber-400" 
                          : "text-amber-900"
                      }`}
                    >
                      {todo.text}
                    </span>

                    {/* 删除按钮 */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-9 h-9 flex items-center justify-center text-amber-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        {completedCount > 0 && filter !== "active" && (
          <div className="px-4 sm:px-6 pb-6">
            <button
              onClick={clearCompleted}
              className="w-full py-3 text-amber-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium border border-dashed border-amber-300 hover:border-red-300"
            >
              清空 {completedCount} 个已完成任务
            </button>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <p className="text-center text-amber-400/60 text-xs mt-6">
        数据自动保存在本地
      </p>
    </div>
  );
}
