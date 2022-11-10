import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {LoadingActivity} from '../../global/Components';
import {getTeamData} from '../../services/Database';

const Team = ({navigation}) => {
  const [loading, setLoading] = React.useState(true);
  const [team, setTeam] = React.useState([]);

  const loadData = async () => {
    setLoading(true);
    const t = await getTeamData();
    setTeam(t);
    setLoading(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        {team.length !== 0 ? (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={team}
            horizontal={false}
            numColumns={2}
            keyExtractor={item => {
              return item.key;
            }}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    console.log('click!');
                  }}>
                  <View key={item.data._id} style={styles.cardHeader} />
                  <Image
                    style={styles.userImage}
                    source={{
                      uri:
                        item.data.foto !== undefined
                          ? item.data.foto
                          : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
                    }}
                  />
                  <View style={styles.cardFooter}>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={styles.name}>{item.data.nickname}</Text>
                      <Text style={styles.position}>{item.data.role_name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#000000'}}>
              Sem equipe
            </Text>
            <Text style={{fontSize: 20, color: '#000000'}}>
              Peça para que a empresa responsável lhe adicione em uma equipe.
            </Text>
          </View>
        )}
      </View>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
  },
  listContainer: {
    alignItems: 'center',
  },
  /******** card **************/
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
    marginHorizontal: 5,
  },
  cardFooter: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  userImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 3,
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: '#008080',
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#696969',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  icon: {
    height: 20,
    width: 20,
  },
});

export default Team;
