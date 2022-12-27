import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleService, useStyleSheet } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// features (aka scenes, aka pages)
import Login from '../features/Login'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const HomeNavigator = () => {
  const styles = useStyleSheet(themedStyles);
  const commonHeaderOptions = {
    headerShown: true,
    headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: '#FFFFFF',
    headerTitleStyle: styles.headerTextStyle,
  }
  const tabBarOptions = {
    ...commonHeaderOptions,
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
  const HomeTabs = () =>
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name='Should be Home' component={Login} options={homeOptions}/>
    </Tab.Navigator>

  return (
    <Stack.Navigator screenOptions={commonHeaderOptions}>
      <Stack.Screen name='Home Tabs' component={HomeTabs} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

const AuthNavigator = () => {
  const styles = useStyleSheet(themedStyles);
  return(
  <Stack.Navigator screenOptions={{
    headerShown: true,
    headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: '#FFFFFF',
    headerTitleStyle: styles.headerTextStyle,
  }}>
    <Stack.Screen name='Sign In' component={Login} options={{headerShown: false}}/>
  </Stack.Navigator>
);
}

export const AppNavigator = () => {
  return(
  <NavigationContainer>
    {false ? <HomeNavigator/> : <AuthNavigator />}
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
  headerTextStyle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Roboto_700Bold',
  },
});
