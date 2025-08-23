"use client";

import { Suspense } from "react"

import ResetPasswordClient from "./ResetPasswordClient";
import { useLocale } from "@/context/locale-context";

export default function Page() {
  const { t } = useLocale();
return (
    <Suspense fallback={<div>{t("common.loading")}</div>}>
      <ResetPasswordClient />
    </Suspense>
  )}
