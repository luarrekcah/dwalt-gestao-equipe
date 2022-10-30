import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {LoadingActivity, SimpleButton} from '../../global/Components';
import {getSurveyData} from '../../services/Database';
import database from '@react-native-firebase/database';

import moment from '../../vendors/moment';

const Calls = () => {
  const [survey, setSurvey] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = async () => {
    setLoading(true);
    setSurvey(await getSurveyData());
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const acceptSurvey = id => {
    database()
      .ref('/gestaoempresa/survey')
      .once('value')
      .then(snapshot => {
        const all = snapshot.val();
        const haveCurrent = all.filter(item => item.accepted && !item.finished);
        if (haveCurrent) {
          return ToastAndroid.show(
            'Finalize primeiro o chamado ativo para aceitar outro.',
            ToastAndroid.SHORT,
          );
        } else {
          const allSurveys = all.map(item => {
            if (item.ids.projectId === id) {
              item.accepted = true;
              item.finished = false;
            }
            return item;
          });
          database()
            .ref('/gestaoempresa/survey')
            .set(allSurveys)
            .then(loadData());
        }
      });
  };

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.tasks}
          columnWrapperStyle={styles.listContainer}
          data={survey}
          keyExtractor={item => {
            return item.ids.projectId;
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.card,
                  {borderColor: item.accepted ? '#02610a' : '#FF0000'},
                ]}>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.accepted
                      ? 'https://img.icons8.com/color/344/time-span.png'
                      : 'https://img.icons8.com/flat_round/64/000000/delete-sign.png',
                  }}
                />
                <View style={styles.cardContent}>
                  <Text style={[styles.description]}>{item.text}</Text>
                  <Text style={styles.date}>{item.status}</Text>
                  <Text style={styles.date}>
                    Solicitado {moment(item.createdAt).fromNow()}
                  </Text>
                </View>
                <View>
                  <SimpleButton
                    icon={item.accepted ? 'map' : 'add'}
                    value={item.accepted ? 'ABRIR ROTAS' : 'ACEITAR CHAMADO'}
                    type={'success'}
                    onPress={() => {
                      acceptSurvey(item.ids.projectId);
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <SimpleButton
                    icon="info"
                    value={'VER PROJETO'}
                    type={'primary'}
                  />
                </View>
                {item.accepted ? (
                  <View style={{flex: 1}}>
                    <SimpleButton
                      icon={item.accepted ? 'check' : ''}
                      value={item.accepted ? 'CONCLUIR' : ''}
                      type={'success'}
                      onPress={() => {
                        acceptSurvey(item.ids.projectId);
                      }}
                    />
                  </View>
                ) : (
                  ''
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#eeeeee',
  },
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 25,
    height: 25,
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

    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    flexBasis: '46%',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderLeftWidth: 6,
  },

  description: {
    fontSize: 18,
    flex: 1,
    color: '#008080',
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
