import React from 'react';
import database from '@react-native-firebase/database';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {LoadingActivity, SimpleButton} from '../../global/Components';
import {getSurveyData} from '../../services/Database';

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
                style={[styles.card, {borderColor: '#FF0000'}]}
                onPress={() => {
                  console.log('aa');
                }}>
                <Image
                  style={styles.image}
                  source={{
                    uri: 'https://img.icons8.com/flat_round/64/000000/delete-sign.png',
                  }}
                />
                <View style={styles.cardContent}>
                  <Text style={[styles.description]}>{item.text}</Text>
                  <Text style={styles.date}>{item.status}</Text>
                  <Text style={styles.date}>DATA: {item.createdAt}</Text>
                </View>
                <View style={{marginLeft: 20}}>
                  <SimpleButton
                    icon="info"
                    value={'VER PROJETO'}
                    type={'primary'}
                  />
                </View>
                <View>
                  <SimpleButton
                    icon="add"
                    value={'ACEITAR CHAMADO'}
                    type={'success'}
                  />
                </View>
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
