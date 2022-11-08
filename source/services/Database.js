import database from '@react-native-firebase/database';
import {getUserAuth} from './Auth';

export const createItem = ({path, params}) => {
  if (!path || !params) {
    return {error: 'Sem path'};
  }
  database().ref(path).push(params);
};

export const getAllItems = async ({path}) => {
  if (!path) {
    return {error: 'Sem path'};
  }
  const allItems = await database()
    .ref(path)
    .once('value')
    .then(snapshot => {
      let alldata = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key,
          data = childSnapshot.val();
        alldata.push({key, data});
      });
      return alldata;
    });
  return allItems;
};

export const getBusinessData = async () => {
  const userLocal = await getUserAuth();
  const businessData = await database()
    .ref(`gestaoempresa/business/${userLocal.businessKey}`)
    .once('value')
    .then(snapshot => {
      return snapshot.val();
    });
  const data = {data: businessData, key: userLocal.businessKey};
  return data;
};

export const getUserData = async () => {
  const userLocal = await getUserAuth();
  const staffs = await getAllItems({
    path: `/gestaoempresa/business/${userLocal.businessKey}/staffs`,
  });
  const user = await staffs.find(item => {
    return item.data._id === userLocal._id;
  });
  console.log(user);
  return user;
};

export const getSurveyData = async () => {
  const userLocal = await getUserAuth();
  const surveys = await getAllItems({
    path: `/gestaoempresa/business/${userLocal.businessKey}/surveys`,
  });
  return surveys;
};

export const getStaffsData = async () => {
  const userLocal = await getUserAuth();
  const staffs = await getAllItems({
    path: `/gestaoempresa/business/${userLocal.businessKey}/staffs`,
  });
  return staffs;
};

export const getProjectsData = async () => {
  const userLocal = await getUserAuth();
  const projects = await getAllItems({
    path: `/gestaoempresa/business/${userLocal.businessKey}/projects`,
  });
  return projects;
};
