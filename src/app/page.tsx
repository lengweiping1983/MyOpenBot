import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
      <TodoList />
    </main>
  );
}
