import { Text, StyleSheet, Button, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { odooApi } from '../common/store/reduxApi'

function DebugView() {
  const debugHook = useDebug()
  return (
    <View style={styles.debugContainer}>
      <Text style={styles.titleText}>Debugging View:</Text>
      <Text>process.env.REACT_APP_ODOO_URL = "{process.env.REACT_APP_ODOO_URL}"</Text>
      <Text>process.env.REACT_APP_ODOO_DB = "{process.env.REACT_APP_ODOO_DB}"</Text>
      <Text>process.env.EXPO_PUBLIC_API_URL = "{process.env.EXPO_PUBLIC_API_URL}"</Text>
      <Button onPress={debugHook.clearRtkQuery} title='Clear RTK Query' color='#8A0000'/>
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
