// Credit of this file goes to, ui-kitten, kittenTricks project, here: https://github.com/akveo/kittenTricks
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaLayout = ({ insets, ...props }) => {
  const insetsConfig = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        props.style,
        {
          paddingTop: insets === 'top' ? insetsConfig.top : 0,
          paddingBottom: insets === 'bottom' ? insetsConfig.bottom : 0,
          height: '100%',
        },
      ]}
    />
  );
};
