import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const isLogged = async () => {
  const userAuth = await AsyncStorage.getItem('user');
  return userAuth !== null;
};

export const setUserAuth = async uid => {
  await AsyncStorage.setItem('userAuth', uid);
};

export const getUserAuth = async () => {
  const userAuth = JSON.parse(await AsyncStorage.getItem('user'));
  return userAuth;
};

export const cleanUserAuth = async () => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('logged');
};

export const saveUserAuth = async user => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const onLogoutPress = async ({navigation}) => {
  try {
    await GoogleSignin.signInSilently();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
  await cleanUserAuth();
  navigation.reset({
    index: 0,
    key: null,
    routes: [{name: 'Login'}],
  });
};
