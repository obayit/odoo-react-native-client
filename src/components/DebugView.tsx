import { Text, StyleSheet, Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { odooApi } from '../common/store/reduxApi'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '../navigation/app.navigator'
import { useEffect } from 'react'
import { selectConfiguration } from '../common/store/authSlice'
import keyframes from 'react-native-reanimated/lib/typescript/css/stylesheet/keyframes'

function DebugView() {
  const debugHook = useDebug()
  // const rootState = useSelector(state => state);
  // console.log('#rootState');
  // console.log(rootState);
  const navigation = useNavigation()
  const configuration = useSelector(selectConfiguration)

  useEffect(() => {
    navigation.navigate(ScreenNames.DashboardView)
    // navigation.navigate(ScreenNames.OurProducts)
  }, [])
  
  return (
    <View style={styles.debugContainer}>
      <Text style={styles.titleText}>Debugging View:</Text>
      {/* <Text>process.env.EXPO_PUBLIC_ODOO_URL = "{process.env.EXPO_PUBLIC_ODOO_URL}"</Text>
      <Text>process.env.EXPO_PUBLIC_ODOO_DB = "{process.env.EXPO_PUBLIC_ODOO_DB}"</Text> */}

      <Text>configuration.baseUrl: {configuration.baseUrl}</Text>
      <Text>configuration.database: {configuration.database}</Text>
      <Button onPress={debugHook.clearRtkQuery} title='Clear RTK Query' color='#8A0000'/>
      <Button onPress={() => navigation.navigate(ScreenNames.DashboardView)} title='Open Dashboard' color='#2255BB'/>
    </View>
  )
}

function useDebug(){
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
