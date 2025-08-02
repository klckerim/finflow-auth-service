

"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/auth-context";

// type ProtectedRouteProps = {
//   children: React.ReactNode;
// };

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.replace("/login"); // ya da "/register" veya "/"
//     }
//   }, [isLoading, isAuthenticated, router]);

//   if (isLoading || !isAuthenticated) {
//     // Sayfa hiç render edilmesin
//     return null;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;



import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;


