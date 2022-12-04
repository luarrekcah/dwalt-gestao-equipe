/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Linking,
} from 'react-native';
import {
  LoadingActivity,
  SimpleButton,
  TextSection,
} from '../../global/Components';
import {
  getItems,
  getSurveyData,
  getUserData,
  updateItem,
} from '../../services/Database';

import moment from '../../vendors/moment';
import Colors from '../../global/colorScheme';

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

  const acceptSurvey = async id => {
    const haveCurrent = survey.filter(
      item => item.data.accepted && !item.data.finished,
    );
    if (haveCurrent.length !== 0) {
      return ToastAndroid.show(
        'Finalize primeiro o chamado ativo para aceitar outro.',
        ToastAndroid.SHORT,
      );
    } else {
      updateItem({
        path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${id}`,
        params: {
          accepted: true,
          finished: false,
          status: 'Chamado foi atendido pela empresa',
        },
      });
      loadData();
    }
  };

  const concludeSurvey = id => {
    updateItem({
      path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${id}`,
      params: {
        accepted: true,
        finished: true,
        status: 'Chamado concluído',
      },
    });
    loadData();
  };

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TextSection value={'Chamado ativo'} />
          {survey.map(item => {
            if (item.data.accepted && !item.data.finished) {
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.card,
                    {
                      borderColor: item.data.accepted
                        ? Colors.whitetheme.warning
                        : '#FF0000',
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
                    <ScrollView horizontal>
                      <SimpleButton
                        icon={item.data.accepted ? 'google-maps' : 'plus'}
                        value={
                          item.data.accepted ? 'ABRIR ROTAS' : 'ACEITAR CHAMADO'
                        }
                        type={'success'}
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
                            acceptSurvey(item.key);
                          }
                        }}
                      />
                      <SimpleButton
                        icon="information"
                        value={'VER PROJETO'}
                        type={'primary'}
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
                        }}
                      />
                      {item.data.accepted ? (
                        <SimpleButton
                          icon={item.data.accepted ? 'check' : ''}
                          value={item.data.accepted ? 'CONCLUIR' : ''}
                          type={'success'}
                          onPress={() => {
                            concludeSurvey(item.key);
                            // do somethin
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </ScrollView>
                    <Text style={styles.date}>
                      Solicitado {moment(item.data.createdAt).fromNow()}
                    </Text>
                  </View>
                </TouchableOpacity>
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
                    <ScrollView horizontal>
                      <SimpleButton
                        icon={item.data.accepted ? 'google-maps' : 'plus'}
                        value={
                          item.data.accepted ? 'ABRIR ROTAS' : 'ACEITAR CHAMADO'
                        }
                        type={'success'}
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
                            acceptSurvey(item.key);
                          }
                        }}
                      />
                      <SimpleButton
                        icon="information"
                        value={'VER PROJETO'}
                        type={'primary'}
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
                        }}
                      />
                      {item.data.accepted ? (
                        <SimpleButton
                          icon={item.data.accepted ? 'check' : ''}
                          value={item.data.accepted ? 'CONCLUIR' : ''}
                          type={'success'}
                          onPress={() => {
                            concludeSurvey(item.key);
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
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
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 5,
    backgroundColor: 'white',
    flexBasis: '46%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderLeftWidth: 6,
  },
  title: {
    fontSize: 18,
    flex: 1,
    color: '#000000',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    flex: 1,
    color: '#008080',
  },
  status: {
    color: '#fff',
    paddingHorizontal: 10,
    backgroundColor: Colors.whitetheme.primary,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    flex: 1,
    color: '#696969',
    marginTop: 5,
  },
});

export default Calls;
