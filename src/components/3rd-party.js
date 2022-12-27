import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


/**
 * https://github.com/APSL/react-native-keyboard-aware-scroll-view
 */
const KeyboardAvoiding = (props) => {
  // do not directly use this in the app, instead us the KeyboardAvoidingView, because this view is not configured

  const defaultProps = {
    style: { flex: 1 },
    contentContainerStyle: { flexGrow: 1 },
    bounces: false,
    bouncesZoom: false,
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false,
  };

  return React.createElement(KeyboardAwareScrollView, {
    enableOnAndroid: true,
    ...defaultProps,
    ...props,
  });
};

export function KeyboardAvoidingView ({children, style, ...props}) {
  return(
    <KeyboardAvoiding style={style} keyboardShouldPersistTaps='handled' nestedScrollEnabled={true} {...props}>
      {children}
    </KeyboardAvoiding>
  );
}
