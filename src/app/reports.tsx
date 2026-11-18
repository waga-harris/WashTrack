import { Redirect, Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { colors, peso, styles } from "../constants/theme";
import { useWashTrack } from "../context/WashTrackContext";

export default function Reports() {
  const {
    orders,
    customers,
    role,
    loaded,
  } = useWashTrack();

  if (!loaded) return null;

  if (role !== "Owner/Admin") {
    return <Redirect href="/dashboard" />;
  }

  const today = new Date().toDateString();

  const ordersToday = orders.filter(
    (order) =>
      new Date(order.createdAt).toDateString() === today
  ).length;

  const totalSalesCollected = orders.reduce(
    (sum, order) => sum + order.paymentAmount,
    0
  );

  const outstandingBalance = orders.reduce(
    (sum, order) =>
      sum + Math.max(0, order.total - order.paymentAmount),
    0
  );

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const orderStatuses = [
    "Pending",
    "Ongoing",
    "Ready for Pickup",
    "Completed",
  ] as const;

  const paymentStatuses = [
    "Paid",
    "Partial",
    "Unpaid",
  ] as const;

  const salesByService = orders.reduce<
    Record<string, number>
  >((summary, order) => {
    summary[order.serviceName] =
      (summary[order.serviceName] ?? 0) +
      order.paymentAmount;

    return summary;
  }, {});

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Reports & Analytics",
        }}
      />

      <Text style={styles.title}>
        Admin Reports & Analytics
      </Text>

      <Text style={styles.muted}>
        Overview of laundry orders, payments, and sales.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Total Sales Collected
        </Text>
        <Text style={styles.title}>
          {peso(totalSalesCollected)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Outstanding Balance
        </Text>
        <Text style={styles.title}>
          {peso(outstandingBalance)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Total Order Value
        </Text>
        <Text style={styles.title}>
          {peso(totalOrderValue)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Orders Today
        </Text>
        <Text style={styles.title}>
          {ordersToday}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Registered Customers
        </Text>
        <Text style={styles.title}>
          {customers.length}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          Order Status Summary
        </Text>

        {orderStatuses.map((status) => {
          const count = orders.filter(
            (order) => order.status === status
          ).length;

          return (
            <View
              key={status}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text>
                {status}: {count}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          Payment Status Summary
        </Text>

        {paymentStatuses.map((status) => {
          const count = orders.filter(
            (order) => order.paymentStatus === status
          ).length;

          return (
            <View
              key={status}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text>
                {status}: {count}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          Sales by Service
        </Text>

        {Object.keys(salesByService).length === 0 && (
          <Text>No sales recorded yet.</Text>
        )}

        {Object.entries(salesByService).map(
          ([service, sales]) => (
            <View
              key={service}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {service}
              </Text>
              <Text>{peso(sales)}</Text>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}