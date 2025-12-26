import React from 'react';
import { Pressable } from 'react-native';

export const renderPasswordIcon = ({onPress, passwordVisible, ...props}) => {
  return(
    <Pressable onPress={onPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'}/>
    </Pressable>
  );
}

/*
    npm uninstall @react-navigation/bottom-tabs @react-navigation/native @react-navigation/stack

    "@react-navigation/bottom-tabs": "^7.9.0",
    "@react-navigation/native": "^7.1.26",
    "@react-navigation/stack": "^7.6.13",
    npm uninstall @expo/webpack-config @expo/dom-webview

    react-hook-form yup @react-navigation/bottom-tabs @react-navigation/native @react-navigation/stack 
*/
