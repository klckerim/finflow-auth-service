"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FadeInWrapper } from "@/components/ui/fadeinwrapper";
import { useAuth } from "@/context/auth-context";
import { getMe } from "@/lib/auth";
import { parseApiResponseError, parseUnknownError } from "@/lib/api-error-handler";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setError("");
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });


      if (!res.ok) {
        const msg = await parseApiResponseError(res);
        throw new Error(msg);
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      const me = await getMe();
      login(me);
      router.push("/dashboard");

    } catch (err) {
      parseUnknownError(err);
    }
  };

  return (
    <FadeInWrapper>
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        <div className="hidden md:flex w-1/2 bg-[#111827] text-white flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to FinFlow!</h1>
          <p className="text-lg max-w-md text-gray-300 text-center">
            Manage your digital wallets. ✨
          </p>
          <img
            src="/finance-illustration.svg"
            alt="Finance illustration"
            className="w-80 mt-8"
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
          <div className="w-full max-w-md p-8 bg-[#1f2937] border border-gray-700 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Welcome to your FinFlow User Portal
            </h2>
            <p className="text-center text-gray-400 mb-6 text-sm">Please log in!</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block text-gray-300">Your email address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-inputBg text-white rounded-soft px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block text-gray-300">Your password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-inputBg text-white rounded-soft px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                onClick={handleLogin}
                className="w-full bg-primary hover:bg-blue-700 mt-4 rounded-soft py-2 text-white font-semibold transition-all duration-150"
              >
                Login
              </Button>

              <div className="flex items-center justify-between text-sm text-blue-400 mt-2">
                <Link href="/forgot-password" className="hover:underline">
                  Forgot your password?
                </Link>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">Or log in with</div>

              <div className="flex gap-4 mt-2">
                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black">
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </Button>

                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black">
                  <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5 mr-2" />
                  Apple
                </Button>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-600" />
                <span className="px-2 text-gray-400 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-600" />
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline text-sm"
                >
                  SIGN UP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInWrapper>
  );
}
