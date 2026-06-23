import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация",
};

export default function RegisterPage() {
  return (
    <section aria-labelledby="register-page-title">
      <h2 id="register-page-title" className="sr-only">
        Страница регистрации
      </h2>
      <RegisterForm />
    </section>
  );
}
