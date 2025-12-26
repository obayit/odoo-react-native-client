import React from "react"
import { View } from 'react-native'

export function InputWrapper({ name, childStyle, errors, children, style }) {
  // get the margins from the input's style
  const errorStyle = getMarginFromStyle(childStyle)
  return (
    <View style={style}>
      {children}
      {errors && errors[name] && (
        <Text status="danger" style={errorStyle}>
          {errors[name]?.message}
        </Text>
      )}
    </View>
  )
}

function getMarginFromStyle(style) {
  // here we only are looking for the margin value of the original input, so that the error message will align with that input
  let errorMarginLeft = 10

  if (style instanceof Array) {
    style.map((currStyle) => {
      if (currStyle && currStyle.marginLeft) {
        errorMarginLeft = currStyle.marginLeft // priority for margin left
      } else if (currStyle && currStyle.marginHorizontal) {
        errorMarginLeft = currStyle.marginHorizontal // priority for margin left
      }
    })
  } else if (style) {
    if (style.marginLeft) {
      errorMarginLeft = style.marginLeft // priority for margin left
    } else if (style.marginHorizontal) {
      errorMarginLeft = style.marginHorizontal // priority for margin left
    }
  }
  return {
    marginLeft: errorMarginLeft ? errorMarginLeft : 10
  }
}
