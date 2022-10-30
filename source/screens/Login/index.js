import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Colors from '../../global/colorScheme';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

const Login = ({navigation}) => {
  React.useEffect(() => {
    GoogleSignin.configure({
      androidClientId:
        '533204541706-ct5su06a9nqektdq4hcobj1s0qbn4ifo.apps.googleusercontent.com',
    });
  }, []);

  const singIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      database()
        .ref('/gestaoempresa/funcionarios')
        .once('value')
        .then(async snapshot => {
          const all = snapshot.val();
          const existsUser = all.find(item => {
            return item._id === userInfo.user.id;
          });
          let user;
          if (existsUser) {
            user = existsUser;
            navigation.navigate('Main');
            await AsyncStorage.setItem(
              'logged',
              JSON.stringify({logged: true}),
            );
          } else {
            user = {
              _id: userInfo.user.id,
              nome: userInfo.user.givenName,
              sobrenome: userInfo.user.familyName,
              email: userInfo.user.email,
              foto: userInfo.user.photo,
              email_link: '',
              team: {
                name: '',
                id: '',
                role: '',
              },
              permissions: [],
            };
            navigation.navigate('CompanyLink');
          }
          await AsyncStorage.setItem('user', JSON.stringify(user));
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
        // play services not available or outdated
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.items}>
        <Image
          source={require('../../../assets/login/login.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Login rápido e fácil</Text>
        <Text style={styles.text}>
          Clique no botão de login pelo Google para acessar rapidamente o app.
          Seus dados estão seguros e não são compartilhados com terceiros.
        </Text>
        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => {
            singIn();
          }}
          disabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whitetheme.primary,
    padding: 50,
  },
  items: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  googleButton: {
    margin: 20,
  },
});

export default Login;
