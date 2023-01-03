import database from '@react-native-firebase/database';
import {getUserAuth} from './Auth';

export const createItem = ({path, params}) => {
  if (!path || !params) {
    return console.warn('Sem path ou params!');
  }

  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  database().ref(path).push(params);
};

export const updateItem = ({path, params}) => {
  if (!path || !params) {
    return console.warn('Sem path ou params!');
  }

  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  database().ref(path).update(params);
};

export const setItem = ({path, params}) => {
  if (!path || !params) {
    return console.warn('Sem path ou params!');
  }

  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  database().ref(path).set(params);
};

export const getItems = async ({path}) => {
  if (!path) {
    return console.warn('Sem path ou params!');
  }

  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  const items = await database()
    .ref(path)
    .once('value')
    .then(snapshot => {
      return snapshot.val();
    });
  return items;
};

export const getAllItems = async ({path}) => {
  if (!path) {
    return console.warn('Sem path ou params!');
  }

  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
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

export const getGrowattData = async () => {
  const userLocal = await getUserAuth();
  const growatt = await getItems({
    path: `gestaoempresa/business/${userLocal.businessKey}/growatt`,
  });
  return growatt;
};

export const getUserData = async () => {
  const userLocal = await getUserAuth();
  const staffs = await getAllItems({
    path: `/gestaoempresa/business/${userLocal.businessKey}/staffs`,
  });
  const user = await staffs.find(item => {
    return item.data._id === userLocal._id;
  });
  return user;
};

export const getTeamData = async () => {
  const userData = await getUserData();
  const staffs = await getAllItems({
    path: `/gestaoempresa/business/${userData.data.businessKey}/teams/${userData.data.team.id}/members`,
  });
  return staffs;
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
