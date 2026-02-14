import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton, Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../navigation/navigation.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { emptyObject, odooApi } from "../common/store/reduxApi";
import { sumOfNumbers } from "../common/utils/commonComponentLogic";

export default function CartButton() {
  const navigation = useNavigation()
  function navigateToCart() {
    navigation.navigate(ScreenNames.Cart)
  }
  const cartQuery = odooApi.useCartQuery({});
  const cart = cartQuery.data?.cart_data ?? emptyObject;
  const qty = sumOfNumbers(cart?.website_sale_order?.website_order_line?.map(line => line.displayed_quantity)) ?? 0
  return (
    <View style={{
      marginHorizontal: 8,
    }}>
      <Badge style={{
        position: 'absolute',
        top: 4,
        right: 0,
        zIndex: 10,
      }}>{qty}</Badge>
      <IconButton icon='cart' onPress={navigateToCart} mode="contained"/>
    </View>
  )
}

const styles = StyleSheet.create({
})
