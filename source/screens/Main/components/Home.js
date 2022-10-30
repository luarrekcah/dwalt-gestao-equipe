/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../global/colorScheme';
import {
  LoadingActivity,
  MiniCard,
  TextSection,
} from '../../../global/Components';
import database from '@react-native-firebase/database';
import {getUserData} from '../../../services/Database';

const Home = ({navigation}) => {
  const [user, setUser] = React.useState();
  const [business, setBusiness] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [survey, setSurvey] = React.useState([]);

  const loadData = async () => {
    const usera = await getUserData();

    console.log(usera._id);

    await AsyncStorage.getItem('user').then(async data => {
      const userdata = await JSON.parse(data);

      database()
        .ref('/gestaoempresa/funcionarios')
        .once('value')
        .then(async snapshot => {
          const all = snapshot.val();
          const actUser = all.find(item => {
            return item._id === userdata._id;
          });
          setUser(actUser);
          await AsyncStorage.setItem('user', JSON.stringify(actUser));
        });

      database()
        .ref('/gestaoempresa/empresa')
        .once('value')
        .then(snapshotB => {
          let allBusiness = [];
          if (snapshotB.val() !== null) {
            allBusiness = snapshotB.val();
          }
          const myBusiness = allBusiness.find(item => {
            return item._id === userdata.email_link;
          });
          setBusiness(myBusiness);
          setLoading(false);
        });

      getSurveys();
    });
  };

  const getSurveys = () => {
    database()
      .ref('/gestaoempresa/survey')
      .once('value')
      .then(async snapshot => {
        let surveys = [];
        if (snapshot.val() !== null) {
          surveys = snapshot.val();
        }

        setSurvey(
          surveys.filter(item => item.ids.businessId === user.email_link),
        );
      });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadData();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, user]);

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerDetail}>
            <Text style={styles.welcome}>
              Bem vindo{user === undefined ? '' : ' ' + user.nome}!
            </Text>
            <Text style={styles.linkedOn}>
              Vinculado a {business.documents.nome_fantasia}
            </Text>
          </View>
          <View style={styles.backgroundDetail}>
            {user.team.name === '' ? (
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
                    Equipe {user.team.name}
                  </Text>
                </View>
                <Text>Seu cargo: {user.team.role}</Text>
              </View>
            )}

            <TextSection value={'Informações'} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MiniCard
                content={[`${survey.length}`, 'Chamados']}
                iconName="warning"
                iconSize={40}
              />
              <MiniCard
                content={['0', 'Clientes Totais']}
                iconName="group"
                iconSize={40}
              />
              <MiniCard
                content={['0', 'Projetos']}
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
            <View style={styles.emptyCard}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                Nenhuma solicitação ativa
              </Text>
            </View>
            <TextSection value={'Projetos'} />
            <View style={styles.emptyCard}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                Nenhum projeto registrado
              </Text>
            </View>
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
  titleCards: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default Home;
