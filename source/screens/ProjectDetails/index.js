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
import {DocumentCard, TextSection} from '../../global/Components';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import database from '@react-native-firebase/database';
//import MapView from 'react-native-maps'; desinstalar

const ProjectDetails = ({navigation, route}) => {
  const {project} = route.params;
  const [allMedia, setAllmedia] = React.useState(project.photos || []);
  const [visibleImageViewer, setIsVisibleImageViewer] = React.useState(false);
  const [viewerURI, setViewerURI] = React.useState([]);

  const pickImages = () => {
    ImagePicker.openPicker({
      includeBase64: true,
      multiple: true,
    }).then(images => {
      database()
        .ref('/gestaoempresa/projetos')
        .once('value')
        .then(snapshot => {
          let allProjects = [];
          if (snapshot.val() !== null) {
            allProjects = snapshot.val();
          }
          allProjects.map(projeto => {
            if (projeto._id === project._id) {
              images.forEach((item, i) => {
                if (projeto.photos === null || projeto.photos === undefined) {
                  projeto.photos = [];
                }
                projeto.photos.push('data:image/png;base64,' + item.data);
              });
              setAllmedia(projeto.photos);
              return projeto;
            } else {
              return projeto;
            }
          });
          database().ref('/gestaoempresa/projetos').set(allProjects);
        });
    });
  };

  const RenderCollectedItems = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.collectedCard}>
          Nome Completo
          <Icon
            name={project.nomeComp !== '' ? 'check' : 'x'}
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
          <Text style={styles.projectTitle}>{project.apelidoProjeto}</Text>
          <Text style={styles.projectCategory}>{project.category}</Text>
          <View style={styles.bottomProject}>
            <Text style={styles.bottomKwp}>
              <Icon name="flash-on" size={20} color="#fff" />
              {project.kwp}
              kWp
            </Text>
            <Text style={styles.bottomStatus}>Status: {project.Status}</Text>
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
                  setViewerURI(item);
                  setIsVisibleImageViewer(true);
                }}>
                <ImageBackground
                  style={styles.backgroundImagePhoto}
                  source={{uri: item}}
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
          <DocumentCard title={'A.R.T'} haveContent={true} />
          <DocumentCard title={'Procuração'} haveContent={false} />
          <DocumentCard title={'Solicitação de Acesso'} haveContent={false} />
          <DocumentCard title={'Memorial Técnico'} haveContent={false} />
          <DocumentCard title={'Declaração'} haveContent={false} />
          <DocumentCard title={'Projeto'} haveContent={false} />
          <DocumentCard title={'Carta de Aprovação'} haveContent={false} />
        </ScrollView>
        <TextSection value={'Localização'} />
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.google.com.br/maps/search/' + project.coords,
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
