/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Linking,
} from 'react-native';
import {LoadingActivity, TextSection} from '../../global/Components';
import {getItems, getSurveyData, updateItem} from '../../services/Database';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from '../../vendors/moment';
import Colors from '../../global/colorScheme';
import {createNotification} from '../../services/Notification';
import {NoTeam} from '../../components/Global';
import {useUser} from '../../hooks/UserContext';
import {
  loadDataFromStorage,
  saveDataToStorage,
} from '../../services/AsyncStorage';

const Calls = ({navigation}) => {
  const {user, setUser} = useUser();
  const [survey, setSurvey] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAndUpdateData = async () => {
    try {
      const surveyData = await getSurveyData();
      await saveDataToStorage('surveyData', surveyData);
      setSurvey(surveyData);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const storedSurveyData = await loadDataFromStorage('surveyData');

      if (storedSurveyData) {
        setSurvey(storedSurveyData);
        setLoading(false);
        fetchAndUpdateData();
      } else {
        const surveyData = await getSurveyData();
        await saveDataToStorage('surveyData', surveyData);
        setSurvey(surveyData);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [navigation]);

  const acceptSurvey = async (id, projectId) => {
    const haveCurrent = survey.filter(
      item =>
        item.data.accepted && !item.data.finished && !item.data.waitingApproval,
    );
    if (haveCurrent.length >= 3) {
      return ToastAndroid.show(
        'Limite de 3 chamados ativos por vez atingido.',
        ToastAndroid.SHORT,
      );
    } else {
      const project = await getItems({
        path: `/gestaoempresa/business/${user.data.businessKey}/projects/${projectId}`,
      });

      if (!project || !project.customerID) {
        return console.warn('Erro, sem customer!');
      }

      updateItem({
        path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${id}`,
        params: {
          accepted: true,
          finished: false,
          waitingApproval: false,
          status: 'Chamado foi atendido pela empresa',
        },
      });

      createNotification(
        'Chamado atendido!',
        'Seu chamado acabou de ser atendido pela empresa',
        user.data.businessKey,
        project.customerID,
      );
      loadData();
    }
  };

  if (loading) {
    return <LoadingActivity />;
  } else if (user.data.team.id === '') {
    return <NoTeam />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TextSection value={'OS ativa'} />
          {survey.map(item => {
            if (
              item.data.accepted &&
              !item.data.finished &&
              !item.data.waitingApproval
            ) {
              return (
                <View style={styles.card} key={item.key}>
                  <View style={styles.row}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                      {item.data.title}
                    </Text>
                    <View style={styles.status}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        {item.data.status}
                      </Text>
                    </View>
                  </View>
                  {item.data.customer ? (
                    <View
                      style={{
                        padding: 20,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          marginBottom: 10,
                          fontWeight: 'bold',
                        }}>
                        DADOS DO CLIENTE
                      </Text>
                      <Text style={{color: '#000'}}>
                        Nome: {item.data.customer.name}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Documento: {item.data.customer.document}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Projeto: {item.data.project.name}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                  <Text style={{marginVertical: 20}}>{item.data.text}</Text>
                  <View style={[styles.row, {marginVertical: 20}]}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        if (item.data.accepted) {
                          ToastAndroid.show(
                            'Abrindo o Google Maps, aguarde 5 segundos.',
                            ToastAndroid.SHORT,
                          );
                          const project = await getItems({
                            path: `/gestaoempresa/business/${
                              user.data.businessKey
                            }/projects/${
                              item.data.projectId || item.data.project.id
                            }`,
                          });
                          Linking.openURL(
                            'https://www.google.com.br/maps/search/' +
                              project.coords,
                          );
                        } else {
                          acceptSurvey(
                            item.key,
                            item.data.projectId || item.data.project.id,
                          );
                        }
                      }}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        <Icon
                          name={item.data.accepted ? 'google-maps' : 'plus'}
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        {item.data.accepted ? 'ROTAS' : 'ACEITAR'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        navigation.navigate('AddSurveyData', {key: item.key});
                      }}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        <Icon
                          name={
                            item.data.waitingApproval ? 'database-edit' : 'plus'
                          }
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        {item.data.waitingApproval
                          ? 'Corrigir OS'
                          : 'EXECUTAR OS'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        ToastAndroid.show(
                          'Abrindo informações do projeto, aguarde.',
                          ToastAndroid.SHORT,
                        );
                        const project = await getItems({
                          path: `/gestaoempresa/business/${
                            user.data.businessKey
                          }/projects/${
                            item.data.projectId || item.data.project.id
                          }`,
                        });
                        navigation.navigate('ProjectDetails', {
                          project: {
                            key: item.data.projectId || item.data.project.id,
                            data: project,
                          },
                        });
                      }}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        <Icon
                          name={'information'}
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        INFOS
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    <Icon name={'clock'} size={20} color={'#fff'} />{' '}
                    {moment(item.data.createdAt).fromNow()}
                  </Text>
                </View>
              );
            }
          })}
          {survey.filter(i => i.data.accepted && !i.data.finished).length ===
          0 ? (
            <View style={{alignContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#000000'}}>Não há OS ativa.</Text>
            </View>
          ) : (
            ''
          )}
          <TextSection
            value={
              'OS Aguardando Encerramento (' +
              survey.filter(i => !i.data.finished && i.data.waitingApproval)
                .length +
              ')'
            }
          />
          {survey.map(item => {
            if (
              item.data.accepted &&
              !item.data.finished &&
              item.data.waitingApproval
            ) {
              return (
                <View style={styles.card} key={item.key}>
                  <View style={styles.row}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                      {item.data.title}
                    </Text>
                    <View style={styles.status}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        {item.data.status}
                      </Text>
                    </View>
                  </View>
                  {item.data.customer ? (
                    <View
                      style={{
                        padding: 20,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          marginBottom: 10,
                          fontWeight: 'bold',
                        }}>
                        DADOS DO CLIENTE
                      </Text>
                      <Text style={{color: '#000'}}>
                        Nome: {item.data.customer.name}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Documento: {item.data.customer.document}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Projeto: {item.data.project.name}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                  <Text style={{marginVertical: 20}}>{item.data.text}</Text>
                  <View style={[styles.row, {marginVertical: 20}]}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        if (item.data.accepted) {
                          ToastAndroid.show(
                            'Abrindo o Google Maps, aguarde 5 segundos.',
                            ToastAndroid.SHORT,
                          );
                          const project = await getItems({
                            path: `/gestaoempresa/business/${
                              user.data.businessKey
                            }/projects/${
                              item.data.projectId || item.data.project.id
                            }`,
                          });
                          Linking.openURL(
                            'https://www.google.com.br/maps/search/' +
                              project.coords,
                          );
                        } else {
                          acceptSurvey(
                            item.key,
                            item.data.projectId || item.data.project.id,
                          );
                        }
                      }}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        <Icon
                          name={item.data.accepted ? 'google-maps' : 'plus'}
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        {item.data.accepted ? 'ROTAS' : 'ACEITAR'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        navigation.navigate('AddSurveyData', {key: item.key});
                      }}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        <Icon
                          name={
                            item.data.waitingApproval ? 'database-edit' : 'plus'
                          }
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        {item.data.waitingApproval
                          ? 'Corrigir OS'
                          : 'EXECUTAR OS'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        ToastAndroid.show(
                          'Abrindo informações do projeto, aguarde.',
                          ToastAndroid.SHORT,
                        );
                        const project = await getItems({
                          path: `/gestaoempresa/business/${
                            user.data.businessKey
                          }/projects/${
                            item.data.projectId || item.data.project.id
                          }`,
                        });
                        navigation.navigate('ProjectDetails', {
                          project: {
                            key: item.data.projectId || item.data.project.id,
                            data: project,
                          },
                        });
                      }}>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        <Icon
                          name={'information'}
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        INFOS
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    <Icon name={'clock'} size={20} color={'#fff'} />{' '}
                    {moment(item.data.createdAt).fromNow()}
                  </Text>
                </View>
              );
            }
          })}
          {survey.filter(i => i.data.waitingApproval && !i.data.finished)
            .length === 0 ? (
            <View style={{alignContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#000000'}}>Não há OS em fila.</Text>
            </View>
          ) : (
            ''
          )}
          <TextSection
            value={
              'OS pendentes (' +
              survey.filter(i => !i.data.finished && !i.data.accepted).length +
              ')'
            }
          />
          {survey.map(item => {
            if (!item.data.finished && !item.data.accepted) {
              return (
                <View
                  style={[
                    styles.card,
                    {backgroundColor: Colors.whitetheme.warning},
                  ]}
                  key={item.key}>
                  <View style={styles.row}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                      {item.data.title}
                    </Text>
                    <View style={styles.status}>
                      <Text style={{color: Colors.whitetheme.warning}}>
                        {item.data.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={{marginVertical: 20}}>{item.data.text}</Text>
                  {item.data.customer ? (
                    <View
                      style={{
                        padding: 20,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          marginBottom: 10,
                          fontWeight: 'bold',
                        }}>
                        DADOS DO CLIENTE
                      </Text>
                      <Text style={{color: '#000'}}>
                        Nome: {item.data.customer.name}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Documento: {item.data.customer.document}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Projeto: {item.data.project.name}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                  <View style={[styles.row, {marginVertical: 20}]}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        if (item.data.accepted) {
                          ToastAndroid.show(
                            'Abrindo o Google Maps, aguarde 5 segundos.',
                            ToastAndroid.SHORT,
                          );
                          const project = await getItems({
                            path: `/gestaoempresa/business/${
                              user.data.businessKey
                            }/projects/${
                              item.data.projectId || item.data.project.id
                            }`,
                          });
                          Linking.openURL(
                            'https://www.google.com.br/maps/search/' +
                              project.coords,
                          );
                        } else {
                          acceptSurvey(
                            item.key,
                            item.data.projectId || item.data.project.id,
                          );
                        }
                      }}>
                      <Text style={{color: Colors.whitetheme.warning}}>
                        <Icon
                          name={item.data.accepted ? 'google-maps' : 'plus'}
                          size={20}
                          color={Colors.whitetheme.warning}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.warning}}>
                        {item.data.accepted ? 'ROTAS' : 'ACEITAR'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={async () => {
                        ToastAndroid.show(
                          'Abrindo informações do projeto, aguarde.',
                          ToastAndroid.SHORT,
                        );
                        const project = await getItems({
                          path: `/gestaoempresa/business/${
                            user.data.businessKey
                          }/projects/${
                            item.data.projectId || item.data.project.id
                          }`,
                        });
                        navigation.navigate('ProjectDetails', {
                          project: {
                            key: item.data.projectId || item.data.project.id,
                            data: project,
                          },
                        });
                      }}>
                      <Text style={{color: Colors.whitetheme.warning}}>
                        <Icon
                          name={'information'}
                          size={20}
                          color={Colors.whitetheme.warning}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.warning}}>
                        INFOS
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    <Icon name={'clock'} size={20} color={'#fff'} />{' '}
                    {moment(item.data.createdAt).fromNow()}
                  </Text>
                </View>
              );
            }
          })}
          {survey.filter(i => !i.data.finished && !i.data.accepted).length ===
          0 ? (
            <View style={{alignContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#000000'}}>Não há chamados pendentes.</Text>
            </View>
          ) : (
            ''
          )}
          <TextSection
            value={
              'OSs antigas (' +
              survey.reverse().filter(i => i.data.finished).length +
              ')'
            }
          />
          {survey.map(item => {
            if (!item.data.finished) {
              return;
            } else {
              return (
                <View
                  style={[
                    styles.card,
                    {backgroundColor: Colors.whitetheme.success},
                  ]}
                  key={item.key}>
                  <View style={styles.row}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>
                      {item.data.title}
                    </Text>
                    <View style={styles.status}>
                      <Text style={{color: Colors.whitetheme.success}}>
                        {item.data.status}
                      </Text>
                    </View>
                  </View>
                  {item.data.customer ? (
                    <View
                      style={{
                        padding: 20,
                        backgroundColor: '#fff',
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          marginBottom: 10,
                          fontWeight: 'bold',
                          marginTop: 10,
                        }}>
                        DADOS DO CLIENTE
                      </Text>
                      <Text style={{color: '#000'}}>
                        Nome: {item.data.customer.name}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Documento: {item.data.customer.document}
                      </Text>
                      <Text style={{color: '#000'}}>
                        Projeto: {item.data.project.name}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                  <Text style={{marginVertical: 20}}>{item.data.text}</Text>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    <Icon name={'clock'} size={20} color={'#fff'} />{' '}
                    {moment(item.data.createdAt).fromNow()}
                  </Text>
                </View>
              );
            }
          })}
        </ScrollView>
      </View>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.whitetheme.primary,
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  status: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Calls;
