import React, {useEffect} from 'react';
import {handleClickedNotification} from './source/utils/NotificationHandler';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

const onNotifeeMessageReceived = async message => {
  console.log(message);

  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  notifee.displayNotification({
    id: message.messageId,
    title: message.notification.title,
    body: message.notification.body,
    subtitle: 'Mensagem da Empresa',
    android: {
      priority: 'high',
      channelId,
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          mutableContent: true,
          sound: 'default',
        },
      },
    },
  });
};

import Routes from './source/routes';

const App = () => {
  useEffect(() => {
    //const unsubscribe = messaging().onMessage(onNotifeeMessageReceived);
    const unsubscribe = messaging().setBackgroundMessageHandler(
      onNotifeeMessageReceived,
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = () => {
      return notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.DISMISSED:
            notifee.cancelNotification(detail.notification.id);
            break;
          case EventType.PRESS:
            handleClickedNotification(detail.notification);
            break;
          default:
            break;
        }
      });
    };

    unsubscribe();
  }, []);

  return <Routes />;
};

export default App;
