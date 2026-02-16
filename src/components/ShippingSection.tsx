// AI generated based on odoo portal template
import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import {
  Card,
  Text,
  Chip,
  Button,
  Divider,
  List,
} from "react-native-paper";

const statusColorMap = {
  success: "#2e7d32",
  danger: "#c62828",
  info: "#0277bd",
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const StatusChip = ({ item }) => {
  if (!item.status_label) return null;
  return (
    <Chip
      style={[
        styles.chip,
        { backgroundColor: statusColorMap[item.status_type] || "#999" },
      ]}
      textStyle={{ color: "white" }}
    >
      {item.status_label}
    </Chip>
  );
};

const DeliveryItem = ({ item }) => (
  <Card key={item.id} style={styles.card}>
    <Card.Content>
      <View style={styles.rowBetween}>
        <Text
          variant="titleMedium"
          style={styles.link}
          onPress={() => Linking.openURL(item.report_url)}
        >
          {item.name}
        </Text>
        <StatusChip item={item} />
      </View>
      <Text style={styles.dateText}>
        Date:{" "}
        {item.is_show_scheduled_date
          ? formatDate(item.scheduled_date)
          : formatDate(item.date_done)}
      </Text>
      {item.return_url && (
        <Button
          mode="outlined"
          compact
          style={styles.returnButton}
          onPress={() => Linking.openURL(item.return_url)}
        >
          RETURN
        </Button>
      )}
    </Card.Content>
  </Card>
);

const ReturnItem = ({ item }) => (
  <Card key={item.id} style={styles.card}>
    <Card.Content>
      <View style={styles.rowBetween}>
        <Text
          variant="titleMedium"
          style={styles.link}
          onPress={() => Linking.openURL(item.report_url)}
        >
          {item.name}
        </Text>
        <StatusChip item={item} />
      </View>
      <Text style={styles.dateText}>
        Date:{" "}
        {item.state === "done"
          ? formatDate(item.date_done)
          : formatDate(item.scheduled_date)}
      </Text>
    </Card.Content>
  </Card>
);

const ShippingSection = ({ shippingData }) => {
  const { delivery_orders = [], returns = [] } = shippingData || {};

  return (
    <View>
      {/* Delivery Orders */}
      {delivery_orders.length > 0 && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            📦 Last Delivery Orders
          </Text>
          <Divider style={styles.divider} />
          {delivery_orders.map((item) => (
            <DeliveryItem key={item.id} item={item} />
          ))}
        </>
      )}
      {/* Returns */}
      {returns.length > 0 && (
        <>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Returns
          </Text>
          <Divider style={styles.divider} />
          {returns.map((item) => (
            <ReturnItem key={item.id} item={item} />
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    // height: 28,
  },
  link: {
    textDecorationLine: "underline",
  },
  dateText: {
    marginTop: 8,
    color: "#666",
  },
  returnButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
});

export default ShippingSection;
