import React from "react"
import { View } from "react-native"
import { StyleService } from "@ui-kitten/components"
import Spinner from "react-native-loading-spinner-overlay"

export const LoadingOverlay = ({ loading }) => {
  return (
    <View>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(0, 0, 0, 0.75)"
      />
    </View>
  )
}

const styles = StyleService.create({
  spinnerTextStyle: {
    color: "#fff"
  }
})
