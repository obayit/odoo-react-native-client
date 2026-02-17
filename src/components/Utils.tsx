import { View } from 'react-native'
import { Divider, Icon, IconButton, Text } from 'react-native-paper'
import { Insets } from 'react-native/types_generated/index'

export function CustomSpacer({ height = 16, width = '100%' }) {
  return <View style={{ height, width }} />
}

export function SectionHeader({ title }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 8,
    }}>
      <Text variant='labelLarge'>{title}</Text>
      <View style={{ borderBottomWidth: 1, borderColor: '#D1D5DB', flex: 1, marginHorizontal: 5, }} />
      <Divider />
    </View>
  )
}

export const hitSlop16: Insets = {
  top: 16,
  bottom: 16,
  left: 16,
  right: 16,
}
