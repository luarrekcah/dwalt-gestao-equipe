import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../hooks/UserContext';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Colors from '../../global/colorScheme';
import {LoadingActivity, TextSection} from '../../global/Components';
import {getItems} from '../../services/Database';

const SeeUser = ({route}) => {
  const {user, setUser} = useUser();
  const [customerData, setCustomerData] = useState();
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const cData = await getItems({
      path: `/gestaoempresa/business/${user.data.businessKey}/customers/${route.params.customerID}`,
    });

    setCustomerData(cData);
    console.log(cData);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const RenderInfo = ({info}) => {
    return (
      <Text style={info ? styles.documentText : styles.nullDocumentText}>
        {info !== '' ? info : 'NÃO INFORMADO'}
      </Text>
    );
  };

  if (!customerData || loading) {
    return <LoadingActivity />;
  } else {
    if (customerData.cpf) {
      return (
        <ScrollView style={styles.container}>
          <View style={{marginBottom: 20}}>
            <TextSection value={'Nome Completo'} />
            <RenderInfo info={customerData.nomeComp} />
            <TextSection value={'CPF'} />
            <RenderInfo info={customerData.cpf} />
            <TextSection value={'RG'} />
            <RenderInfo info={customerData.rg} />
            <TextSection value={'Data de Nascimento'} />
            <RenderInfo info={customerData.dataNasc} />
            <TextSection value={'Sexo'} />
            <RenderInfo info={customerData.sexo} />
            <TextSection value={'Estado Civil'} />
            <RenderInfo info={customerData.estadoCivil} />
            <TextSection value={'Nome da Mãe'} />
            <RenderInfo info={customerData.nomeMae} />
            <TextSection value={'E-mail'} />
            <RenderInfo info={customerData.email} />
            <TextSection value={'Celular'} />
            <RenderInfo info={customerData.celular} />
            <TextSection value={'Endereço Completo'} />
            <RenderInfo info={customerData.endCompleto} />
            <TextSection value={'Profissão'} />
            <RenderInfo info={customerData.profissao} />
            <TextSection value={'Ocupação'} />
            <RenderInfo info={customerData.ocupacao} />
            <TextSection value={'Renda'} />
            <RenderInfo info={customerData.renda} />
            <TextSection value={'Patrimônio'} />
            <RenderInfo info={customerData.patrimonio} />
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <View style={{marginBottom: 20}}>
            <TextSection value={'Nome Fantasia'} />
            <RenderInfo info={customerData.nomeFantasia} />
            <TextSection value={'CNPJ'} />
            <RenderInfo info={customerData.cnpj} />
            <TextSection value={'E-mail'} />
            <RenderInfo info={customerData.email} />
            <TextSection value={'Celular'} />
            <RenderInfo info={customerData.celular} />
            <TextSection value={'Endereço Completo'} />
            <RenderInfo info={customerData.endCompleto} />
            <TextSection value={'Renda'} />
            <RenderInfo info={customerData.renda} />
            <TextSection value={'Patrimônio'} />
            <RenderInfo info={customerData.patrimonio} />
          </View>
        </ScrollView>
      );
    }
  }
};

const styles = new StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  documentText: {
    color: '#000',
    fontWeight: '900',
  },
  nullDocumentText: {
    color: '#ff0000',
    fontWeight: '900',
  },
});

export default SeeUser;
