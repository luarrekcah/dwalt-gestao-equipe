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

import {createItem, getAllItems, getUserData} from '../../services/Database';
import Colors from '../../global/colorScheme';
import {LoadingActivity} from '../../components/Global';
import axios from 'axios';
import moment from 'moment/moment';

const NewCustomer = ({navigation}) => {
  const [user, setUser] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [loadingMedia, setLoadingMedia] = React.useState(false);
  const [AllMedia, setAllmedia] = React.useState([]);
  const [allCustomers, setAllCustomers] = React.useState([]);
  const [clientType, setClientType] = React.useState('pf');

  const handleClientTypeChange = value => {
    setClientType(value);
  };

  const loadData = async () => {
    setLoading(true);
    const userAc = await getUserData();
    const customers = await getAllItems({
      path: `/gestaoempresa/business/${userAc.data.businessKey}`,
    });

    setAllCustomers(customers);
    setUser(userAc);
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

  const registerCustomer = async values => {
    values.createdAt = moment().format();
    values.password = '123456'; // Alterar para pegar o da empresa
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
      values.dataNasc = values.dataNasc.replaceAll('/', '-');
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
          dataNasc: '',
          email: '',
          celular: '',
          nomeMae: '',
          rg: '',
          sexo: '',
          estadoCivil: '',
          patrimonio: '',
          ocupacao: '',
          profissao: '',
          anos: '',
          meses: '',
          renda: '',
          endCompleto: '',
        }}
        onSubmit={(values, {resetForm}) => {
          values.type = 'pf';
          confirmRegister(values);
          resetForm();
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
            <Text style={styles.text}>Data de Nascimento:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.dataNasc}
              onBlur={handleBlur('dataNasc')}
              onChangeText={handleChange('dataNasc')}
              mask={Masks.DATE_DDMMYYYY}
            />

            <Text style={styles.text}>E-mail:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.email}
              onBlur={handleBlur('email')}
              onChangeText={handleChange('email')}
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

            <Text style={styles.text}>Nome da Mães:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.nomeMae}
              onBlur={handleBlur('nomeMae')}
              onChangeText={handleChange('nomeMae')}
            />

            <Text style={styles.text}>RG:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.rg}
              onBlur={handleBlur('rg')}
              onChangeText={handleChange('rg')}
            />

            <Text style={styles.text}>Sexo:</Text>
            <Picker
              style={{backgroundColor: Colors.whitetheme.primary}}
              selectedValue={values.sexo}
              onValueChange={handleChange('sexo')}>
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Feminino" value="feminino" />
            </Picker>

            <Text style={styles.text}>Estado Civil:</Text>
            <Picker
              style={{backgroundColor: Colors.whitetheme.primary}}
              selectedValue={values.estadoCivil}
              onValueChange={handleChange('estadoCivil')}>
              <Picker.Item label="Solteiro(a)" value="solteiro" />
              <Picker.Item label="Casado(a)" value="casado" />
            </Picker>

            <Text style={styles.text}>Patrimônio:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.patrimonio}
              onBlur={handleBlur('patrimonio')}
              onChangeText={handleChange('patrimonio')}
              mask={Masks.BRL_CURRENCY}
            />

            <Text style={styles.text}>Ocupação:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.ocupacao}
              onBlur={handleBlur('ocupacao')}
              onChangeText={handleChange('ocupacao')}
            />

            <Text style={styles.text}>Profissão:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.profissao}
              onBlur={handleBlur('profissao')}
              onChangeText={handleChange('profissao')}
            />

            <Text style={styles.text}>Anos de atuação na profissão:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.anos}
              onBlur={handleBlur('anos')}
              onChangeText={handleChange('anos')}
            />

            <Text style={styles.text}>Meses de atuação na profissão:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.meses}
              onBlur={handleBlur('meses')}
              onChangeText={handleChange('meses')}
            />

            <Text style={styles.text}>Renda mensal:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.renda}
              onBlur={handleBlur('renda')}
              onChangeText={handleChange('renda')}
              mask={Masks.BRL_CURRENCY}
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
          email: '',
          celular: '',
          patrimonio: '',
          renda: '',
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

            <Text style={styles.text}>E-mail:</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.email}
              onBlur={handleBlur('email')}
              onChangeText={handleChange('email')}
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

            <Text style={styles.text}>Patrimônio:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.patrimonio}
              onBlur={handleBlur('patrimonio')}
              onChangeText={handleChange('patrimonio')}
              mask={Masks.BRL_CURRENCY}
            />

            <Text style={styles.text}>Renda mensal:</Text>
            <MaskInput
              style={styles.textInput}
              placeholderTextColor={Colors.whitetheme.primary}
              value={values.renda}
              onBlur={handleBlur('renda')}
              onChangeText={handleChange('renda')}
              mask={Masks.BRL_CURRENCY}
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
        <View style={styles.container}>
          <Text style={styles.text}>
            Tire as fotos com sua câmera e faça o envio. Selecione-as primeiro e
            depois preencha os dados.
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

export default NewCustomer;
