import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDataToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('Error saving data:', error);
  }
};

export const loadDataFromStorage = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    return JSON.parse(data);
  } catch (error) {
    console.log('Error loading data:', error);
    return null;
  }
};
