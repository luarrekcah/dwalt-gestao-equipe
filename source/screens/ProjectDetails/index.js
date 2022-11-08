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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../global/colorScheme';
import {
  DocumentCard,
  LoadingActivity,
  TextSection,
} from '../../global/Components';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import {createItem, getAllItems} from '../../services/Database';
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
      let array = [];
      images.forEach(async i => {
        array.push({data: {base64: 'data:image/png;base64,' + i.data}});
        createItem({
          path: `gestaoempresa/business/${project.data.business}/projects/${project.key}/photos`,
          params: {base64: 'data:image/png;base64,' + i.data},
        });
      });
      setAllmedia(array);
    });
  };

  const RenderCollectedItems = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.collectedCard}>
          Nome Completo
          <Icon
            name={project.data.nomeComp !== '' ? 'check' : 'x'}
            size={15}
            color={'#fff'}
          />
        </Text>
        <Text style={styles.collectedCard}>
          CPF
          <Icon
            name={project.cpf !== '' ? 'check' : 'x'}
            size={15}
            color={'#fff'}
          />
        </Text>
        <Text style={styles.collectedCard}>
          Nome da Mãe
          <Icon
            name={project.nomeMae !== '' ? 'check' : 'x'}
            size={15}
            color={'#fff'}
          />
        </Text>
        <Text style={styles.collectedCard}>
          Endereço Completo
          <Icon
            name={project.endComp !== '' ? 'check' : 'x'}
            size={15}
            color={'#fff'}
          />
        </Text>
        <Text style={styles.collectedCard}>
          Data de Nascimento
          <Icon
            name={project.dataNasc !== '' ? 'check' : 'x'}
            size={15}
            color={'#fff'}
          />
        </Text>
        <Text style={styles.collectedCard}>
          E-mail
          <Icon
            name={project.email !== '' ? 'check' : 'x'}
            size={15}
            color={'#fff'}
          />
        </Text>
        <Text style={styles.collectedCard}>
          Entre outros dados básicos para homologação
        </Text>
      </ScrollView>
    );
  };

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
                <Icon name="flash-on" size={20} color="#fff" />
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
              <Icon name="add" size={40} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
          <TextSection value={'Dados Salvos'} />
          <RenderCollectedItems />
          <TextSection value={'Documentos'} />
          <ScrollView horizontal>
            {allDocuments.map(item => {
              return (
                <DocumentCard
                  title={item.data.documentName}
                  haveContent={true}
                  onPressView={() =>
                    navigation.navigate('PdfViewer', {
                      data: item.data.documentBase64,
                    })
                  }
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
