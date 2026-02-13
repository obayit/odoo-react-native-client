import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import colors from '../components/colors';
import { StyleSheet } from 'react-native';
import ProductDetailsScreen from '../features/ProductDetailsScreen';
import { ScreenNames } from './navigation.constants';
import ProfileScreen from '../features/ProfileScreen';
import EditProfileScreen from '../features/EditProfileScreen';
import CartScreen from '../features/CartScreen';
import MyOrdersScreen from '../features/MyOrdersScreen';
import OrderDetailsScreen from '../features/OrderDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const useHeaderOptions = () => {
  return {
    options: {
      headerShown: true,
      // headerTransparent: true,
      headerTitleAlign: 'center',
      headerTintColor: colors.color_primary_600,
      headerTitleStyle: styles.headerTitleStyle,
      headerStyle: styles.headerStyle,
    }
  }
}

const HomeNavigator = () => {
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
  const homeOptions = {
    title: 'Home',
    tabBarIcon: (props) => tabBarIcon({name: 'home', ...props}),
  }
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
  const profileOptions = {
    tabBarIcon: (props) => tabBarIcon({name: 'account', ...props}),
  }
  const HomeTabs = () =>
    <Tab.Navigator screenOptions={tabBarOptions}>
      {/* <Tab.Screen name='Menus' component={HomeScreen} options={homeOptions}/> */}
      <Tab.Screen name={ScreenNames.Home} component={HomeScreen} options={homeOptions}/>
      <Tab.Screen name={ScreenNames.Products} component={Products} options={productsOptions}/>
      {/* <Tab.Screen name='My Orders' component={OrdersList} options={ordersOptions}/> */}
      <Stack.Screen name={ScreenNames.MyOrders} component={MyOrdersScreen} options={ordersOptions} />
      {/* <Tab.Screen name='Select Model' component={SelectModel} options={selectModelOptions}/> */}
      <Tab.Screen name={ScreenNames.Profile} component={ProfileScreen} options={profileOptions}/>
    </Tab.Navigator>

  return (
    <Stack.Navigator screenOptions={commonHeaderOptions.options}>
      <Stack.Screen name='Home Tabs' component={HomeTabs} options={{headerShown: false}}/>
      <Stack.Screen name='Dynamic List' component={DynamicList} options={dynamicOptions}/>
      <Stack.Screen name='Edit Product' component={EditProduct}/>
      <Stack.Screen name={ScreenNames.ProductDetails} component={ProductDetailsScreen} />
      <Stack.Screen name={ScreenNames.EditProfile} component={EditProfileScreen} />
      <Stack.Screen name={ScreenNames.Cart} component={CartScreen} />
      <Stack.Screen name={ScreenNames.OrderDetails} component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}

const AuthNavigator = () => {
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

const styles = StyleSheet.create({
  tabBarStyle:{
    backgroundColor: '#FAFAFA',
  },
  tabBarText:{
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  headerStyle: {
    backgroundColor: colors.color_info_700,
  },
  headerTitleStyle: {
    color: colors.color_primary_600,
    fontSize: 32,
    fontFamily: 'Roboto_700Bold',
  },
});

/*
new Navigation/Router features:
 - guard screens with Stack.Protected
 - 
*/