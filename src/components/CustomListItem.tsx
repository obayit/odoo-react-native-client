import { Text, TouchableOpacity } from "react-native"
import { ReusableStyles } from "./styles"

function CustomListItem({ title, accessoryRight, onPress, style }) {
  const styles = ReusableStyles
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={styles.listItem}>{title}</Text>
      {accessoryRight ? accessoryRight() : null}
    </TouchableOpacity>
  )
}

export default CustomListItem
