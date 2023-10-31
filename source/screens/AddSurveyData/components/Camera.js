import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const CameraComponent = () => {
  const [photos, setPhotos] = useState([]);
  const [photosTaken, setPhotosTaken] = useState(0);
  const cameraRef = useRef(null);

  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
          enableShutterSound: false,
        });

        if (await requestCameraPermission()) {
          setPhotos([...photos, photo.uri]);
          setPhotosTaken(photosTaken + 1);
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to the camera to take photos.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  return (
    <View style={{flex: 1}}>
      <Camera
        ref={cameraRef}
        style={{flex: 1}}
        device={device}
        isActive={true}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={photosTaken < 5 ? takePicture : () => {}}
          style={{
            flex: 0,
            backgroundColor: photosTaken < 5 ? 'red' : 'gray',
            padding: 15,
            borderRadius: 5,
          }}>
          <Text style={{fontSize: 20, color: '#fff'}}>
            {photosTaken < 5 ? 'Tirar Foto' : 'Limite Atingido'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text>Photos Taken: {photosTaken} / 5</Text>
    </View>
  );
};

export default CameraComponent;
