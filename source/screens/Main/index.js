import React from 'react';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../global/colorScheme';
import Home from './components/Home';

import Business from '../Business';
import User from '../User';
import Calls from '../Calls';
import Team from '../Team';
import Plants from '../Plants';

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
            iconName = focused ? 'home-variant' : 'home-variant-outline';
          } else if (route.name === 'Info') {
            iconName = focused ? 'domain' : 'domain';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          } else if (route.name === 'Alertas') {
            iconName = focused ? 'alert' : 'alert-outline';
          } else if (route.name === 'Equipe') {
            iconName = focused
              ? 'account-multiple'
              : 'account-multiple-outline';
          } else if (route.name === 'Plantas') {
            iconName = focused
              ? 'home-lightning-bolt'
              : 'home-lightning-bolt-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Info" component={Business} />
      <Tab.Screen name="Equipe" component={Team} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Plantas" component={Plants} />
      <Tab.Screen name="Alertas" component={Calls} />
      <Tab.Screen name="Perfil" component={User} />
    </Tab.Navigator>
  );
};

export default Main;
