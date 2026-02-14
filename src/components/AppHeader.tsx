import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton, Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../navigation/navigation.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  function navigateToCart() {
    navigation.navigate(ScreenNames.Cart)
  }
  return (
    <View style={{
      flexDirection: 'row',
      // alignItems: 'center',
      marginTop: insets.top,
      borderWidth: 1, borderColor: 'red',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
    }}>
      <IconButton icon='cart' onPress={navigateToCart} mode="contained" />
      <Badge>3</Badge>
    </View>
  )
}

const styles = StyleSheet.create({
})
