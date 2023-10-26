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
  ScrollView,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {Formik} from 'formik';
import MaskInput, {Masks} from 'react-native-mask-input';
import Geolocation from '@react-native-community/geolocation';

import {createItem, getAllItems, getItems} from '../../services/Database';
import Colors from '../../global/colorScheme';
import {LoadingActivity} from '../../components/Global';
import axios from 'axios';
import moment from 'moment/moment';
import {useUser} from '../../hooks/UserContext';

const NewProject = ({navigation}) => {
  const {user, setUser} = useUser();
  const [loading, setLoading] = React.useState(true);
  const [loadingMedia, setLoadingMedia] = React.useState(false);
  const [AllMedia, setAllmedia] = React.useState([]);
  const [allCustomers, setAllCustomers] = React.useState([]);
  const [clientType, setClientType] = React.useState('pf');
  const [coords, setCoords] = React.useState('');

  const handleClientTypeChange = value => {
    setClientType(value);
  };

  const loadData = async () => {
    setLoading(true);
    const customers = await getAllItems({
      path: `/gestaoempresa/business/${user.data.businessKey}`,
    });

    setAllCustomers(customers);
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
      ToastAndroid.show('Carregando fotos, aguarde...', ToastAndroid.SHORT);
      for (let index = 0; index < images.length; index++) {
        const dataUrl = `data:image/png;base64,${images[index].data}`;
        AllMedia.push(dataUrl);
      }
      setLoadingMedia(false);
    });
  };

  const verifyExists = async values => {
    const finded = allCustomers.find(item => {
      if (
        item.data.cpf &&
        values.type === 'pf' &&
        item.data.cpf === values.cpf
      ) {
        return item;
      } else if (
        item.data.cnpj &&
        values.type === 'pj' &&
        item.data.cnpj === values.cnpj
      ) {
        return item;
      } else {
        return;
      }
    });

    console.log(finded);

    if (finded) {
      return true;
    } else {
      return false;
    }
  };

  const confirmRegister = values => {
    Alert.alert('Deseja registar o cliente agora?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Registrar Agora', onPress: () => registerCustomer(values)},
    ]);
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(info =>
      setCoords(`${info.coords.latitude}, ${info.coords.longitude}`),
    );
  };

  const registerCustomer = async values => {
    const password = await getItems({
      path: `/gestaoempresa/business/${user.data.businessKey}/config/users/passCommon`,
    });

    values.createdAt = moment().format();
    values.password = password;
    values.coords = coords;
    const path = `/gestaoempresa/business/${user.data.businessKey}/customers`;
    if (AllMedia.length !== 0) {
      let photos = {};
      for (let index = 0; index < AllMedia.length; index++) {
        const base64URL = AllMedia[index];

        const pathImage = `/gestaoempresa/business/${
          user.data.businessKey
        }/customers/${new Date().getTime()}-${index}.jpg`;

        const reference = storage().ref(path);

        await reference.putString(base64URL, 'data_url');
        const url = await reference.getDownloadURL();

        const data = {
          path: pathImage,
          url,
        };

        const date = new Date().getTime().toString();

        photos[date] = data;
      }

      values.photos = photos;
    }
    if (values.type === 'pf') {
      createItem({
        path,
        params: values,
      });
      Alert.alert(
        'Registrado!',
        `${values.nomeComp.split(' ')[0]} registrado.`,
        [{text: 'OK'}],
      );
    } else {
      const cnpjData = await axios
        .get(
          'https://connect.dlwalt.com/api/v1/cnpj/' +
            values.cnpj.replace(/\D/g, ''),
        )
        .then(r => {
          return r.data;
        });

      values.abertura = cnpjData.abertura;
      values.atividade =
        cnpjData.atividade_principal[0].code +
        ' - ' +
        cnpjData.atividade_principal[0].text;

      createItem({
        path,
        params: values,
      });

      Alert.alert(
        'Registrado!',
        `${values.nomeFantasia.split(' ')[0]} registrado.`,
        [{text: 'OK'}],
      );
    }
  };

  const RenderPF = () => {
    return (
      <Formik
        initialValues={{
          nomeComp: '',
          cpf: '',
          celular: '',
          endCompleto: '',
        }}
        onSubmit={(values, {resetForm}) => {
          values.type = 'pf';
          confirmRegister(values);
          //resetForm();
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View>
            <Text style={styles.text}>Nome completo:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.nomeComp}
              onBlur={handleBlur('nomeComp')}
              onChangeText={handleChange('nomeComp')}
            />
            <Text style={styles.text}>CPF:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.cpf}
              onBlur={handleBlur('cpf')}
              onChangeText={handleChange('cpf')}
              mask={Masks.BRL_CPF}
            />
            <Text style={styles.text}>Celular:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.celular}
              onBlur={handleBlur('celular')}
              onChangeText={handleChange('celular')}
              mask={Masks.BRL_PHONE}
            />
            <Text style={styles.text}>Endereço completo:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.endCompleto}
              onBlur={handleBlur('endCompleto')}
              onChangeText={handleChange('endCompleto')}
            />

            {/* SUBMIT */}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={{color: '#fff'}}>Registrar Pessoa Física</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    );
  };

  const RenderPJ = () => {
    return (
      <Formik
        initialValues={{
          cnpj: '',
          nomeFantasia: '',
          celular: '',
          endCompleto: '',
        }}
        onSubmit={(values, {resetForm}) => {
          values.type = 'pj';
          confirmRegister(values);
          resetForm();
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View>
            <Text style={styles.text}>CNPJ:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.cnpj}
              onBlur={handleBlur('cnpj')}
              onChangeText={handleChange('cnpj')}
              mask={Masks.BRL_CNPJ}
            />

            <Text style={styles.text}>Nome Fantasia:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.nomeFantasia}
              onBlur={handleBlur('nomeFantasia')}
              onChangeText={handleChange('nomeFantasia')}
            />

            <Text style={styles.text}>Celular:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.celular}
              onBlur={handleBlur('celular')}
              onChangeText={handleChange('celular')}
              mask={Masks.BRL_PHONE}
            />

            <Text style={styles.text}>Endereço completo:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.endCompleto}
              onBlur={handleBlur('endCompleto')}
              onChangeText={handleChange('endCompleto')}
            />

            {/* SUBMIT */}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={{color: '#fff'}}>Registrar Pessoa Jurídica</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    );
  };

  if (loading && user === undefined) {
    return <LoadingActivity />;
  } else {
    return (
      <ScrollView>
        <Formik>
          <View style={styles.container}>
            <Text style={styles.text}>
              Tire as fotos com sua câmera e faça o envio. Selecione-as primeiro
              e depois preencha os dados.
            </Text>
            <View style={{marginBottom: 30}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => pickImages()}>
                {loadingMedia ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{color: '#fff'}}>
                    Adicionar fotos ({AllMedia.length})
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={getLocation}
                style={[
                  styles.button,
                  coords === ''
                    ? {backgroundColor: Colors.whitetheme.danger}
                    : {backgroundColor: Colors.whitetheme.success},
                ]}>
                <Text style={{color: '#fff'}}>
                  {coords === '' ? 'Obter Localização' : 'Localização Obtida'}
                </Text>
              </TouchableOpacity>
            </View>

            <Picker
              style={{backgroundColor: Colors.whitetheme.primary}}
              selectedValue={clientType}
              onValueChange={handleClientTypeChange}>
              <Picker.Item label="Pessoa Física" value="pf" />
              <Picker.Item label="Pessoa Jurídica" value="pj" />
            </Picker>
            {clientType === 'pf' ? <RenderPF /> : <RenderPJ />}
          </View>
        </Formik>
      </ScrollView>
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
  text: {
    color: '#000',
    padding: 10,
    fontSize: 14,
  },
});

export default NewProject;
