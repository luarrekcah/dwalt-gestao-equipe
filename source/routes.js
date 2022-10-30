import React, {useEffect, useState} from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from './global/colorScheme';
import {LoadingActivity} from './components/Global';

import {isInitialized} from './services/Welcome';
import {isLogged} from './services/Auth';

const Stack = createNativeStackNavigator();

import Intro from './screens/Intro';
import Login from './screens/Login';
import CompanyLink from './screens/CompanyLink';
import Main from './screens/Main';

const AppScreens = ({logged, initiated}) => {
  return (
    <Stack.Navigator
      initialRouteName={logged ? (initiated ? 'Main' : 'Intro') : 'Login'}
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
      <Stack.Screen
        name="Login"
        component={Login}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Realize o login',
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
      <Stack.Screen
        name="CompanyLink"
        component={CompanyLink}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Última etapa',
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
      <Stack.Screen
        name="Main"
        component={Main}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.dlwalt.com');
              }}>
              <Icon name="settings" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const Routes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initiated, setInitiated] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    async function initialVerifications() {
      if (await isInitialized()) {
        setInitiated(true);
      }

      if (await isLogged()) {
        setLogged(true);
      }

      setIsLoading(false);
    }

    initialVerifications();
  });

  if (isLoading) {
    return <LoadingActivity />;
  }

  return (
    <NavigationContainer>
      <AppScreens logged={logged} initiated={initiated} />
    </NavigationContainer>
  );
};

export default Routes;
