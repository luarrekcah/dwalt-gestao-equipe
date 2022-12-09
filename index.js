/**
 * @format
 */

if (__DEV__) {
  import('./source/config/ReactotronConfig');
}

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.DISMISSED:
      notifee.cancelNotification(detail.notification.id);
      break;
    case EventType.PRESS:
      console.log('PRESSIONADO');
      break;
    default:
      break;
  }
});

AppRegistry.registerComponent(appName, () => App);
