"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/learn", label: "Обучение" },
  { href: "/catalog", label: "Каталог" },
  { href: "/dashboard", label: "Личный кабинет" },
];

export function SiteHeaderClient() {
  const { user, logout, isReady } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          aria-label="Prompt Studio — на главную"
        >
          Prompt Studio
        </Link>

        <nav aria-label="Основная навигация">
          <ul className="flex flex-wrap items-center gap-2 sm:gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isReady && user ? (
              <>
                <li>
                  <span className="px-2 text-sm text-zinc-500" aria-live="polite">
                    {user.name}
                  </span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Войти
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
