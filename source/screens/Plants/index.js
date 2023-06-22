import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {statusCheck} from '../../utils/dictionary';
import Colors from '../../global/colorScheme';
import {LoadingActivity} from '../../global/Components';
import {getGrowattData, getProjectsData} from '../../services/Database';
import SearchBar from 'react-native-dynamic-search-bar';
import {NoTeam} from '../../components/Global';
import {useUser} from '../../hooks/UserContext';
import {
  loadDataFromStorage,
  saveDataToStorage,
} from '../../services/AsyncStorage';

const Plants = ({route, navigation}) => {
  const {user, setUser} = useUser();
  const [projects, setProjects] = React.useState([]);
  const [growatt, setGrowatt] = React.useState();
  const [queryData, setQueryData] = React.useState('');

  const [loading, setLoading] = React.useState(true);

  const [spinner, setSpinner] = React.useState(false);

  const fetchAndUpdateData = async () => {
    try {
      const projectsData = await getProjectsData();
      const growattData = await getGrowattData();

      await saveDataToStorage('projectsData', projectsData);
      await saveDataToStorage('growattData', growattData);

      setGrowatt(growattData);
      setQueryData(projectsData);
      setProjects(projectsData);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const storedProjectsData = await loadDataFromStorage('projectsData');
      const storedGrowattData = await loadDataFromStorage('growattData');

      if (storedGrowattData && storedProjectsData) {
        setGrowatt(storedGrowattData);
        setProjects(storedProjectsData);
        setQueryData(storedProjectsData);
        setLoading(false);
        fetchAndUpdateData();
      } else {
        fetchAndUpdateData();

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
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

  const searchFunction = text => {
    setSpinner(true);
    const updatedData = projects.filter(item => {
      const item_data = `${item.data.apelidoProjeto.toUpperCase()})`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    setQueryData(updatedData);
    setSpinner(false);
  };

  if (loading) {
    return <LoadingActivity />;
  } else if (user.data.team.id === '') {
    return <NoTeam />;
  } else {
    return (
      <View style={styles.container}>
        <SearchBar
          style={{marginVertical: 20}}
          placeholder="Pesquise a planta"
          onChangeText={text => searchFunction(text)}
          spinnerVisibility={spinner}
        />
        <ScrollView>
          {projects.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                Nenhum projeto registrado
              </Text>
            </View>
          ) : (
            queryData.reverse().map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.marginCard}
                  key={index}
                  onPress={() =>
                    navigation.navigate('ProjectDetails', {project: item})
                  }>
                  <ImageBackground
                    imageStyle={styles.imageCard}
                    source={require('../../../assets/home/bannerbackground.jpg')}>
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
                          <Icon name="flash" size={20} color="#fff" />
                          {item.data.kwp}
                          kWp
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignContent: 'center',
                          alignItems: 'center',
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
                        {item.data.username_growatt &&
                        item.data.overview &&
                        growatt &&
                        getGrowattProject(item.data.username_growatt) ? (
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
                                  getGrowattProject(item.data.username_growatt)
                                    .status
                                ].title
                              }
                            </Text>
                            <View>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: '#fff',
                                  fontWeight: 'bold',
                                }}>
                                Geração hoje
                              </Text>
                              <Text
                                style={{
                                  fontSize: 20,
                                  color: '#fff',
                                  fontWeight: 'bold',
                                }}>
                                <Icon
                                  name="battery-charging"
                                  size={20}
                                  color="#fff"
                                />
                                {item.data.overview.data.data.today_energy}
                                kW
                              </Text>
                            </View>
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
                          {statusCheck({value: item.data.Status})}
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
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whitetheme.backgroundColor,
    marginHorizontal: 20,
    paddingBottom: 150,
  },
  emptyCard: {
    padding: 30,
    borderRadius: 20,
    height: 200,
    backgroundColor: Colors.whitetheme.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectCard: {
    padding: 30,
    borderRadius: 20,
  },
  marginCard: {marginVertical: 10},
  imageCard: {borderRadius: 20},
});

export default Plants;
