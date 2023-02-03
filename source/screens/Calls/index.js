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
import {
  getItems,
  getSurveyData,
  getUserData,
  updateItem,
} from '../../services/Database';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from '../../vendors/moment';
import Colors from '../../global/colorScheme';
import {createNotification} from '../../services/Notification';
import {NoTeam} from '../../components/Global';

const Calls = ({navigation}) => {
  const [survey, setSurvey] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState();

  const loadData = async () => {
    setLoading(true);
    setSurvey(await getSurveyData());
    setUser(await getUserData());
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, [navigation]);

  const acceptSurvey = async (id, projectId) => {
    const haveCurrent = survey.filter(
      item => item.data.accepted && !item.data.finished,
    );
    if (haveCurrent.length !== 0) {
      return ToastAndroid.show(
        'Finalize primeiro o chamado ativo para aceitar outro.',
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
          <TextSection value={'Chamado ativo'} />
          {survey.map(item => {
            if (item.data.accepted && !item.data.finished) {
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
                            path: `/gestaoempresa/business/${user.data.businessKey}/projects/${item.data.projectId}`,
                          });
                          Linking.openURL(
                            'https://www.google.com.br/maps/search/' +
                              project.coords,
                          );
                        } else {
                          acceptSurvey(item.key, item.data.projectId);
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
                          name={'plus'}
                          size={20}
                          color={Colors.whitetheme.primary}
                        />
                      </Text>
                      <Text style={{color: Colors.whitetheme.primary}}>
                        EXECUTAR OS
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
                          path: `/gestaoempresa/business/${user.data.businessKey}/projects/${item.data.projectId}`,
                        });
                        navigation.navigate('ProjectDetails', {
                          project: {
                            key: item.data.projectId,
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
              <Text style={{color: '#000000'}}>Não há chamados ativos.</Text>
            </View>
          ) : (
            ''
          )}
          <TextSection
            value={
              'Chamados pendentes (' +
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
                            path: `/gestaoempresa/business/${user.data.businessKey}/projects/${item.data.projectId}`,
                          });
                          Linking.openURL(
                            'https://www.google.com.br/maps/search/' +
                              project.coords,
                          );
                        } else {
                          acceptSurvey(item.key, item.data.projectId);
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
                          path: `/gestaoempresa/business/${user.data.businessKey}/projects/${item.data.projectId}`,
                        });
                        navigation.navigate('ProjectDetails', {
                          project: {
                            key: item.data.projectId,
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
              'Chamados antigos (' +
              survey.filter(i => i.data.finished).length +
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
              /*return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.card,
                    {
                      borderColor: item.data.accepted ? '#02610a' : '#FF0000',
                    },
                  ]}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.data.accepted
                        ? 'https://img.icons8.com/color/344/time-span.png'
                        : 'https://img.icons8.com/flat_round/64/000000/delete-sign.png',
                    }}
                  />
                  <View style={styles.cardContent}>
                    <Text style={[styles.title]}>{item.data.title}</Text>
                    <Text style={[styles.description]}>{item.data.text}</Text>
                    <Text style={styles.status}>
                      STATUS: {item.data.status}
                    </Text>
                    <Text style={styles.date}>
                      Solicitado {moment(item.data.createdAt).fromNow()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );*/
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
