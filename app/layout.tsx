import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// STATUS CHECK: globals.css exists and is imported correctly.
import AppLayout from "@/components/layout/AppLayout";
import { ToastProvider } from "@/components/ToastProvider"; // STATUS CHECK: ToastProvider imported. Assumes '@/' alias is correctly configured.
// STATUS CHECK: ToastProvider is initialized here, but no active toast usages (e.g. via useToast().showToast()) were found in the project.
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeyChat Rebuild",
  description: "Rebuilding Lovable with Next.js, Tailwind, and Supabase",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-black text-white`} suppressHydrationWarning={true}>
        <ToastProvider>
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
} 