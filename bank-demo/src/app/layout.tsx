import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3RD Core Banking - Internal System",
  description: "Demo hệ thống nội bộ ngân hàng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
