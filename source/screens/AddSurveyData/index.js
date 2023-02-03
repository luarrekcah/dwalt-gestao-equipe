/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Colors from '../../global/colorScheme';
import {
  createItem,
  getAllItems,
  getUserData,
  updateItem,
} from '../../services/Database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {LoadingActivity} from '../../components/Global';

const AddSurveyData = ({navigation, route}) => {
  const {key} = route.params;
  const [user, setUser] = React.useState();
  const [allMedia, setAllmedia] = React.useState([]);
  const [loadingMedia, setLoadingMedia] = React.useState(true);
  const [obs, setObs] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const loadData = async () => {
    setLoading(true);
    if (!key) {
      return console.warn('No key');
    }
    const userAc = await getUserData();
    setUser(userAc);
    setAllmedia(
      await getAllItems({
        path: `gestaoempresa/business/${userAc.data.businessKey}/surveys/${key}/photos`,
      }),
    );
    setLoadingMedia(false);
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const pickImages = () => {
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
      await loadData();
    });
  };

  const Options = () => {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={() => pickImages()}>
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
            onPress={() => concludeSurvey()}>
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
  };

  const concludeSurvey = () => {
    updateItem({
      path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${key}`,
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

  if (loading && user === undefined) {
    return <LoadingActivity />;
  } else {
    return (
      <View style={styles.container}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              color: Colors.whitetheme.primary,
              marginVertical: 40,
            }}>
            Passos para concluir OS
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
      </View>
    );
  }
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

export default AddSurveyData;
