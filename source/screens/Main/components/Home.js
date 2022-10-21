import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../global/colorScheme';
import {
  LoadingActivity,
  MiniCard,
  TextSection,
} from '../../../global/Components';
import database from '@react-native-firebase/database';

import Icon from 'react-native-vector-icons/MaterialIcons';

const Home = ({navigation}) => {
  const [user, setUser] = React.useState();
  const [projects, setProjects] = React.useState([]);
  const [business, setBusiness] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const loadData = async () => {
    await AsyncStorage.getItem('user').then(data => {
      const userdata = JSON.parse(data);
      setUser(userdata);
      database()
        .ref('/gestaoempresa/projetos')
        .once('value')
        .then(snapshot => {
          let allProjects = [];
          if (snapshot.val() !== null) {
            allProjects = snapshot.val();
          }
          const myProjects = allProjects.filter(item => {
            return item.emailApp === userdata.email;
          });
          setProjects(myProjects);

          database()
            .ref('/gestaoempresa/empresa')
            .once('value')
            .then(snapshotB => {
              let allBusiness = [];
              if (snapshot.val() !== null) {
                allBusiness = snapshotB.val();
              }
              const myBusiness = allBusiness.filter(item => {
                return item._id === userdata.email_link;
              });
              setBusiness(myBusiness[0]);
              setLoading(false);
            });
        });
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadData();
    });
    return unsubscribe;
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
            <Text
              style={[styles.welcome, {alignSelf: 'center', marginBottom: 10}]}>
              Equipe Principal
            </Text>
          </View>
          <View style={styles.backgroundDetail}>
            <TextSection value={'Informações'} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MiniCard
                textValue={'0 Chamados'}
                iconName="warning"
                iconSize={40}
              />
              <MiniCard
                textValue={'0 Clientes Totais'}
                iconName="group"
                iconSize={40}
              />
              <MiniCard
                textValue={'0 Projetos'}
                iconName="folder"
                iconSize={40}
              />
              <MiniCard
                textValue={'0 Membros na equipe'}
                iconName="folder"
                iconSize={40}
              />
            </ScrollView>
            <TextSection value={'Chamado em andamento'} />
            <View>
              <Text style={{color: '#000000'}}>Nenhuma solicitação ativa</Text>
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
    backgroundColor: '#f5f2f2',
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
});

export default Home;
