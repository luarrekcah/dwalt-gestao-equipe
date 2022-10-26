import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../global/colorScheme';
import Home from './components/Home';

import Business from '../Business';
import User from '../User';
import Calls from '../Calls';
import Team from '../Team';

import {StyleSheet, Text, View} from 'react-native';

const Tab = createBottomTabNavigator();

const Main = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: Colors.whitetheme.primary, height: 75},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Empresa') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Usuário') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Chamados') {
            iconName = focused ? 'warning' : 'warning-outline';
          } else if (route.name === 'Equipe') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return (
            <View
              style={[
                styles.centerIconsTab,
                focused
                  ? [styles.iconTabHome, styles.iconTabActive]
                  : styles.iconTabHome,
              ]}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused || route.name === 'Home' ? (
                ''
              ) : (
                <Text>{route.name}</Text>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#c9c9c9',
      })}
      initialRouteName="Home">
      <Tab.Screen name="Empresa" component={Business} />
      <Tab.Screen name="Equipe" component={Team} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chamados" component={Calls} />
      <Tab.Screen name="Usuário" component={User} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconTabHome: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconTabActive: {
    width: 60,
    height: 100,
    backgroundColor: Colors.whitetheme.primaryDark,
  },
  centerIconsTab: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default Main;
