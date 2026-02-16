// Credit of this file goes to, ui-kitten, kittenTricks project, here: https://github.com/akveo/kittenTricks
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaLayout = ({ insets='vertical', ...props }) => {
  const insetsConfig = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        props.style,
        {
          paddingTop: ['top', 'vertical'].includes(insets) ? insetsConfig.top : 0,
          paddingBottom: ['bottom', 'vertical'].includes(insets) ? insetsConfig.bottom : 0,
          paddingLeft: insetsConfig.left,
          paddingRight: insetsConfig.right,
          height: '100%',
        },
      ]}
    />
  );
};
