/* eslint-disable react-native/no-inline-styles */
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
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../global/colorScheme';
import {
  DocumentCard,
  LoadingActivity,
  PhotoCard,
  SimpleButton,
  TextSection,
} from '../../global/Components';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import {
  createItem,
  getAllItems,
  getGrowattData,
  getItems,
  updateItem,
} from '../../services/Database';
import {getUserAuth} from '../../services/Auth';
import {LineChart} from 'react-native-chart-kit';
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
  const [requiredPhotosConfig, setRequiredPhotosConfig] = React.useState();
  const [requiredPhotos, setRequiredPhotos] = React.useState();
  const [requiredPics, setrequiredPics] = React.useState([]);
  const [chardata, setChartdata] = React.useState();
  const [growatt, setGrowatt] = React.useState();

  const loadData = async () => {
    setLoading(true);

    setGrowatt(await getGrowattData());

    setModalVisible(true);
    setLoadingModal(true);
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

    const pjData = await getItems({
      path: `gestaoempresa/business/${project.data.business}/projects/${project.key}`,
    });

    const power = [],
      labelsMonths = [];

    if (pjData.month_power) {
      pjData.month_power.data.data.energys.forEach(m => {
        const month = m.date.split('-')[1];
        switch (month) {
          case '01':
            labelsMonths.push('Jan');
            break;
          case '02':
            labelsMonths.push('Fev');
            break;
          case '03':
            labelsMonths.push('Mar');
            break;
          case '04':
            labelsMonths.push('Abr');
            break;
          case '05':
            labelsMonths.push('Mai');
            break;
          case '06':
            labelsMonths.push('Jun');
            break;
          case '07':
            labelsMonths.push('Jul');
            break;
          case '08':
            labelsMonths.push('Ago');
            break;
          case '09':
            labelsMonths.push('Set');
            break;
          case '10':
            labelsMonths.push('Out');
            break;
          case '11':
            labelsMonths.push('Nov');
            break;
          case '12':
            labelsMonths.push('Dez');
            break;
        }
        power.push(m.energy);
      });
    }
    setChartdata({
      labels: labelsMonths,
      power: power,
    });

    setProjectData(pjData);

    const requiredPhotosS = await getAllItems({
      path: `gestaoempresa/business/${project.data.business}/projects/${project.key}/requiredPhotos`,
    });

    setRequiredPhotos(requiredPhotosS);

    const requiredPhotosConfigS = await getAllItems({
      path: `gestaoempresa/business/${project.data.business}/config/projectRequiredImages`,
    });

    setRequiredPhotosConfig(requiredPhotosConfigS);

    let rP = [];

    requiredPhotosConfigS.forEach(rq => {
      if (!rq.data.checked) {
        return;
      }
      const find = requiredPhotosS.find(i => i.key === rq.key);
      if (find) {
        rP.push({
          key: rq.key,
          data: rq.data,
          array: find.data,
        });
      } else {
        rP.push({
          key: rq.key,
          data: rq.data,
        });
      }
    });

    setrequiredPics(rP);

    //console.log(rP);

    setLoading(false);

    setModalVisible(false);
    setLoadingModal(false);
  };

  React.useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusDict = {
    0: {
      title: 'Desconectado',
      color: '#a19f9f',
    },
    1: {
      title: 'Normal',
      color: '#13fc03',
    },
    2: {
      title: 'Aguardando',
      color: '#13fc03',
    },
    3: {
      title: 'Falha',
      color: '#fa3916',
    },
    4: {
      title: 'Offline',
      color: '#a19f9f',
    },
  };

  const getGrowattProject = plantName => {
    const plantNameOK = plantName.replaceAll(' ', '');
    if (growatt && (plantName !== undefined || plantName !== '')) {
      const finded = growatt.plantList.data.data.plants.find(
        g => g.name === plantNameOK,
      );
      if (finded) {
        return finded;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

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
      });
      loadData();
    });
  };

  const pickImagesRequired = item => {
    let imagesArray = [];
    ImagePicker.openPicker({
      includeBase64: true,
      multiple: true,
    }).then(async images => {
      setLoadingModal(true);
      setModalVisible(true);

      for (let index = 0; index < images.length; index++) {
        const path = `gestaoempresa/business/${
          project.data.business
        }/projects/${project.key}/requiredPhotos/${item.data.titulo
          .replaceAll(' ', '-')
          .toLowerCase()}-${index}.jpg`;
        const reference = storage().ref(path);
        const dataUrl = `data:image/png;base64,${images[index].data}`;
        await reference.putString(dataUrl, 'data_url');
        const url = await reference.getDownloadURL();
        imagesArray.push(url);
      }

      console.log('array', imagesArray);
      if (imagesArray.length === 0) {
        console.warn('Array está vazio');
      } else {
        console.log('Array NAO está vazio');
        const data = {
          titulo: item.data.titulo,
          checked: item.data.checked,
          data: imagesArray,
        };

        updateItem({
          path: `gestaoempresa/business/${project.data.business}/projects/${project.key}/requiredPhotos/${item.key}`,
          params: {
            data,
          },
        });
        setLoadingModal(false);
        setModalVisible(false);
        loadData();
      }
    });
  };

  const dictionary = {
    cod: 'Código do produto',
  };

  const dictToArray = Object.keys(dictionary).map(key => [
    key,
    dictionary[key],
  ]);

  if (loading && requiredPhotos === undefined) {
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
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                {project.data.apelidoProjeto}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                {project.data.kwp}
                kWp
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  paddingHorizontal: 10,
                  marginRight: 20,
                  paddingVertical: 5,
                  borderRadius: 100,
                }}>
                <Text
                  style={{
                    color: Colors.whitetheme.primary,
                    fontWeight: 'bold',
                    fontSize: 10,
                  }}>
                  {project.data.category.toUpperCase()}
                </Text>
              </View>
              {project.data.overview ? (
                <>
                  <Text
                    style={{
                      color: `${
                        statusDict[
                          getGrowattProject(project.data.username_growatt)
                            .status
                        ].color
                      }`,
                      fontWeight: 'bold',
                    }}>
                    {
                      statusDict[
                        getGrowattProject(project.data.username_growatt).status
                      ].title
                    }
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}>
                    <Icon name="battery" size={20} color="#fff" />
                    {
                      getGrowattProject(project.data.username_growatt)
                        .total_energy
                    }
                    kW
                  </Text>
                </>
              ) : (
                ''
              )}
            </View>
          </View>
        </ImageBackground>
        <View style={styles.container}>
          <TextSection value={'Informações'} />
          <Text style={[styles.bottomStatus, {color: '#000000'}]}>
            <Icon name="alert-circle" size={20} color="#000000" />{' '}
            {project.data.RStatus === '' || project.data.RStatus === undefined
              ? 'Sem observação de Status'
              : project.data.RStatus}
          </Text>
          <Text style={[styles.bottomStatus, {color: '#000000'}]}>
            <Icon name="truck-fast" size={20} color="#000000" />{' '}
            {project.data.statusRastreio === '' ||
            project.data.statusRastreio === undefined
              ? 'Rastreio indisponível'
              : project.data.statusRastreio}
          </Text>
          <Text style={[styles.bottomStatus, {color: '#000000'}]}>
            <Icon name="wifi" size={20} color="#000000" />{' '}
            {project.data.username_growatt === '' ||
            project.data.username_growatt === undefined
              ? 'Sem nome de usuário growatt'
              : project.data.username_growatt}
          </Text>
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
          {project.data.overview ? (
            <>
              <TextSection value={'Histórico de geração'} />
              <LineChart
                data={{
                  labels: chardata.labels,
                  datasets: [
                    {
                      data: chardata.power,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 40} // from react-native
                height={240}
                yAxisLabel=""
                yAxisSuffix="kwh"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: Colors.whitetheme.primary,
                  backgroundGradientFrom: Colors.whitetheme.primary,
                  backgroundGradientTo: Colors.whitetheme.primary,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#fff',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </>
          ) : (
            ''
          )}
          <TextSection value={'Fotos do sistema'} />
          <ScrollView horizontal>
            {requiredPics.map((item, index) => {
              return (
                <PhotoCard
                  key={item.key}
                  title={item.data.titulo}
                  haveContent={item.array ? true : false}
                  onPressView={() => {
                    if (item.array) {
                      setViewerURI(item.array.data.data[0]);
                      setIsVisibleImageViewer(true);
                    } else {
                      pickImagesRequired(item);
                    }
                  }}
                />
              );
            })}
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
                  <>
                    <ActivityIndicator
                      size="large"
                      color={Colors.whitetheme.primary}
                    />
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      Carregando...
                    </Text>
                  </>
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
                            path: `gestaoempresa / business / ${userLocal.businessKey} / projects / ${project.key}`,
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
    height: 170,
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
