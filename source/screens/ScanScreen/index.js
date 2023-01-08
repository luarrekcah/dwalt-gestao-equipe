/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  TextInput,
  View,
  Text,
  Vibration,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import Colors from '../../global/colorScheme';
import {
  createItem,
  getAllItems,
  getUserData,
  updateItem,
} from '../../services/Database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const ScanScreen = ({navigation}) => {
  const [readed, setReaded] = React.useState(false);
  const [data, setData] = React.useState();
  const [user, setUser] = React.useState();
  const [allMedia, setAllmedia] = React.useState([]);
  const [loadingMedia, setLoadingMedia] = React.useState(true);
  const [obs, setObs] = React.useState('');

  const loadUser = async () => {
    setUser(await getUserData());
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadData = async key => {
    if (!key) {
      return console.warn('No key');
    }
    setAllmedia(
      await getAllItems({
        path: `gestaoempresa/business/${user.data.businessKey}/surveys/${key}/photos`,
      }),
    );
    setLoadingMedia(false);
  };

  const dic = {
    endSurvey: 'Procedimentos para concluir chamado',
  };

  const onRead = async e => {
    Vibration.vibrate(200);
    const dataCode = JSON.parse(e.nativeEvent.codeStringValue);
    if (dataCode) {
      setReaded(true);
      setData(dataCode);
      console.log(dataCode);
      await loadData(dataCode.key);
    } else {
      console.warn('Erro');
    }
  };

  const pickImages = key => {
    ImagePicker.openPicker({
      includeBase64: true,
      multiple: true,
    }).then(async images => {
      setLoadingMedia(true);
      ToastAndroid.show('Enviando fotos, aguarde...', ToastAndroid.LONG);
      for (let index = 0; index < images.length; index++) {
        const path = `/gestaoempresa/business/${
          user.data.businessKey
        }/surveys/${key}/photos/${new Date().getTime()}-${index}.jpg`;
        const reference = storage().ref(path);
        const dataUrl = `data:image/png;base64,${images[index].data}`;
        await reference.putString(dataUrl, 'data_url');
        const url = await reference.getDownloadURL();

        createItem({
          path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${key}/photos`,
          params: {url, path},
        });
        ToastAndroid.show(`Foto ${index + 1} enviada.`, ToastAndroid.SHORT);
      }
      await loadData(key);
    });
  };

  const Options = () => {
    if (data.type === 'endSurvey') {
      return (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => pickImages(data.key)}>
            {loadingMedia ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{color: '#fff'}}>
                Adicionar fotos ({allMedia.length} de 5)
              </Text>
            )}
          </TouchableOpacity>
          {allMedia.length >= 5 && obs.length > 50 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => concludeSurvey(data.key)}>
              <Text style={{color: '#fff'}}>Concluir chamado</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: Colors.whitetheme.gray, opacity: 0.5},
              ]}
              onPress={() =>
                ToastAndroid.show(
                  'Preencha todos os campos acima para finalizar.',
                  ToastAndroid.LONG,
                )
              }>
              <Text style={{color: '#fff'}}>Concluir chamado (Bloqueado)</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  };

  const concludeSurvey = id => {
    updateItem({
      path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${id}`,
      params: {
        accepted: true,
        finished: true,
        status: 'Chamado concluído',
        obs,
        staffEnded: user.key,
      },
    });
    ToastAndroid.show('Chamado concluído', ToastAndroid.LONG);
    navigation.goBack();
  };

  return (
    <View>
      {readed ? (
        <View style={styles.container}>
          {data.type ? (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: Colors.whitetheme.primary,
                  marginVertical: 40,
                }}>
                {dic[data.type]}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={Colors.whitetheme.primary}
                value={obs}
                multiline={true}
                placeholder={'Observações sobre o chamado'}
                onChangeText={text => {
                  setObs(text);
                }}
              />
              <Options />
            </View>
          ) : (
            <Text>Código QR inválido</Text>
          )}
        </View>
      ) : (
        <CameraScreen
          scanBarcode={true}
          onReadCode={onRead}
          showFrame={true}
          laserColor="red"
          frameColor="blue"
        />
      )}
    </View>
  );
};

const styles = new StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 100,
  },
  button: {
    backgroundColor: Colors.whitetheme.primary,
    borderRadius: 30,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  textInput: {
    margin: 10,
    width: Dimensions.get('window').width - 40,
    borderColor: Colors.whitetheme.primary,
    placeholderTextColor: Colors.whitetheme.primary,
    color: Colors.whitetheme.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 25,
  },
});

export default ScanScreen;

/*const onOpenScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setQrvalue('');
            setOpenScanner(true);
          } else {
            console.warn('CAMERA permission denied');
          }
        } catch (err) {
          console.warn('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      setQrvalue('');
      setOpenScanner(true);
    }
  };*/
