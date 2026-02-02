import { Text } from 'react-native-paper'

function CustomText({ children, style = undefined, ...props }) {
  // todo: add custom font here (should affect entire app)
  // todo: add other ready components for common text types, e.g: ScreenSectionTitle, LabelText, ValueText, StatusText
  return <Text style={style} {...props}>{children}</Text>
}

export default CustomText
