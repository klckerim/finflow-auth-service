"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";


type AuthFormProps = {
  mode: "login" | "register";
  onSubmit: (data: z.infer<typeof loginSchema | typeof registerSchema>) => Promise<void>;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta girin" }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalı" }),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, { message: "Şifre tekrarı gerekli" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const schema = mode === "login" ? loginSchema : registerSchema;
  type LoginForm = z.infer<typeof loginSchema>;
  type RegisterForm = z.infer<typeof registerSchema>;
  type FormData = LoginForm | RegisterForm;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6 border rounded shadow">
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {mode === "register" && (
        <div>
          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {(errors as z.ZodError).issues.find(issue => issue.path[0] === "confirmPassword") && (
            <p className="text-red-600 text-sm mt-1">
              {(errors as z.ZodError).issues.find(issue => issue.path[0] === "confirmPassword")?.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}
