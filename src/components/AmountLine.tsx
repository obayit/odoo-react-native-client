import { useEffect, useMemo, useState } from "react";
import { Image as NativeImage /* native image doesn't send headers in android */, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import colors from "./colors";

export default function AmountLine({ title, amount, currencyData }) {
  let amountText = amount ?? 0
  if (currencyData?.position && currencyData?.symbol) {
    if (currencyData.position === 'after') {
      amountText = `${amount} ${currencyData.symbol}`
    } else {
      amountText = `${currencyData.symbol} ${amount}`
    }
  }
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 8,
    }}>
      <Text>{title}</Text>
      <View style={{
        flex: 1,
        marginHorizontal: 16,
        borderBottomColor: colors.color_grey_600,
        borderBottomWidth: 1,
      }}/>
      <Text>{amountText}</Text>
    </View>
  )
}
