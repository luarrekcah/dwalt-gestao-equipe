import React from 'react';
import {View, Text, StyleSheet, Image, ToastAndroid} from 'react-native';
import Colors from '../../global/colorScheme';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {saveUserAuth} from '../../services/Auth';

const Login = ({navigation}) => {
  React.useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const singIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user = {
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
      saveUserAuth(user);
      navigation.navigate('CompanyLink');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastAndroid.show('Login cancelado.', ToastAndroid.SHORT);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        ToastAndroid.show('Carregando login.', ToastAndroid.SHORT);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show(
          'Google Play Services indisponível.',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show(`Erro ${error}`, ToastAndroid.SHORT);
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
