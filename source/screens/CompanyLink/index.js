import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../global/colorScheme';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';

const CompanyLink = ({navigation}) => {
  const [value, setValue] = React.useState('');
  const [user, setUser] = React.useState();
  const [link, setLink] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem('user').then(data => {
      const userdata = JSON.parse(data);
      console.log(userdata);
      setUser(userdata);
    });
  }, []);

  const onClickLink = () => {
    if (value === '' || value === null || !value.includes('@')) {
      return ToastAndroid.show('Insira um e-mail válido', ToastAndroid.SHORT);
    }
    setModalVisible(true);
    verifyBusiness();
  };

  const verifyBusiness = () => {
    database()
      .ref('/gestaoempresa/empresa')
      .once('value')
      .then(async snapshot => {
        let business = [];
        if (snapshot.val() !== null) {
          business = snapshot.val();
        }
        const linkFiltered = business.find(item => item._id === value);
        if (linkFiltered) {
          setLink(linkFiltered);
        } else {
          setLink({error: 'This email doenst exist'});
        }
      });
  };

  const linkConfirm = async () => {
    const updatedUser = user;
    updatedUser.email_link = value;
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    database()
      .ref('/gestaoempresa/funcionarios')
      .once('value')
      .then(async snapshot => {
        let users = [];
        if (snapshot.val() !== null) {
          users = snapshot.val();
        }
        const checkUser = users.find(item => item._id === user._id);
        if (checkUser) {
          await AsyncStorage.setItem('logged', JSON.stringify({logged: true}));
          navigation.navigate('Main');
        } else {
          users.push(updatedUser);
          database()
            .ref('/gestaoempresa/funcionarios')
            .set(users)
            .then(async () => {
              setLink({success: 'user registered'});
              await AsyncStorage.setItem(
                'logged',
                JSON.stringify({logged: true}),
              );
              setTimeout(() => {
                setModalVisible(false);
                navigation.navigate('Main');
              }, 1000 * 5);
              return;
            });
        }
      });
  };

  const RenderResult = () => {
    if (link === null) {
      return (
        <View>
          <Text style={styles.modalTitle}>Verificando empresa...</Text>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    } else {
      if (link.error) {
        return (
          <View>
            <Icon
              style={styles.confirmIcons}
              name="warning-outline"
              color="rgb(255, 0, 0)"
              size={60}
            />
            <Text style={[styles.modalTitle, {color: '#ff0000'}]}>
              Empresa não encontrada
            </Text>
            <Text style={styles.modalText}>
              Verifique o e-mail ou entre em contato com a empresa
            </Text>
          </View>
        );
      } else if (link.success) {
        return (
          <View>
            <Icon
              style={styles.confirmIcons}
              name="checkmark-circle-outline"
              color="rgb(0, 204, 0) "
              size={60}
            />
            <Text style={[styles.modalTitle, {color: '#00cc00'}]}>
              Empresa vinculada!
            </Text>
            <Text style={styles.modalText}>
              Você será redirecionado a página principal em instantes
            </Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text style={styles.modalTitle}>
              {link.documents.nome_fantasia}
            </Text>
            <Text style={styles.modalText}>CNPJ: {link.documents.cnpj}</Text>

            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: Colors.whitetheme.primary},
              ]}
              onPress={linkConfirm}>
              <Text style={[styles.textButton, {color: '#fff'}]}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setLink(null);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <RenderResult />
          </View>
        </View>
      </Modal>
      <View style={styles.items}>
        <Text style={styles.title}>
          Quase lá{user === undefined ? '' : ' ' + user.nome}!
        </Text>
        <Text style={styles.text}>Informe o e-mail registrado da empresa</Text>
        <TextInput
          style={styles.textInput}
          placeholder="empresa@gmail.com"
          placeholderTextColor="#fff"
          autoCapitalize="none"
          onChangeText={text => setValue(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onClickLink}>
          <Text style={styles.textButton}>Vincular</Text>
        </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.whitetheme.primary,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    color: Colors.whitetheme.primary,
  },
  confirmIcons: {alignSelf: 'center'},
  items: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  textInput: {
    margin: 30,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 50,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  textButton: {
    color: Colors.whitetheme.primary,
  },
});

export default CompanyLink;
