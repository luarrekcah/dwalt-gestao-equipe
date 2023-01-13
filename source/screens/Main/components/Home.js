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
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../global/colorScheme';
import {MiniCard, TextSection} from '../../../global/Components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getAllItems,
  getBusinessData,
  getItems,
  getProjectsData,
  getSurveyData,
  getUserData,
} from '../../../services/Database';
import moment from '../../../vendors/moment';
import {NoTeam} from '../../../components/Global';

const Home = ({navigation}) => {
  const [user, setUser] = React.useState();
  const [business, setBusiness] = React.useState();
  const [survey, setSurvey] = React.useState([]);
  const [projects, setProjects] = React.useState();
  const [staffs, setStaffs] = React.useState();
  const [customers, setCustomers] = React.useState();
  const [activeSurvey, setActiveSurvey] = React.useState([]);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [loadingInfo, setLoadingInfo] = React.useState(true);

  const loadData = async () => {
    setLoadingUser(true);
    setLoadingInfo(true);
    //-
    setUser(await getUserData());
    const businesss = await getBusinessData();
    setBusiness(businesss);
    setLoadingUser(false);
    //-
    const surveys = await getSurveyData();
    const actSurvey = surveys.filter(i => i.data.accepted && !i.data.finished);
    setSurvey(surveys);
    setActiveSurvey(actSurvey);
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
    setLoadingInfo(false);
    //-
  };

  const getKwp = () => {
    if (projects === undefined) {
      return;
    }
    let kwpTotal = 0;
    projects.forEach(item => {
      kwpTotal += Number(item.data.kwp.replaceAll(',', '.'));
    });
    return kwpTotal;
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await loadData();
    });
    return unsubscribe;
  }, [navigation]);

  if (!loadingUser && user.data.team.id === '') {
    return <NoTeam />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loadingUser ? (
            <ActivityIndicator size="large" color={Colors.whitetheme.primary} />
          ) : (
            <View style={styles.headerDetail}>
              <Text style={styles.welcome}>
                Bem vindo(a){user === undefined ? '' : ' ' + user.data.nome}!
              </Text>
              <Text style={styles.linkedOn}>
                Vinculado(a) a {business.data.info.documents.nome_fantasia}
              </Text>
            </View>
          )}

          <View style={styles.backgroundDetail}>
            {loadingUser ? (
              <ActivityIndicator
                size="large"
                color={Colors.whitetheme.primary}
              />
            ) : (
              <View>
                {!user.data.team || user.data.team.id === '' ? (
                  <View style={[styles.emptyCard]}>
                    <View>
                      <Text style={styles.titleCards}>Em nenhuma equipe!</Text>
                      <Text
                        style={{color: Colors.whitetheme.gray, fontSize: 15}}>
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
              </View>
            )}

            <TextSection value={'Informações'} />
            {loadingInfo ? (
              <ActivityIndicator
                size="large"
                color={Colors.whitetheme.primary}
              />
            ) : (
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
                  content={[Math.trunc(getKwp()), 'kWp']}
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
            )}

            {loadingUser ? (
              <ActivityIndicator
                size="large"
                color={Colors.whitetheme.primary}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <IconCommunity
                      name="molecule-co2"
                      size={40}
                      color={Colors.whitetheme.primary}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {Math.trunc(getKwp() * 30 * 4.5 * 0.85)} kg/ano
                  </Text>
                  <Text style={{color: '#000000'}}>CO² Reduzido</Text>
                </View>
                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <Icon
                      name="outdoor-grill"
                      size={40}
                      color={Colors.whitetheme.primary}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {Math.trunc(getKwp() * 30 * 4.5 * 0.85 * 0.8)} kg/ano
                  </Text>
                  <Text style={{color: '#000000'}}>Carvão economizado</Text>
                </View>
                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <IconCommunity
                      name="forest"
                      size={40}
                      color={Colors.whitetheme.primary}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {Math.trunc((getKwp() * 30 * 4.5 * 0.85) / 12.48)}
                  </Text>
                  <Text style={{color: '#000000'}}>Árvores salvas</Text>
                </View>
              </View>
            )}

            {loadingInfo ? (
              <ActivityIndicator
                size="large"
                color={Colors.whitetheme.primary}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  borderColor: Colors.whitetheme.primary,
                  borderWidth: 2,
                  borderRadius: 20,
                  padding: 20,
                }}>
                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <IconCommunity
                      name="lightning-bolt-circle"
                      size={40}
                      color={Colors.whitetheme.success}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    0
                  </Text>
                  <Text style={{color: '#000000'}}>on-line</Text>
                </View>

                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <IconCommunity
                      name="lightning-bolt-circle"
                      size={40}
                      color={'#000000'}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    0
                  </Text>
                  <Text style={{color: '#000000'}}>Off-line</Text>
                </View>

                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <IconCommunity
                      name="lightning-bolt-circle"
                      size={40}
                      color={Colors.whitetheme.danger}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    0
                  </Text>
                  <Text style={{color: '#000000'}}>Defeito</Text>
                </View>

                <View style={{alignItems: 'center', padding: 10}}>
                  <Text>
                    <IconCommunity
                      name="lightning-bolt-circle"
                      size={40}
                      color={Colors.whitetheme.warning}
                    />
                  </Text>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {projects.filter(p => !p.data.overview).length}
                  </Text>
                  <Text style={{color: '#000000'}}>Sem infos</Text>
                </View>
              </View>
            )}

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
  imageCard: {borderRadius: 20},
  projectTitle: {
    color: '#fff',
    fontSize: 25,
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
  projectCard: {
    paddingVertical: 30,
  },
});

export default Home;
