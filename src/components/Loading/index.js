import React from 'react';
import { View } from 'react-native';
import { Spinner, StyleService, Text, useStyleSheet } from '@ui-kitten/components';

export default function Loading({text, status='primary', style}) {
  const styles = useStyleSheet(themedStyles);
  return(
    <View style={[styles.spinnerContainer, style]}>
      <Spinner status={status}/>
      {text &&
        <Text>{text}</Text>
      }
    </View>
  );
};

const themedStyles = StyleService.create({
  spinnerContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingVertical: 16,
    alignItems: 'center',
  },
});
