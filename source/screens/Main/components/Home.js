/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Colors from '../../../global/colorScheme';
import {
  LoadingActivity,
  MiniCard,
  TextSection,
} from '../../../global/Components';
import {status} from '../../../utils/dictionary';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAllItems,
  getBusinessData,
  getGrowattData,
  getItems,
  getProjectsData,
  getSurveyData,
  getUserData,
} from '../../../services/Database';
import moment from '../../../vendors/moment';

const Home = ({navigation}) => {
  const [user, setUser] = React.useState();
  const [business, setBusiness] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [survey, setSurvey] = React.useState([]);
  const [projects, setProjects] = React.useState();
  const [staffs, setStaffs] = React.useState();
  const [customers, setCustomers] = React.useState();
  const [activeSurvey, setActiveSurvey] = React.useState([]);
  const [growatt, setGrowatt] = React.useState();

  const loadData = async () => {
    setLoading(true);
    setGrowatt(await getGrowattData());
    setUser(await getUserData());
    const surveys = await getSurveyData();
    const businesss = await getBusinessData();
    const actSurvey = surveys.filter(i => i.data.accepted && !i.data.finished);
    setBusiness(businesss);
    setSurvey(surveys);
    setProjects(await getProjectsData());
    setStaffs(
      await getAllItems({
        path: `gestaoempresa/business/${businesss.key}/staffs`,
      }),
    );
    setCustomers(
      await getAllItems({
        path: `gestaoempresa/business/${businesss.key}/customers`,
      }),
    );
    setActiveSurvey(actSurvey);
    setLoading(false);
  };

  const getKwp = () => {
    let kwpTotal = 0;
    projects.forEach(item => {
      kwpTotal += Number(item.data.kwp.replaceAll(',', '.'));
    });
    return kwpTotal;
  };

  const getGrowattProject = plantName => {
    if (growatt) {
      const finded = growatt.plantList.data.data.plants.find(
        g => g.name === plantName,
      );
      return finded;
    } else {
      return [];
    }
  };

  const statusDict = {
    0: {
      title: 'Desconectado',
      color: '#a19f9f',
    },
    1: {
      title: 'Normal',
      color: '#13fc03',
    },
    2: {
      title: 'Aguardando',
      color: '#13fc03',
    },
    3: {
      title: 'Falha',
      color: '#fa3916',
    },
    4: {
      title: 'Offline',
      color: '#a19f9f',
    },
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await loadData();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerDetail}>
            <Text style={styles.welcome}>
              Bem vindo{user === undefined ? '' : ' ' + user.data.nome}!
            </Text>
            <Text style={styles.linkedOn}>
              Vinculado a {business.data.info.documents.nome_fantasia}
            </Text>
          </View>
          <View style={styles.backgroundDetail}>
            {!user.data.team || user.data.team.id === '' ? (
              <View style={[styles.emptyCard]}>
                <View>
                  <Text style={styles.titleCards}>Em nenhuma equipe!</Text>
                  <Text style={{color: Colors.whitetheme.gray, fontSize: 15}}>
                    Seu acesso as informações só será liberado assim que a
                    empresa lhe adicionar em uma equipe.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.emptyCard, {height: 100}]}>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    {`Equipe ${user.data.team.name}`}
                  </Text>
                </View>
                <Text style={{color: '#fff'}}>
                  Seu cargo: {user.data.team.role}
                </Text>
              </View>
            )}

            <TextSection value={'Informações'} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MiniCard
                content={[
                  `${survey.filter(i => !i.data.finished).length}`,
                  'Chamados',
                ]}
                iconName="alert"
                colorBackground={'#d97c02'}
                iconSize={40}
              />
              <MiniCard
                content={[`${projects.length}`, 'Projetos']}
                iconName="solar-panel"
                iconSize={40}
              />
              <MiniCard
                content={[getKwp(), 'kWp']}
                iconName="flash"
                iconSize={40}
              />
              <MiniCard
                content={[staffs.length, 'Staffs']}
                iconName="hammer-wrench"
                iconSize={40}
              />
              <MiniCard
                content={[customers.length, 'Clientes']}
                iconName="account-multiple"
                iconSize={40}
              />
            </ScrollView>
            <TextSection value={'Chamado em andamento'} />

            {activeSurvey.length !== 0 ? (
              <TouchableOpacity
                style={styles.marginCard}
                key={activeSurvey[0].key}
                onPress={async () => {
                  ToastAndroid.show(
                    'Abrindo informações do projeto, aguarde.',
                    ToastAndroid.SHORT,
                  );
                  const project = await getItems({
                    path: `/gestaoempresa/business/${user.data.businessKey}/projects/${activeSurvey[0].data.projectId}`,
                  });
                  navigation.navigate('ProjectDetails', {
                    project: {
                      key: activeSurvey[0].data.projectId,
                      data: project,
                    },
                  });
                }}>
                <ImageBackground
                  imageStyle={styles.imageCard}
                  source={require('../../../../assets/home/survey.jpg')}>
                  <View style={styles.projectCard}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}>
                      {activeSurvey[0].data.title}
                    </Text>
                    <Text
                      style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        fontSize: 14,
                        color: '#fff',
                      }}>
                      {activeSurvey[0].data.text}
                    </Text>
                    <Text
                      style={{
                        marginVertical: 20,
                        alignSelf: 'center',
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}>
                      Status: {activeSurvey[0].data.status}
                    </Text>
                    <Text style={{alignSelf: 'center', color: '#fff'}}>
                      Solicitado{' '}
                      {moment(activeSurvey[0].data.createdAt).fromNow()}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ) : (
              <ImageBackground
                imageStyle={styles.imageCard}
                source={require('../../../../assets/home/no-content.jpg')}>
                <View style={styles.emptyCardNB}>
                  <Text
                    style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                    Nenhuma solicitação ativa
                  </Text>
                </View>
              </ImageBackground>
            )}

            <TextSection value={'Projetos'} />
            {projects.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                  Nenhum projeto registrado
                </Text>
              </View>
            ) : (
              projects.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={styles.marginCard}
                    key={index}
                    onPress={() =>
                      navigation.navigate('ProjectDetails', {project: item})
                    }>
                    <ImageBackground
                      imageStyle={styles.imageCard}
                      source={require('../../../../assets/home/bannerbackground.jpg')}>
                      <View style={styles.projectCard}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#fff',
                              fontWeight: 'bold',
                            }}>
                            {item.data.apelidoProjeto}
                          </Text>
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#fff',
                              fontWeight: 'bold',
                            }}>
                            <Icon name="flash-on" size={20} color="#fff" />
                            {item.data.kwp}
                            kWp
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              backgroundColor: '#fff',
                              paddingHorizontal: 10,
                              marginRight: 20,
                              paddingVertical: 5,
                              borderRadius: 100,
                            }}>
                            <Text
                              style={{
                                color: Colors.whitetheme.primary,
                                fontWeight: 'bold',
                                fontSize: 10,
                              }}>
                              {item.data.category.toUpperCase()}
                            </Text>
                          </View>
                          {item.data.username_growatt && growatt ? (
                            <>
                              <Text
                                style={{
                                  color: `${
                                    statusDict[
                                      getGrowattProject(
                                        item.data.username_growatt,
                                      ).status
                                    ].color
                                  }`,
                                  fontWeight: 'bold',
                                }}>
                                {
                                  statusDict[
                                    getGrowattProject(
                                      item.data.username_growatt,
                                    ).status
                                  ].title
                                }
                              </Text>
                              <Text
                                style={{
                                  fontSize: 20,
                                  color: '#fff',
                                  fontWeight: 'bold',
                                }}>
                                <Icon
                                  name="battery-charging-full"
                                  size={20}
                                  color="#fff"
                                />
                                {
                                  getGrowattProject(item.data.username_growatt)
                                    .total_energy
                                }
                                kW
                              </Text>
                            </>
                          ) : (
                            ''
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          <Text style={{color: '#fff', fontWeight: '900'}}>
                            {status({value: item.data.Status})}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                          }}>
                          <Text style={{color: '#fff'}}>
                            {item.data.RStatus === '' ||
                            item.data.RStatus === undefined
                              ? 'Sem observação de Status'
                              : item.data.RStatus}
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    backgroundColor: Colors.whitetheme.primary,

  },
  welcome: {
    color: '#f5f5f5',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 15,
  },
  linkedOn: {
    color: '#d1d1d1',
    fontSize: 20,
    marginBottom: 20,
  },
  headerDetail: {padding: 10},
  backgroundDetail: {
    backgroundColor: Colors.whitetheme.backgroundColor,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 100,
  },
  nullWarn: {color: '#000000', alignSelf: 'center'},
  marginCard: {marginVertical: 10},
  projectCard: {
    padding: 30,
    borderRadius: 20,
  },
  imageCard: {borderRadius: 20},
  projectTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  projectCategory: {
    color: Colors.whitetheme.gray,
    fontSize: 20,
  },
  bottomProject: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomKwp: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  bottomStatus: {
    color: Colors.whitetheme.gray,
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyCard: {
    padding: 30,
    borderRadius: 20,
    height: 200,
    backgroundColor: Colors.whitetheme.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCardNB: {
    padding: 30,
    borderRadius: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCards: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default Home;
