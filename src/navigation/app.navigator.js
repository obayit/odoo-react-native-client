import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleService, useStyleSheet, useTheme } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// features (aka scenes, aka pages)
import Login from '../features/Login'
import { useSelector } from 'react-redux';
import { selectAuth } from '../common/store/authSlice';
import Products from '../features/Products';
import DynamicList from '../features/DynamicList';
import EditProduct from '../features/EditProduct/';
import SelectModel from '../features/SelectModel';
import OrdersList from '../features/OrdersList';
import HomeScreen from '../features/HomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const useHeaderOptions = () => {
  const theme = useTheme()
  const styles = useStyleSheet(themedStyles);
  return {
    options: {
      headerShown: true,
      // headerTransparent: true,
      headerTitleAlign: 'center',
      headerTintColor: theme['color-primary-default'],
      headerTitleStyle: styles.headerTitleStyle,
      headerStyle: styles.headerStyle,
    }
  }
}

const HomeNavigator = () => {
  console.log('#Render :: HomeNavigator')
  const styles = useStyleSheet(themedStyles);
  const commonHeaderOptions = useHeaderOptions();

  const tabBarOptions = {
    ...commonHeaderOptions.options,
    tabBarLabelStyle: styles.tabBarText,
    tabBarStyle: styles.tabBarStyle,
    tabBarHideOnKeyboard: true,
  }
  const tabBarIcon = ({ name, color, size }) => (
    // https://oblador.github.io/react-native-vector-icons/
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );
  const productsOptions = {
    title: 'Products',
    tabBarIcon: (props) => tabBarIcon({name: 'shopping', ...props}),
  }
  const selectModelOptions = {
    title: 'Select a Model',
    tabBarIcon: (props) => tabBarIcon({name: 'file-search', ...props}),
  }
  const dynamicOptions = {
    title: 'Dynamic List',
    tabBarIcon: (props) => tabBarIcon({name: 'star', ...props}),
  }
  const ordersOptions = {
    tabBarIcon: (props) => tabBarIcon({name: 'star', ...props}),
  }
  const homeOptions = {
    tabBarIcon: (props) => tabBarIcon({name: 'home', ...props}),
  }
  const HomeTabs = () =>
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name='Menus' component={HomeScreen} options={homeOptions}/>
      <Tab.Screen name='My Orders' component={OrdersList} options={ordersOptions}/>
      <Tab.Screen name='Our Products' component={Products} options={productsOptions}/>
      <Tab.Screen name='Select Model' component={SelectModel} options={selectModelOptions}/>
    </Tab.Navigator>

  return (
    <Stack.Navigator screenOptions={commonHeaderOptions.options}>
      <Stack.Screen name='Home Tabs' component={HomeTabs} options={{headerShown: false}}/>
      <Stack.Screen name='Dynamic List' component={DynamicList} options={dynamicOptions}/>
      <Stack.Screen name='Edit Product' component={EditProduct}/>
    </Stack.Navigator>
  );
}

const AuthNavigator = () => {
  console.log('#Render :: AuthNavigator')
  const styles = useStyleSheet(themedStyles);
  const theme = useTheme()
  const commonHeaderOptions = useHeaderOptions();
  return(
  <Stack.Navigator screenOptions={commonHeaderOptions.options}>
    <Stack.Screen name='Sign In' component={Login} options={{headerShown: true}}/>
  </Stack.Navigator>
);
}

export const AppNavigator = () => {
  const auth = useSelector(selectAuth);
  return(
  <NavigationContainer>
    {auth.uid ? <HomeNavigator/> : <AuthNavigator />}
  </NavigationContainer>
  );
}

const themedStyles = StyleService.create({
  tabBarStyle:{
    backgroundColor: '#FAFAFA',
  },
  tabBarText:{
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  headerStyle: {
    backgroundColor: 'color-info-700',
  },
  headerTitleStyle: {
    color: 'color-primary-default',
    fontSize: 32,
    fontFamily: 'Roboto_700Bold',
  },
});
