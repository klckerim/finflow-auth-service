"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FadeInWrapper } from "@/features/dashboard/fadeinwrapper";
import loadingAnimation from "@/shared/assets/lottie/loading.json";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { parseApiResponseError, parseUnknownError } from "@/shared/lib/api-error-handler";
import { useLocale } from "@/context/locale-context";
import Lottie from "react-lottie-player";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    fullName: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setError("");

    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await parseApiResponseError(res);
        throw new Error(t(msg.errorCode, msg.paramValue));
      }

      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message) {
        setError(message);
      }
      parseUnknownError(err);
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;


  return (
    <FadeInWrapper>
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        {/* Sol görsel alanı */}
        <div className="hidden md:flex w-1/2 bg-[#111827] text-white flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-4">{t("common.str_JoinTo")}</h1>
          <p className="text-lg max-w-md text-gray-300 text-center">
            {t("common.str_Roadway")}  🚀
          </p>
          <Image
            src="/images/finance-illustration.svg"
            alt="Finance illustration"
            className="w-80 mt-8"
            width={320}
            height={320}
            priority
          />
        </div>

        {/* Sağ form alanı */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
          <div className="w-full max-w-md p-8 bg-[#1f2937] border border-gray-700 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">
              {t("common.str_CreateAccount")}
            </h2>
            <p className="text-center text-gray-400 mb-6 text-sm">
              {t("common.str_FillDetail")}
            </p>

            <form className="space-y-4" onSubmit={handleRegister} aria-busy={loading}>
              <div>
                <label htmlFor="fullName" className="text-sm mb-1 block text-gray-300">
                  {t("dashboard.fullname")}
                </label>
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={t("common.str_Fullname")}
                  autoComplete="name"
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full bg-inputBg text-white px-4 py-2 border border-gray-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm mb-1 block text-gray-300">
                  {t("dashboard.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("common.str_EnterEmail")}
                  autoComplete="email"
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full bg-inputBg text-white px-4 py-2 border border-gray-600"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm mb-1 block text-gray-300">
                  {t("dashboard.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t("common.str_SecurePassword")}
                  autoComplete="new-password"
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "register-error" : undefined}
                  className="w-full bg-inputBg text-white px-4 py-2 border border-gray-600"
                />
              </div>

              {error && (
                <p id="register-error" className="text-red-400 text-sm" role="alert" aria-live="polite">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading || !form.fullName || !form.email || !form.password}
                className="w-full bg-primary hover:bg-blue-700 mt-4 py-2 text-white font-semibold"
              >
                {loading ? (
                  <Lottie animationData={loadingAnimation} loop style={{ width: 40, height: 40 }} />
                ) : (
                  t("dashboard.signup")
                )}
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-600" />
                <span className="px-2 text-gray-400 text-sm">{t("common.or")}</span>
                <div className="flex-grow h-px bg-gray-600" />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black" type="button">
                  <Image src="/icons/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" width={20} height={20} />
                  {t("common.str_ContinueWithGoogle")}
                </Button>

                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black" type="button">
                  <Image src="/icons/apple-icon.svg" alt="Apple" className="w-5 h-5 mr-2" width={20} height={20} />
                  {t("common.str_ContinueWithApple")}
                </Button>
              </div>

              <div className="text-center mt-4 text-sm text-gray-400">
                {t("common.str_AlreadySignUp")}{" "}
                <Link href="/login" className="text-blue-400 hover:underline">
                  {t("dashboard.signin")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FadeInWrapper >
  );
}
