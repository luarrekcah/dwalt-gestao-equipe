import AsyncStorage from '@react-native-async-storage/async-storage';

export const isInitialized = async () => {
  const logged = await AsyncStorage.getItem('logged');
  return logged;
};
