/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../global/colorScheme';
import {
  LoadingActivity,
  MiniCard,
  TextSection,
} from '../../../global/Components';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getBusinessData,
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
  const [activeSurvey, setActiveSurvey] = React.useState([]);

  const loadData = async () => {
    setLoading(true);
    setUser(await getUserData());
    const surveys = await getSurveyData();
    const businesss = await getBusinessData();
    const actSurvey = surveys.filter(
      i => i.accepted && !i.finished && i.ids.businessId === businesss.key,
    );
    setBusiness(businesss);
    setSurvey(surveys);
    setProjects(await getProjectsData());
    setActiveSurvey(actSurvey);
    setLoading(false);
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
            {user.data.team.id === '' ? (
              <View style={[styles.emptyCard, {height: 100}]}>
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
                    {`${user.data.team.name}`}
                  </Text>
                </View>
                <Text>Seu cargo: {user.data.team.role}</Text>
              </View>
            )}

            <TextSection value={'Informações'} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MiniCard
                content={[
                  `${
                    survey.filter(
                      i => !i.finished && i.ids.businessId === business._id,
                    ).length
                  }`,
                  'Chamados',
                ]}
                iconName="warning"
                iconSize={40}
              />
              <MiniCard
                content={['0', 'Clientes Totais']}
                iconName="group"
                iconSize={40}
              />
              <MiniCard
                content={[`${projects.length}`, 'Projetos']}
                iconName="folder"
                iconSize={40}
              />
              <MiniCard
                content={['0', 'Membros na Equipe']}
                iconName="group"
                iconSize={40}
              />
            </ScrollView>
            <TextSection value={'Chamado em andamento'} />

            {activeSurvey.length !== 0 ? (
              <TouchableOpacity
                style={styles.marginCard}
                key={activeSurvey[0].ids.projectId}
                onPress={() =>
                  navigation.navigate('ProjectDetails', {
                    project: activeSurvey[0],
                  })
                }>
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
                      {activeSurvey[0].text}
                    </Text>
                    <Text
                      style={{
                        marginVertical: 20,
                        alignSelf: 'center',
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}>
                      Status: {activeSurvey[0].status}
                    </Text>
                    <Text style={{alignSelf: 'center'}}>
                      Solicitado {moment(activeSurvey[0].createdAt).fromNow()}
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
                        <Text style={styles.projectTitle}>
                          {item.data.apelidoProjeto}
                        </Text>
                        <Text style={styles.projectCategory}>
                          {item.data.category}
                        </Text>
                        <View style={styles.bottomProject}>
                          <Text style={styles.bottomKwp}>
                            <Icon name="flash-on" size={20} color="#fff" />
                            {item.data.kwp}
                            kWp
                          </Text>
                          <Text style={styles.bottomStatus}>
                            Status: {item.data.Status}
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
  },
  nullWarn: {color: '#000000', alignSelf: 'center'},
  marginCard: {marginVertical: 10},
  projectCard: {
    padding: 30,
    borderRadius: 20,
    height: 200,
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
