import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <TodoList />
    </main>
  );
}
