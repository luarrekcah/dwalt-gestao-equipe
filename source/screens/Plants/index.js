import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {LoadingActivity} from '../../global/Components';
import {getGrowattData} from '../../services/Database';
import SearchBar from 'react-native-dynamic-search-bar';
import {NoTeam} from '../../components/Global';
import {useUser} from '../../hooks/UserContext';
import {fetchProjects} from '../../api/service';
import {useBusiness} from '../../hooks/BusinessContext';
import {styles} from './styles';
import ProjectItem from './components/ProjectItem';

const Plants = ({navigation}) => {
  const {user, setUser} = useUser();
  const {business, setBusiness} = useBusiness();
  const [projects, setProjects] = React.useState([]);
  const [queryData, setQueryData] = React.useState([]);
  const [growatt, setGrowatt] = React.useState();
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const [loading, setLoading] = React.useState(true);
  const [onSearching, setOnSearching] = React.useState(true);
  const [spinner, setSpinner] = React.useState(false);

  const fetchNewProjects = async () => {
    if (!spinner && !onSearching) {
      const newPage = page + 1;

      setPage(newPage);

      try {
        const newProjects = await fetchProjects({
          businessKey: business.key,
          page: newPage,
          limit,
        });

        setProjects([...projects, ...newProjects]);
        setQueryData([...projects, ...newProjects]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const loadData = async () => {
    setLoading(true);

    const allProjectsData = await fetchProjects({
      businessKey: business.key,
      page,
      limit,
    });

    const growattData = await getGrowattData();

    setGrowatt(growattData);
    setProjects(allProjectsData);
    setQueryData(allProjectsData);

    setLoading(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await loadData();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const searchFunction = async text => {
    setSpinner(true);
    setOnSearching(true);
    const allProjects = await fetchProjects({
      businessKey: business.key,
    });

    if (text === '') {
      setOnSearching(false);
      setQueryData(allProjects);
    } else {
      const updatedData = allProjects.filter(item => {
        const item_data = `${item.data.apelidoProjeto.toUpperCase()}`;
        const text_data = text.toUpperCase();
        return item_data.indexOf(text_data) > -1;
      });
      setQueryData(updatedData);
    }

    setSpinner(false);
  };

  if (loading || !user) {
    return <LoadingActivity />;
  } else if (!user || user.data.team.id === '') {
    return <NoTeam />;
  } else {
    return (
      <View style={styles.container}>
        <SearchBar
          style={styles.searchBar}
          placeholder="Pesquise a planta"
          onChangeText={text => searchFunction(text)}
          spinnerVisibility={spinner}
        />
        <View>
          {projects.length === 0 || queryData.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.nullProjectsWarn}>
                {projects.length === 0
                  ? 'Nenhum Projeto Registrado'
                  : queryData.length === 0
                  ? 'Nenhum Projeto Encontrado'
                  : ''}
              </Text>
            </View>
          ) : (
            <FlatList
              data={queryData.reverse()}
              onEndReachedThreshold={0.5}
              onEndReached={fetchNewProjects}
              renderItem={({item, index}) => (
                <ProjectItem
                  key={index}
                  item={item}
                  growatt={growatt}
                  navigation={navigation}
                />
              )}
            />
          )}
        </View>
      </View>
    );
  }
};

export default Plants;
