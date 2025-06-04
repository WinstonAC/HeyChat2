import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// STATUS CHECK: globals.css exists and is imported correctly.
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider"; // STATUS CHECK: ToastProvider imported. Assumes '@/' alias is correctly configured.
// STATUS CHECK: ToastProvider is initialized here, but no active toast usages (e.g. via useToast().showToast()) were found in the project.

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hey Chat",
  description: "A TV show discussion platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-black text-white" suppressHydrationWarning={true}>
        <ToastProvider>
          <Navbar />
          <div suppressHydrationWarning={true}>
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
} 