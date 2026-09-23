import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/quizzes" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-700 transition">
            QB
          </div>
          <span className="font-semibold text-lg text-slate-900 tracking-tight">QuizBuilder</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/quizzes"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
          >
            Quizzes
          </Link>
          <Link
            href="/create"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition inline-flex items-center gap-1.5"
          >
            Create Quiz
          </Link>
        </nav>
      </div>
    </header>
  );
}
