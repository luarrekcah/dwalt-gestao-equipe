import React from 'react';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../global/colorScheme';
import Home from './components/Home';

import Business from '../Business';
import User from '../User';
import Calls from '../Calls';
import Team from '../Team';

const Tab = AnimatedTabBarNavigator();

const Main = ({navigation}) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#ffffff',
        inactiveTintColor: '#223322',
        activeBackgroundColor: Colors.whitetheme.primary,
      }}
      appearance={{
        shadow: true,
        floating: true,
      }}
      screenOptions={({route}) => ({
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
      })}>
      <Tab.Screen name="Empresa" component={Business} />
      <Tab.Screen name="Equipe" component={Team} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chamados" component={Calls} />
      <Tab.Screen name="Usuário" component={User} />
    </Tab.Navigator>
  );
};

export default Main;
