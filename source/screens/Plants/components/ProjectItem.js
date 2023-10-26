import React from 'react';
import {ImageBackground, TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../../global/colorScheme';
import {statusCheck} from '../../../utils/dictionary';
import {styles} from '../styles';

export default function ProjectItem({navigation, item, growatt}) {
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

  return (
    <TouchableOpacity
      style={styles.marginCard}
      onPress={() => navigation.navigate('ProjectDetails', {project: item})}>
      <ImageBackground
        imageStyle={styles.imageCard}
        source={require('../../../../assets/home/bannerbackground.jpg')}>
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
                        getGrowattProject(item.data.username_growatt).status
                      ].color
                    }`,
                    fontWeight: 'bold',
                  }}>
                  {
                    statusDict[
                      getGrowattProject(item.data.username_growatt).status
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
                    <Icon name="battery-charging" size={20} color="#fff" />
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
              {item.data.RStatus === '' || item.data.RStatus === undefined
                ? 'Sem observação de Status'
                : item.data.RStatus}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
