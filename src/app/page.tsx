import Link from "next/link";

const features = [
  {
    title: "Обучение",
    text: "Разбираем CoT, few-shot, role prompting и structured output на практике.",
    href: "/learn",
  },
  {
    title: "Каталог",
    text: "Смотрите публичные шаблоны сообщества и используйте их как основу.",
    href: "/catalog",
  },
  {
    title: "Личный кабинет",
    text: "Создавайте шаблоны в редакторе с подсветкой и делитесь ими.",
    href: "/dashboard",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section aria-labelledby="hero-title" className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-12 text-white shadow-lg sm:px-10">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-100">
          Итоговый проект · UI Development
        </p>
        <h1 id="hero-title" className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          Изучайте промпт-инженерию и делитесь рабочими шаблонами
        </h1>
        <p className="mt-4 max-w-2xl text-base text-indigo-100 sm:text-lg">
          Prompt Studio помогает освоить современные техники формулировки запросов,
          создавать переиспользуемые шаблоны и публиковать их в общем каталоге.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/learn"
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Начать обучение
          </Link>
          <Link
            href="/catalog"
            className="rounded-md border border-white/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Открыть каталог
          </Link>
        </div>
      </section>

      <section aria-labelledby="features-title">
        <h2 id="features-title" className="text-2xl font-semibold">
          Разделы платформы
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.href}>
              <Link
                href={feature.href}
                className="block h-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{feature.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
