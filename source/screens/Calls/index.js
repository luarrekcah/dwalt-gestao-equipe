import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SimpleButton} from '../../global/Components';

const Calls = () => {
  const data = [
    {
      id: 1,
      description: 'PROBLEMA NO MEU GERADOR',
      date: '2019-03-25 13:33:00',
      color: '#FF0000',
      completed: 0,
    },
    {
      id: 2,
      description: 'PROBLEMA NO MEU GERADOR',
      date: '2019-03-25 13:33:00',
      color: '#FF0000',
      completed: 0,
    },
    {
      id: 3,
      description: 'PROBLEMA NO MEU GERADOR',
      date: '2019-03-25 13:33:00',
      color: '#FF0000',
      completed: 0,
    },
    {
      id: 4,
      description: 'PROBLEMA NO MEU GERADOR',
      date: '2019-03-25 13:33:00',
      color: '#FF0000',
      completed: 0,
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.tasks}
        columnWrapperStyle={styles.listContainer}
        data={data}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={[styles.card, {borderColor: item.color}]}
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
                <Text style={[styles.description]}>{item.description}</Text>
                <Text style={styles.date}>AAAAAAAAAAA</Text>
                <Text style={styles.date}>DATA: {item.date}</Text>
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
