"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";


type AuthFormProps = {
  mode: "login" | "register";
  onSubmit: (data: z.infer<typeof loginSchema | typeof registerSchema>) => Promise<void>;
};

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, { message: "Repeat password required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
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
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {mode === "register" && (
        <div>
          <Label htmlFor="confirmPassword">Password Again</Label>
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
