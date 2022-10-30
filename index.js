/**
 * @format
 */

if (__DEV__) {
  import('./source/config/ReactotronConfig');
}

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
