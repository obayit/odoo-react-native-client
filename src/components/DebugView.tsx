import { Text, StyleSheet, Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { odooApi } from '../common/store/reduxApi'
import { selectConfiguration } from '../common/store/authSlice'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { ScreenNames } from '../navigation/navigation.constants'
import { CustomSpacer } from './Utils'

function DebugView() {
  const debugHook = useDebug()
  const configuration = useSelector(selectConfiguration)
  const navigation = useNavigation()
  useEffect(() => {
    if(!process.env.EXPO_PUBLIC_DEBUG_MODE){
      return
    }
    setTimeout(() => {
      const testProduct =
      // 9 // customizable desk
      // 16 // conference chair
      // 37 // corne keyboard
      0
      ;
      if(testProduct){
        navigation.navigate(ScreenNames.ProductDetails, { recordId: testProduct });
      }
      // navigation.navigate(ScreenNames.EditProfile);
      // navigation.navigate(ScreenNames.Cart);
      // navigation.navigate(ScreenNames.MyOrders);
      // navigation.navigate(ScreenNames.OrderDetails, { recordId: 42 })
    }, 500);
  }, [])
  return null
  return (
    <View style={styles.debugContainer}>
      <Text style={styles.titleText}>Debugging View:</Text>
      <Text>process.env.EXPO_PUBLIC_ODOO_URL = "{process.env.EXPO_PUBLIC_ODOO_URL}"</Text>
      <Text>process.env.EXPO_PUBLIC_ODOO_DB = "{process.env.EXPO_PUBLIC_ODOO_DB}"</Text>
      {/* <Text>configuration "{JSON.stringify(configuration)}"</Text> */}
      <Button onPress={debugHook.clearRtkQuery} title='Clear RTK Query' color='#8A0000' />
      <CustomSpacer />
    </View>
  )
}

function useDebug() {
  const dispatch = useDispatch()
  const clearRtkQuery = () => {
    dispatch(odooApi.util.resetApiState());
  }
  return {
    clearRtkQuery,
  }
}

const styles = StyleSheet.create({
  debugContainer: {
    borderWidth: 1,
    borderColor: 'red',
    margin: 8,
    padding: 8,
    width: '100%',
  },
  button: {
    marginHorizontal: 8,
  },
  titleText: {
    fontWeight: 'bold',
  }
})

export default DebugView
