import React from 'react';
import { Pressable } from 'react-native';
import { Icon, StyleService } from '@ui-kitten/components';

export const renderPasswordIcon = ({onPress, passwordVisible, ...props}) => {
  return(
    <Pressable onPress={onPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'}/>
    </Pressable>
  );
}

const themedStyles = StyleService.create({
});
