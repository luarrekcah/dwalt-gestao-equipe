import React from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from './global/colorScheme';

import Intro from './screens/Intro';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{
          headerShown: true,
        }}>
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={({navigation}) => ({
            headerStyle: {backgroundColor: Colors.whitetheme.primary},
            headerTransparent: true,
            headerTitle: 'D | Walt Gestão',
            headerTitleAlign: 'center',
            headerTitleStyle: {color: 'white'},
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.dlwalt.com/faq');
                }}>
                <Icon name="help" size={30} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
