"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/features/cards/card";
import { Skeleton } from "@/components/layout/skeleton";
import { useAuth } from "@/context/auth-context";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  LogOut,
  Shield,
  Camera,
  CheckCircle,
} from "lucide-react";
import { useLocale } from "@/context/locale-context";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName,
        email: user.email,
        username: user.userName || "",
        role: user.role || t("dashboard.user"),
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setError("");
      console.log("Profile saved (mock)", profile);
      setEditing(false);
      setSuccess(t("warningsMessages.profileSaved"));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      parseUnknownError(err);
      setError(t("warningsMessages.profileSavedFailed"));
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        fullName: user.fullName,
        email: user.email,
        username: user.userName || "",
        role: user.role || t("dashboard.user"),
      });
    }
    setEditing(false);
    setError("");
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-2xl p-8 dark:bg-zinc-900 dark:border-gray-700 rounded-3xl shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-col gap-12 px-4 sm:px-8 md:px-16 py-10 max-w-screen-2xl mx-auto text-foreground">
        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("common.str_ProfileSettings")}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            {t("common.str_ManageInfo")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SIDEBAR - USER CARD */}
          <Card className="p-6 dark:bg-zinc-900 dark:border-gray-700 rounded-3xl shadow-md flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <button className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white shadow-md hover:scale-105 transition">
                <Camera size={16} />
              </button>
            </div>

            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>

            <div className="mt-4 px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-xs font-medium flex items-center">
              <Shield size={12} className="mr-1" />
              {user?.role || "User"}
            </div>

            <Button
              onClick={logout}
              variant="outline"
              className="w-full mt-8 flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl"
            >
              <LogOut size={16} />
               {t("dashboard.logout")}
            </Button>
          </Card>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* PROFILE FORM */}
            <Card className="p-6 dark:bg-zinc-900 dark:border-gray-700 rounded-3xl shadow-md">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <User size={20} />
                   {t("common.str_AccountInformation")}
                </CardTitle>
                {!editing && (
                  <Button
                    onClick={() => setEditing(true)}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit2 size={16} />
                     {t("common.str_EditProfile")}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-6 mt-4">
                {success && (
                  <div className="p-3 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-2">
                    <CheckCircle size={16} />
                    {success}
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                      <User size={16} /> {t("dashboard.fullname")}
                    </label>
                    <Input
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="h-12 rounded-xl dark:bg-zinc-800 dark:border-gray-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                      <Mail size={16} /> {t("dashboard.email")}
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="h-12 rounded-xl dark:bg-zinc-800 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                      <Shield size={16} /> {t("dashboard.role")}
                    </label>
                    <Input
                      name="role"
                      value={profile.role}
                      disabled
                      className="h-12 rounded-xl dark:bg-zinc-800 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {editing && (
                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 rounded-xl px-6 h-11 text-white"
                    >
                      <Save size={16} />
                      {t("dashboard.save")}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center gap-2 rounded-xl px-6 h-11 border-gray-700 text-muted-foreground hover:bg-zinc-800"
                    >
                      <X size={16} />
                      {t("dashboard.cancel")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SECURITY */}
            <Card className="p-6 dark:bg-zinc-900 dark:border-gray-700 rounded-3xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                   {t("common.str_SecuritySettings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{t("common.str_TwoFactor")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("common.str_ProtectAccount")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-700 text-blue-300 hover:bg-blue-500/10"
                  >
                    {t("common.str_Enable")}
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{t("common.str_LoginActivity")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("common.str_ReviewHistory")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-700 text-blue-300 hover:bg-blue-500/10"
                  >
                    {t("common.str_ViewLogs")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
