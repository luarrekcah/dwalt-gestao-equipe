import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../global/colorScheme';
import Home from './components/Home';

import Business from '../Business';
import User from '../User';
import {StyleSheet, Text, View} from 'react-native';

const Tab = createBottomTabNavigator();

const Main = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {backgroundColor: Colors.whitetheme.primary},
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
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#c9c9c9',
      })}
      initialRouteName="Home">
      <Tab.Screen name="Empresa" component={Business} />
      <Tab.Screen name="Equipe" component={Home} />
      <Tab.Screen
        name="Home"
        component={Home}
        options={({route}) => ({
          tabBarIcon: ({focused, color, size}) => (
            <View
              style={
                focused
                  ? [styles.iconTabHome, styles.iconTabActive]
                  : styles.iconTabHome
              }>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        })}
      />
      <Tab.Screen name="Chamados" component={Home} />
      <Tab.Screen name="Usuário" component={User} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconTabHome: {
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: Colors.whitetheme.primary,
  },
  iconTabActive: {
    marginBottom: 20,
    width: 60,
    height: 60,
  },
});

export default Main;
