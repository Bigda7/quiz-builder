'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ExternalLink, HelpCircle, Plus, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { QuizListItem } from '../../types/quiz';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadQuizzes = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load quizzes. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete quiz');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quizzes Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse existing quizzes, inspect their structure, or create new assessments.
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-medium">Loading quizzes...</p>
        </div>
      ) : errorMessage ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={loadQuizzes}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md font-medium text-xs transition"
          >
            Retry
          </button>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No quizzes available</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
            Get started by creating your first custom quiz with different question types.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create First Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition line-clamp-2">
                    {quiz.title}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(quiz.id, e)}
                    disabled={deletingId === quiz.id}
                    title="Delete quiz"
                    aria-label={`Delete quiz ${quiz.title}`}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                  >
                    {deletingId === quiz.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {quiz.questionsCount} {quiz.questionsCount === 1 ? 'question' : 'questions'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
