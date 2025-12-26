import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Loading({text, status='primary', style, isLoading}) {
  if(!isLoading){
    console.log('loading NOT activated');
    return null;
  }
    console.log('loading activated');
  return(
    <View style={[styles.spinnerContainer, style]}>
      {/* todo: add color to the indicator based on status */}
      <ActivityIndicator />
      {text ?
        <Text>{text}</Text>
      : null }
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingVertical: 16,
    alignItems: 'center',
  },
});
