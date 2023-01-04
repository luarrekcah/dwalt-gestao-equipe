/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Dimensions,
  TextInput,
} from 'react-native';
import Colors from '../../global/colorScheme';
import {getItems, updateItem} from '../../services/Database';

import {LoadingActivity, SimpleButton} from '../../global/Components';

const UpdateProject = ({navigation, route}) => {
  const [loading, setLoading] = React.useState(false);
  const {project} = route.params;
  const [projectData, setProjectData] = React.useState(project);

  //const [Status, setStatus] = React.useState(project.data.Status || '');
  const [RStatus, setRStatus] = React.useState(project.data.RStatus || '');
  const [statusRastreio, setStatusRastreio] = React.useState(
    project.data.statusRastreio || '',
  );
  const [username_growatt, setUsername_growatt] = React.useState(
    project.data.username_growatt || '',
  );
  const [endCompleto, setEndCompleto] = React.useState(
    project.data.endCompleto || '',
  );

  const loadData = async () => {
    setLoading(true);
    if (project) {
      const getProject = await getItems({
        path: `/gestaoempresa/business/${project.data.business}/projects/${project.key}`,
      });
      if (getProject) {
        setProjectData(getProject);
        // setStatus(getProject.data.Status);
        setRStatus(getProject.data.RStatus);
        setStatusRastreio(getProject.data.statusRastreio);
        setUsername_growatt(getProject.data.username_growatt);
        setEndCompleto(getProject.data.endCompleto);
        setLoading(false);
      }
    }
  };

  const updateData = async () => {
    setLoading(true);
    const itens = {
      RStatus,
      statusRastreio,
      username_growatt,
      endCompleto,
    };
    if (!project) {
      ToastAndroid.show('Erro ao atualizar os dados.', ToastAndroid.SHORT);
    } else {
      updateItem({
        path: `/gestaoempresa/business/${project.data.business}/projects/${project.key}`,
        params: itens,
      });
      ToastAndroid.show('Dados atualizados.', ToastAndroid.SHORT);
      setLoading(false);
      navigation.navigate('Main');
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await loadData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading && projectData === undefined) {
    return <LoadingActivity />;
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.items}>Observação de Status</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.whitetheme.primary}
            value={RStatus}
            placeholder={RStatus === '' ? 'Sem observação' : RStatus}
            onChangeText={text => {
              setRStatus(text);
            }}
          />
          <Text style={styles.items}>Status de Rastreio</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.whitetheme.primary}
            value={statusRastreio}
            onChangeText={text => {
              setStatusRastreio(text);
            }}
          />
          <Text style={styles.items}>Usuário Growatt</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.whitetheme.primary}
            value={username_growatt}
            placeholder={
              username_growatt === '' ? 'Sem usuário' : username_growatt
            }
            onChangeText={text => {
              setUsername_growatt(text);
            }}
          />
          <Text style={styles.items}>End. Comp. da Unidade Consumidora</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.whitetheme.primary}
            value={endCompleto}
            placeholder={endCompleto === '' ? 'Sem endereço' : endCompleto}
            onChangeText={text => {
              setEndCompleto(text);
            }}
          />
          <SimpleButton
            value="Atualizar"
            type={'primary'}
            onPress={updateData}
          />
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whitetheme.backgroundColor,
    padding: 10,
    paddingBottom: 100,
    flex: 1,
  },
  items: {color: '#6a6a6b', marginLeft: 15, fontWeight: 'bold'},
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

export default UpdateProject;
