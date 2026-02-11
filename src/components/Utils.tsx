import { View } from 'react-native'
import { Divider, Text } from 'react-native-paper'

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