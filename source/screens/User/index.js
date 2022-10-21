import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import Colors from '../../global/colorScheme';
import {Button, LoadingActivity, TextSection} from '../../global/Components';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Business = ({navigation}) => {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    GoogleSignin.configure({
      androidClientId:
        '335158766865-b8m8hjlf5jm3kmegg8494no8i68jqi0n.apps.googleusercontent.com',
    });
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const loadData = () => {
    AsyncStorage.getItem('user').then(data => {
      const userdata = JSON.parse(data);
      console.log(userdata);
      setUser(userdata);
    });
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signInSilently();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('logged', JSON.stringify({logged: false}));
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  if (user === undefined || user === null) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            style={styles.bussinessLogo}
            source={{
              uri: user.foto,
            }}
          />
          <Text style={styles.bussinessName}>
            {user.nome + ' ' + user.sobrenome}
          </Text>
          <View style={styles.emailBackground}>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <TextSection value="Conta" />
          <Button icon="logout" value="Sair da Conta" onPress={signOut} />
          <TextSection value="Outros" />
          <Button
            icon="info"
            value="Termos de Uso"
            onPress={() => {
              Linking.openURL('https://www.dlwalt.com/termos');
            }}
          />
          <Button
            icon="info"
            value="Política de Privacidade"
            onPress={() => {
              Linking.openURL('https://www.dlwalt.com/politica');
            }}
          />
          <Button
            icon="warning"
            value="Relatar Problema"
            onPress={() => {
              Linking.openURL('https://wa.me/+556892402096');
            }}
          />
          <Button icon="android" value="Versão" description="v1.0.0" />
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
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: 30,
    borderRadius: 30,
  },
  bussinessName: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.whitetheme.primary,
  },
  bussinessDesc: {
    fontSize: 15,
  },
  emailBackground: {
    backgroundColor: Colors.whitetheme.gray,
    borderRadius: 20,
    width: 300,
    alignSelf: 'center',
  },
  email: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#fff',
  },
});

export default Business;
