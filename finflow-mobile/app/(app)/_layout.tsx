import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../lib/auth-context";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="wallet/[id]" options={{ headerShown: true, title: "Wallet" }} />
    </Stack>
  );
}
