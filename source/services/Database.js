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

export const getBusinessData = async () => {
  const userLocal = await AsyncStorage.getItem('user').then(async data => {
    return await JSON.parse(data);
  });
  const business = await database()
    .ref('/gestaoempresa/empresa')
    .once('value')
    .then(snapshot => {
      const all = snapshot.val();
      const actBusiness = all.find(item => {
        return item._id === userLocal.email_link;
      });
      return actBusiness;
    });
  return business;
};

export const getSurveyData = async () => {
  const survey = await database()
    .ref('/gestaoempresa/survey')
    .once('value')
    .then(snapshot => {
      return snapshot.val();
    });
  return survey;
};
