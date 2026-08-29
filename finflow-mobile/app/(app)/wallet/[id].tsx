import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { getApiErrorMessage, getTransactionsByWallet } from "../../../lib/api";
import { Transaction } from "../../../lib/types";

export default function WalletDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getTransactionsByWallet(id);
        setTransactions(data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#4338ca" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.error, styles.centered]}>{error}</Text>;
  }

  return (
    <FlatList
      style={styles.container}
      data={transactions}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View>
            <Text style={styles.description}>{item.description ?? item.type}</Text>
            <Text style={styles.meta}>
              {item.category ?? "Uncategorized"} · {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={[styles.amount, item.amount < 0 ? styles.negative : styles.positive]}>
            {item.amount > 0 ? "+" : ""}
            {item.amount.toFixed(2)}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, marginTop: 40 },
  list: { padding: 16 },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  error: { textAlign: "center", color: "#dc2626" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  description: { fontSize: 15, fontWeight: "600", color: "#111827" },
  meta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "700" },
  positive: { color: "#16a34a" },
  negative: { color: "#dc2626" },
});
