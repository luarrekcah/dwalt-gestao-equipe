import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../global/colorScheme';
import Home from './components/Home';

import Business from '../Business';
import User from '../User';

const Tab = createBottomTabNavigator();

const Main = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {backgroundColor: Colors.whitetheme.primary},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Empresa') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Usuário') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#c9c9c9',
      })}
      initialRouteName="Home">
      <Tab.Screen name="Empresa" component={Business} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Usuário" component={User} />
    </Tab.Navigator>
  );
};

export default Main;
