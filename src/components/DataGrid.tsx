import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

const DATA = Array.from({ length: 20 }, (_, i) => i + 1);
const GAP = 12;

export default function DataGrid({ data, Item, itemProps }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
            <Item product={item} {...itemProps} style={{
              flex: 1,
            }}/>
        // <View style={styles.itemWrapper}>
        //   <View style={styles.item}>
        //     {/* <Text style={styles.text}>{item.name}</Text> */}

        //   </View>
        // </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: GAP,
  },
  itemWrapper: {
    flex: 1, // ensures row takes full width
    padding: GAP / 2,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderRadius: 6,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});
