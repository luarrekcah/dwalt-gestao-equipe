import React, {useEffect, useState} from 'react';
import {
  Linking,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';

import Colors from './global/colorScheme';
import {LoadingActivity, NotConnected} from './components/Global';

import {isInitialized} from './services/Welcome';
import {isLogged} from './services/Auth';

const Stack = createNativeStackNavigator();

import Intro from './screens/Intro';
import Login from './screens/Login';
import CompanyLink from './screens/CompanyLink';
import Main from './screens/Main';
import Config from './screens/Config';
import ProjectDetails from './screens/ProjectDetails';
import PdfViewer from './screens/PdfViewer';
import UpdateProject from './screens/UpdateProject';
import ScanScreen from './screens/ScanScreen';
import AddSurveyData from './screens/AddSurveyData';

const AppScreens = ({logged, initiated}) => {
  return (
    <Stack.Navigator
      initialRouteName={logged ? (initiated ? 'Main' : 'Login') : 'Intro'}
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="Intro"
        component={Intro}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: true,
          headerTitle: 'Connect',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.dlwalt.com/faq');
              }}>
              <Icon name="help-circle" size={30} color="#fff" />
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
              <Icon name="help-circle" size={30} color="#fff" />
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
              <Icon name="help-circle" size={30} color="#fff" />
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
          headerTitle: 'Connect',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.dlwalt.com/faq');
              }}>
              <Icon name="help-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ScanScreen');
              }}>
              <Icon name="qrcode-scan" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Config"
        component={Config}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Config',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrow-left-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetails}
        options={({navigation, route}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Detalhes',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrow-left-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <Menu>
                <MenuTrigger>
                  <Icon name="plus" size={30} color="#fff" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption
                    style={styles.menuOption}
                    onSelect={() => {
                      const project = route.params.project;
                      navigation.navigate('UpdateProject', {project});
                    }}>
                    <View style={styles.center}>
                      <Text style={styles.menuText}>Atualizar dados</Text>
                    </View>
                  </MenuOption>
                  <MenuOption
                    style={styles.menuOption}
                    onSelect={() => {
                      if (
                        route.params.project.data.overview &&
                        route.params.project.data.username_growatt !== ''
                      ) {
                        return ToastAndroid.show(
                          'Em breve',
                          ToastAndroid.SHORT,
                        );
                      } else {
                        return ToastAndroid.show(
                          'Opção indisponível para esse projeto',
                          ToastAndroid.SHORT,
                        );
                      }
                    }}>
                    <View style={styles.center}>
                      <Text style={styles.menuText}>Registrar datalogger</Text>
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="PdfViewer"
        component={PdfViewer}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Visualizador',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrow-left-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="UpdateProject"
        component={UpdateProject}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Editando',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrow-left-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Leitor QR',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrow-left-circle" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddSurveyData"
        component={AddSurveyData}
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Colors.whitetheme.primary},
          headerTransparent: false,
          headerTitle: 'Adicionar dados',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: 'white'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="arrow-left-circle" size={30} color="#fff" />
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
  const [isConnected, setisConnected] = useState(false);

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

  NetInfo.fetch().then(state => {
    setisConnected(state.isConnected);
  });

  if (isLoading) {
    return <LoadingActivity />;
  }

  if (!isConnected) {
    return <NotConnected />;
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <AppScreens logged={logged} initiated={initiated} />
      </NavigationContainer>
    </MenuProvider>
  );
};

const styles = new StyleSheet.create({
  menuOption: {paddingHorizontal: 10, paddingVertical: 20},
  menuText: {color: Colors.whitetheme.primary, fontSize: 15},
  menuIcon: {paddingRight: 10},
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Routes;
