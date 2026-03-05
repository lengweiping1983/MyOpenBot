import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo List - 待办事项",
  description: "高效管理你的每日任务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
