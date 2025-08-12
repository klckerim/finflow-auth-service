"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FadeInWrapper } from "@/features/dashboard/fadeinwrapper";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { parseApiResponseError, parseUnknownError } from "@/shared/lib/api-error-handler";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

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

  const handleRegister = async () => {
    setError("");
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await parseApiResponseError(res);
        throw new Error(msg);
      }

      router.push("/login");
    } catch (err) {
      parseUnknownError(err);
    }
  };

  if (user) return null;


  return (
    <FadeInWrapper>
      <div className="flex min-h-screen bg-[#0f0f0f] text-white">
        {/* Sol görsel alanı */}
        <div className="hidden md:flex w-1/2 bg-[#111827] text-white flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-4">Join to FinFlow!</h1>
          <p className="text-lg max-w-md text-gray-300 text-center">
            Sign up and start your roadway. 🚀
          </p>
          <img
            src="/images/finance-illustration.svg"
            alt="Finance illustration"
            className="w-80 mt-8"
          />
        </div>

        {/* Sağ form alanı */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
          <div className="w-full max-w-md p-8 bg-[#1f2937] border border-gray-700 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Create your FinFlow account
            </h2>
            <p className="text-center text-gray-400 mb-6 text-sm">
              Fill out the details below to register.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-1 block text-gray-300">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-inputBg text-white px-4 py-2 border border-gray-600"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block text-gray-300">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-inputBg text-white px-4 py-2 border border-gray-600"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block text-gray-300">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Choose a secure password"
                  className="w-full bg-inputBg text-white px-4 py-2 border border-gray-600"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                onClick={handleRegister}
                className="w-full bg-primary hover:bg-blue-700 mt-4 py-2 text-white font-semibold"
              >
                SIGN UP
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-600" />
                <span className="px-2 text-gray-400 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-600" />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black">
                  <img src="/icons/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </Button>

                <Button variant="outline" className="flex-1 rounded-xl bg-white text-black">
                  <img src="/icons/apple-icon.svg" alt="Apple" className="w-5 h-5 mr-2" />
                  Apple
                </Button>
              </div>

              <div className="text-center mt-4 text-sm text-gray-400">
                Already signed up?{" "}
                <Link href="/login" className="text-blue-400 hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInWrapper>
  );
}
