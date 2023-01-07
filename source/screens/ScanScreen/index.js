import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import Colors from '../../global/colorScheme';
import {getUserData, updateItem} from '../../services/Database';

const ScanScreen = ({navigation}) => {
  const [readed, setReaded] = React.useState(false);
  const [data, setData] = React.useState(false);
  const [user, setUser] = React.useState();

  const loadData = async () => {
    setUser(await getUserData());
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const onRead = e => {
    Vibration.vibrate(200);
    const dataCode = JSON.parse(e.nativeEvent.codeStringValue);
    if (dataCode) {
      setReaded(true);
      setData(dataCode);
      console.log(dataCode);
    } else {
      console.warn('Erro');
    }
  };

  const Options = () => {
    if (data.type === 'endSurvey') {
      return (
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.whitetheme.primary,
              borderRadius: 30,
              alignItems: 'center',
              alignContent: 'center',
              paddingVertical: 20,
            }}
            onPress={() => concludeSurvey(data.key)}>
            <Text style={{color: '#fff'}}>Fechar chamado</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const concludeSurvey = id => {
    updateItem({
      path: `/gestaoempresa/business/${user.data.businessKey}/surveys/${id}`,
      params: {
        accepted: true,
        finished: true,
        status: 'Chamado concluído',
      },
    });
    navigation.goBack();
  };

  return (
    <View>
      {readed ? (
        <View style={styles.container}>
          {data.type ? (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: Colors.whitetheme.primary,
                  marginVertical: 40,
                }}>
                Opções
              </Text>
              <Options />
            </View>
          ) : (
            <Text>Código QR inválido</Text>
          )}
        </View>
      ) : (
        <CameraScreen
          scanBarcode={true}
          onReadCode={onRead}
          showFrame={true}
          laserColor="red"
          frameColor="blue"
        />
      )}
    </View>
  );
};

const styles = new StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 100,
  },
});

export default ScanScreen;

/*const onOpenScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setQrvalue('');
            setOpenScanner(true);
          } else {
            console.warn('CAMERA permission denied');
          }
        } catch (err) {
          console.warn('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      setQrvalue('');
      setOpenScanner(true);
    }
  };*/
