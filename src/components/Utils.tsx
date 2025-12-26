import { View } from 'react-native'

export function CustomSpacer({ height = 16, width = '100%' }) {
    return <View style={{ height, width }} />
}