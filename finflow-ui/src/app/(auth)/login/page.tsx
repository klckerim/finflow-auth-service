"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import loadingAnimation from "@/shared/assets/lottie/loading.json";
import { FadeInWrapper } from "@/features/dashboard/fadeinwrapper";
import { useAuth } from "@/context/auth-context";
import { getMe } from "@/shared/lib/auth";
import { parseApiResponseError, parseUnknownError } from "@/shared/lib/api-error-handler";
import { useLocale } from "@/context/locale-context";
import Lottie from "react-lottie-player";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useLocale();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });


      if (!res.ok) {
        const err = await parseApiResponseError(res);
        throw new Error(t(err.errorCode, err.paramValue));
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      const me = await getMe();
      login(me);
      router.push("/dashboard");

    } catch (err) {
      parseUnknownError(err);
    }finally{
      setLoading(false);
    }
  };

  return (
    <FadeInWrapper>
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <div className="hidden md:flex w-1/2 bg-[#111827] text-white flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-4">{t("dashboard.welcomeTo")}</h1>
          <p className="text-lg max-w-md text-gray-300 text-center">
            {t("common.str_ManageWallets")} ✨
          </p>
          <img
            src="/images/finance-illustration.svg"
            alt="Finance illustration"
            className="w-80 mt-8"
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
          <div className="w-full max-w-md p-8 bg-[#1f2937] border border-gray-700 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">
              {t("common.str_WelcomeToPortal")}
            </h2>
            <p className="text-center text-gray-400 mb-6 text-sm"> {t("common.str_Login")}</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block text-gray-300">{t("common.str_Email")}</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("common.str_EnterEmail")}
                  className="w-full bg-inputBg text-white rounded-soft px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block text-gray-300">{t("common.str_Password")}</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("common.str_EnterPassword")}
                  className="w-full bg-inputBg text-white rounded-soft px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                onClick={handleLogin}
                className="w-full bg-primary hover:bg-blue-700 mt-4 rounded-soft py-2 text-white font-semibold transition-all duration-150"
              >
                 {loading ? (
                  <Lottie animationData={loadingAnimation} loop style={{ width: 40, height: 40 }} />
                ) : (
                  t("dashboard.login")
                )}

              </Button>

              <div className="flex items-center justify-between text-sm text-blue-400 mt-2">
                <Link href="/forgot-password" className="hover:underline">
                  {t("common.str_ForgotPassword")}
                </Link>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">{t("common.str_LogWith")}</div>

              <div className="flex gap-4 mt-2">
                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black">
                  <img src="/icons/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </Button>

                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black">
                  <img src="/icons/apple-icon.svg" alt="Apple" className="w-5 h-5 mr-2" />
                  Apple
                </Button>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-600" />
                <span className="px-2 text-gray-400 text-sm">{t("common.or")}</span>
                <div className="flex-grow h-px bg-gray-600" />
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {t("dashboard.signup")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInWrapper>
  );
}
