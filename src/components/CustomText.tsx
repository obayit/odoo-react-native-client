import { Text } from 'react-native'

function CustomText({ children, style = undefined }) {
  // todo: add custom font here (should affect entire app)
  // todo: add other ready components for common text types, e.g: ScreenSectionTitle, LabelText, ValueText, StatusText
  return <Text style={style}>{children}</Text>
}

export default CustomText
