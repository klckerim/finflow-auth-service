import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getApiErrorMessage, getWalletsByUser } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { Wallet } from "../../lib/types";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallets = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await getWalletsByUser(user.userId);
      setWallets(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadWallets();
      setIsLoading(false);
    })();
  }, [loadWallets]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadWallets();
    setIsRefreshing(false);
  }

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.fullName ?? "there"}</Text>
          <Text style={styles.totalLabel}>Total balance</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalBalance, wallets[0]?.currency)}</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4338ca" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={wallets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No wallets yet.</Text>}
          renderItem={({ item }) => (
            <Pressable style={styles.walletCard} onPress={() => router.push(`/(app)/wallet/${item.id}`)}>
              <View>
                <Text style={styles.walletName}>{item.name}</Text>
                <Text style={styles.walletType}>{item.type}</Text>
              </View>
              <Text style={styles.walletBalance}>{formatCurrency(item.balance, item.currency)}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function formatCurrency(amount: number, currency?: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency ?? "USD" }).format(amount);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#4338ca",
    padding: 24,
    paddingTop: 64,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { color: "#e0e7ff", fontSize: 16 },
  totalLabel: { color: "#c7d2fe", fontSize: 13, marginTop: 12 },
  totalValue: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 4 },
  logoutButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 8 },
  logoutText: { color: "#fff", fontWeight: "600" },
  list: { padding: 16 },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  error: { textAlign: "center", color: "#dc2626", marginTop: 40 },
  walletCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  walletName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  walletType: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  walletBalance: { fontSize: 16, fontWeight: "700", color: "#4338ca" },
});
