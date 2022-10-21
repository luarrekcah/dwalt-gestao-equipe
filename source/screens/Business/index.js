import React from 'react';
import {Text, View, Image, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../global/colorScheme';
import {LoadingActivity, TextSection} from '../../global/Components';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Business = ({navigation}) => {
  const [business, setBusiness] = React.useState();
  const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const loadData = async () => {
    await AsyncStorage.getItem('user').then(data => {
      const userdata = JSON.parse(data);
      setUser(userdata);
      database()
        .ref('/gestaoempresa/empresa')
        .once('value')
        .then(snapshot => {
          let allBusiness = [];
          if (snapshot.val() !== null) {
            allBusiness = snapshot.val();
          }
          const myBusiness = allBusiness.filter(item => {
            return item._id === userdata.email_link;
          });
          setBusiness(myBusiness[0]);
          setLoading(false);
        });
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
        <ScrollView>
          <Image
            style={styles.bussinessLogo}
            source={{
              uri: business.profile.logo,
            }}
          />
          <Text style={styles.bussinessName}>
            {business.documents.nome_fantasia}
          </Text>
          <TextSection value="Sobre a empresa" />
          <Text style={styles.bussinessDesc}>{business.profile.about}</Text>
        </ScrollView>
      </View>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    padding: 10,
  },
  bussinessLogo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    margin: 30,
  },
  bussinessName: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.whitetheme.primary,
  },
  bussinessDesc: {
    fontSize: 15,
    color: '#000000',
  },
});

export default Business;
