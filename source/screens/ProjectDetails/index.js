import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../global/colorScheme';
import {
  DocumentCard,
  LoadingActivity,
  SimpleButton,
  TextSection,
} from '../../global/Components';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import {
  createItem,
  getAllItems,
  getItems,
  updateItem,
} from '../../services/Database';
import {getUserAuth} from '../../services/Auth';
//import MapView from 'react-native-maps'; desinstalar

const ProjectDetails = ({navigation, route}) => {
  const {project} = route.params;
  const [projectData, setProjectData] = React.useState(project);
  const [allMedia, setAllmedia] = React.useState([]);
  const [allDocuments, setAllDocuments] = React.useState([]);
  const [visibleImageViewer, setIsVisibleImageViewer] = React.useState(false);
  const [viewerURI, setViewerURI] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [value, setValue] = React.useState();
  const [loadingModal, setLoadingModal] = React.useState(false);

  const loadData = async () => {
    setLoading(true);
    setAllmedia(
      await getAllItems({
        path: `gestaoempresa/business/${project.data.business}/projects/${project.key}/photos`,
      }),
    );

    setAllDocuments(
      await getAllItems({
        path: `gestaoempresa/business/${project.data.business}/projects/${project.key}/documents`,
      }),
    );

    setProjectData(
      await getItems({
        path: `gestaoempresa/business/${project.data.business}/projects/${project.key}`,
      }),
    );

    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickImages = () => {
    ImagePicker.openPicker({
      includeBase64: true,
      multiple: true,
    }).then(images => {
      images.forEach(async i => {
        createItem({
          path: `gestaoempresa/business/${project.data.business}/projects/${project.key}/photos`,
          params: {base64: 'data:image/png;base64,' + i.data},
        });
        loadData();
      });
    });
  };
  const dictionary = {
    cod: 'Código do produto',
    nomeComp: 'Nome completo',
    cpf: 'CPF',
    dataNasc: 'Data de nascimento',
    email: 'E-mail',
    celular: 'Celular',
    nomeMae: 'Nome da mãe',
    rg: 'RG',
    sexo: 'Sexo',
    estadoCivil: 'Estado civil',
    patrimonio: 'Patrimônio',
    ocupacao: 'Ocupação',
    profissao: 'Profissão',
    anos: 'Anos trabalhando',
    meses: 'Meses atuando',
    renda: 'Renda Mensal',
    endCompleto: 'Endereço Completo',
  };

  const dictToArray = Object.keys(dictionary).map(key => [
    key,
    dictionary[key],
  ]);

  if (loading) {
    return <LoadingActivity />;
  } else {
    return (
      <ScrollView style={styles.white}>
        <ImageView
          images={[
            {
              uri: viewerURI,
            },
          ]}
          imageIndex={0}
          visible={visibleImageViewer}
          onRequestClose={() => setIsVisibleImageViewer(false)}
        />
        <ImageBackground
          style={styles.backgroundImage}
          source={require('../../../assets/home/bannerbackground.jpg')}>
          <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>
              {project.data.apelidoProjeto}
            </Text>
            <Text style={styles.projectCategory}>{project.data.category}</Text>
            <View style={styles.bottomProject}>
              <Text style={styles.bottomKwp}>
                <Icon name="flash" size={20} color="#fff" />
                {project.data.kwp}
                kWp
              </Text>
              <Text style={styles.bottomStatus}>
                Status: {project.data.Status}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.container}>
          <TextSection value={'Fotos'} />
          <ScrollView horizontal>
            {allMedia.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setViewerURI(item.data.base64);
                    setIsVisibleImageViewer(true);
                  }}>
                  <ImageBackground
                    style={styles.backgroundImagePhoto}
                    source={{uri: item.data.base64}}
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.iconAdd} onPress={pickImages}>
              <Icon name="plus" size={40} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
          <TextSection value={'Dados Salvos'} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dictToArray.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setModalVisible(true);
                    setModalData({
                      title: dictionary[`${item[0]}`],
                      key: item[0],
                    });
                  }}>
                  <Text
                    style={[
                      styles.collectedCard,
                      projectData[`${item[0]}`] === ''
                        ? {backgroundColor: Colors.whitetheme.warning}
                        : '',
                    ]}>
                    {dictionary[`${item[0]}`]}
                    <Icon
                      name={
                        projectData[`${item[0]}`] !== '' ? 'check' : 'alert'
                      }
                      size={15}
                      color={'#fff'}
                    />
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TextSection value={'Documentos'} />
          <ScrollView horizontal>
            {allDocuments.length !== 0 ? (
              allDocuments.map((item, index) => {
                return (
                  <DocumentCard
                    key={index}
                    title={item.data.documentName}
                    haveContent={true}
                    onPressView={
                      () => Linking.openURL(item.data.documentURL)
                      /*navigation.navigate('PdfViewer', {
                        source: {
                          uri: item.data.documentURL,
                        },
                      })*/
                    }
                  />
                );
              })
            ) : (
              <Text style={{color: '#000000'}}>
                Sem documentos, precisa ser adicionado pela empresa
              </Text>
            )}
          </ScrollView>
          <TextSection value={'Localização'} />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'https://www.google.com.br/maps/search/' + project.data.coords,
              );
            }}>
            <ImageBackground
              style={styles.mapBackground}
              source={require('../../../assets/projectdetails/banner.jpg')}>
              <Text>Clique para abrir o Maps</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {loadingModal ? (
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Carregando...
                  </Text>
                ) : (
                  <View>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      Editar informações de {modalData.title}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Insira a nova informação aqui"
                      placeholderTextColor="#000000"
                      autoCapitalize="none"
                      onChangeText={text => setValue(text)}
                    />
                    <SimpleButton
                      value="Enviar"
                      type={'success'}
                      onPress={async () => {
                        setLoadingModal(true);
                        const userLocal = await getUserAuth();

                        try {
                          const params = JSON.parse(
                            '{"' + modalData.key + '":"' + value + '"}',
                          );

                          updateItem({
                            path: `gestaoempresa/business/${userLocal.businessKey}/projects/${project.key}`,
                            params,
                          });
                        } catch (e) {
                          console.log(e);
                          setLoadingModal(false);
                          setModalVisible(false);
                        }
                        setModalVisible(false);
                        setLoadingModal(false);
                        loadData();
                      }}
                    />

                    <SimpleButton
                      value="Cancelar"
                      type={'warning'}
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    );
  }
};

const styles = new StyleSheet.create({
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    top: -40,
  },
  white: {
    backgroundColor: '#fff',
  },
  backgroundImage: {
    height: 250,
  },
  projectCard: {
    padding: 30,
    borderRadius: 20,
    height: 200,
  },
  projectTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  projectCategory: {
    color: Colors.whitetheme.gray,
    fontSize: 20,
  },
  bottomProject: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomKwp: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  bottomStatus: {
    color: Colors.whitetheme.gray,
    fontSize: 15,
    fontWeight: 'bold',
  },
  backgroundImagePhoto: {
    width: 80,
    height: 140,
    marginHorizontal: 5,
  },
  collectedCard: {
    color: '#fff',
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.whitetheme.primary,
    borderRadius: 80,
  },
  iconAdd: {
    backgroundColor: Colors.whitetheme.primary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 140,
  },
  mapBackground: {height: 250, alignItems: 'center', paddingTop: 40},
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
  textInput: {
    margin: 20,
    borderColor: Colors.whitetheme.primary,
    borderWidth: 1,
    borderRadius: 30,
    padding: 10,
    color: '#000000',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ProjectDetails;
