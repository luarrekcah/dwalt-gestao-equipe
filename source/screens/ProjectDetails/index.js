import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../global/colorScheme';
import {
  DocumentCard,
  LoadingActivity,
  TextSection,
} from '../../global/Components';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import {
  createItem,
  getAllItems,
  getProjectsData,
} from '../../services/Database';
//import MapView from 'react-native-maps'; desinstalar

const ProjectDetails = ({navigation, route}) => {
  const {project} = route.params;
  const [allMedia, setAllmedia] = React.useState([]);
  const [allDocuments, setAllDocuments] = React.useState([]);
  const [visibleImageViewer, setIsVisibleImageViewer] = React.useState(false);
  const [viewerURI, setViewerURI] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
                <TouchableOpacity key={index}>
                  <Text
                    style={[
                      styles.collectedCard,
                      project.data[`${item[0]}`] === ''
                        ? {backgroundColor: Colors.whitetheme.warning}
                        : '',
                    ]}>
                    {dictionary[`${item[0]}`]}
                    <Icon
                      name={
                        project.data[`${item[0]}`] !== '' ? 'check' : 'alert'
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
                    onPressView={() =>
                      navigation.navigate('PdfViewer', {
                        source: {
                          uri: item.data.documentBase64,
                        },
                      })
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
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ProjectDetails;
