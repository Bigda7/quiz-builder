import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'QuizBuilder - Create and Manage Custom Quizzes',
  description: 'Full-stack Quiz Builder application built with Next.js, Express, and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
