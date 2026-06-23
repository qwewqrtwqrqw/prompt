"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerUser } from "@/lib/api";
import { registerSchema, type RegisterFormValues } from "@/lib/validators";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    try {
      const response = await registerUser(
        values.name,
        values.email,
        values.password,
      );
      setSession(response.token, response.user);
      router.push("/dashboard");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Ошибка регистрации");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      noValidate
      aria-labelledby="register-title"
    >
      <div>
        <h1 id="register-title" className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Регистрация
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Создайте аккаунт для работы с шаблонами
        </p>
      </div>

      {(["name", "email", "password", "confirmPassword"] as const).map((field) => {
        const labels: Record<typeof field, string> = {
          name: "Имя",
          email: "Email",
          password: "Пароль",
          confirmPassword: "Подтверждение пароля",
        };
        const types: Record<typeof field, string> = {
          name: "text",
          email: "email",
          password: "password",
          confirmPassword: "password",
        };

        return (
          <div key={field}>
            <label htmlFor={field} className="mb-1 block text-sm font-medium">
              {labels[field]}
            </label>
            <input
              id={field}
              type={types[field]}
              autoComplete={field === "name" ? "name" : field}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
              {...register(field)}
            />
            {errors[field] ? (
              <p id={`${field}-error`} role="alert" className="mt-1 text-sm text-red-600">
                {errors[field]?.message}
              </p>
            ) : null}
          </div>
        );
      })}

      {serverError ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        {isSubmitting ? "Создание..." : "Создать аккаунт"}
      </button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
