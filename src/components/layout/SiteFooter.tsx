export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Prompt Studio — итоговый проект по дисциплине «Разработка интерфейса пользователя»</p>
        <p>
          Демо-аккаунт: <span className="font-mono">demo@example.com</span> / demo123
        </p>
      </div>
    </footer>
  );
}
