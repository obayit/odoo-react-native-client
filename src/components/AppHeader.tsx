import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton, Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../navigation/navigation.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CartButton from "./CartButton";
import { hitSlop16 } from "./Utils";

export default function AppHeader() {
  const navigation = useNavigation()
  const canGoBack = navigation.canGoBack()
  return (
    <View style={{
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 8,
    }}>
      {canGoBack ? <IconButton
        mode="contained"
        style={styles.backButton}
        icon='chevron-left'
        hitSlop={hitSlop16}
        onPress={() => navigation.canGoBack() && navigation.goBack()} />
        : null}
      <View style={{ flex: 1 }} />
      <CartButton />
    </View>
  )
}

const styles = StyleSheet.create({
  backButton: {
    // borderWidth: 1, borderColor: 'red',
  },
})
