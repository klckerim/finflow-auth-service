
import { Suspense } from "react"

import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ResetPasswordClient />
    </Suspense>
  )}
