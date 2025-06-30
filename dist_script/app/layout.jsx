import { Inter } from "next/font/google";
import "./globals.css";
// STATUS CHECK: globals.css exists and is imported correctly.
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider"; // STATUS CHECK: ToastProvider imported. Assumes '@/' alias is correctly configured.
// STATUS CHECK: ToastProvider is initialized here, but no active toast usages (e.g. via useToast().showToast()) were found in the project.
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
    title: "HeyChat Rebuild",
    description: "Rebuilding Lovable with Next.js, Tailwind, and Supabase",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-gray-900 text-white`} suppressHydrationWarning={true}>
        <ToastProvider>
          <Navbar />
          <main className="pt-16">{/* Add padding-top to avoid overlap with fixed navbar */}
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>);
}
