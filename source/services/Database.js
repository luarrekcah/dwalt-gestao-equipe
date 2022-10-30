import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

export const getUserData = async () => {
  const userLocal = await AsyncStorage.getItem('user').then(async data => {
    return await JSON.parse(data);
  });
  const user = await database()
    .ref('/gestaoempresa/funcionarios')
    .once('value')
    .then(snapshot => {
      const all = snapshot.val();
      const actUser = all.find(item => {
        return item._id === userLocal._id;
      });
      return actUser;
    });
  return user;
};
