import React from 'react';
import {Image, StyleSheet, View, Text, StatusBar} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Colors from '../../global/colorScheme';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoadingActivity} from '../../global/Components';

const Intro = ({navigation}) => {
  const [logged, setLogged] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    AsyncStorage.getItem('logged').then(data => {
      if (data === null) {
        setLogged(false);
        setLoading(false);
      } else {
        setLogged(JSON.parse(data).logged);
        setLoading(false);
        navigation.navigate('Main');
      }
    });
  }, [navigation]);

  const slides = [
    {
      key: 1,
      title: 'Seja bem vindo(a) ao\n D | Walt Gestão para Equipes!',
      text: 'Essa plataforma lhe deixa mais próximo e conectado da sua empresa de energia solar!',
      image: require('../../../assets/initialScreen/slide_1.png'),
      bg: Colors.whitetheme.primary,
    },
    {
      key: 2,
      title: 'Acompanhe, atenda chamados, contribua com registros e muito mais!',
      text: 'Nossa plataforma faz com que seu trabalho seu mais limpo, organizado e claro, evitando dores de cabeça.',
      image: require('../../../assets/initialScreen/slide_2.png'),
      bg: Colors.whitetheme.primary,
    },
    {
      key: 3,
      title: 'Preparado?',
      text: 'Esteja acompanhado do técnico da empresa ou com os dados necessários para vínculo.',
      image: require('../../../assets/initialScreen/slide_3.png'),
      bg: Colors.whitetheme.primary,
    },
  ];

  const renderItem = ({item}) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.bg,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="chevron-forward-circle-outline"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="checkmark-done-circle-outline"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  const onDone = () => {
    navigation.navigate('Login');
  };

  const RenderSlides = () => {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={item => item.title}
          renderItem={renderItem}
          data={slides}
          onDone={onDone}
          renderDoneButton={renderDoneButton}
          renderNextButton={renderNextButton}
        />
      </View>
    );
  };
  if (loading) {
    return <LoadingActivity />;
  } else {
    return <RenderSlides />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    padding: 10,
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
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Intro;
