import AsyncStorage from '@react-native-async-storage/async-storage';

export const isLogged = async () => {
  const userAuth = await AsyncStorage.getItem('user');
  return userAuth !== null;
};

export const setUserAuth = async uid => {
  await AsyncStorage.setItem('userAuth', uid);
};

export const getUserAuth = async () => {
  const userAuth = await AsyncStorage.getItem('user');
  return userAuth;
};

export const cleanUserAuth = async () => {
  await AsyncStorage.removeItem('user');
};

export const onLogoutPress = async ({navigation}) => {
  await cleanUserAuth();
  navigation.reset({
    index: 0,
    key: null,
    routes: [{name: 'Intro'}],
  });
};
