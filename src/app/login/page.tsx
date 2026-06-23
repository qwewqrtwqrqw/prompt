import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Вход",
};

export default function LoginPage() {
  return (
    <section aria-labelledby="login-page-title">
      <h2 id="login-page-title" className="sr-only">
        Страница входа
      </h2>
      <LoginForm />
    </section>
  );
}
