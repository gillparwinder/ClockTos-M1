/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import configureStore from './src/store';
import {Provider} from 'react-redux';
import Test from './src/components/Test';
const store = configureStore();

//const Test = () => {
//  return <Text>Hello</Text>;
//};

const MainApp = () => (
  <Provider store={store}>
    <App />
    {/*<Test />*/}
  </Provider>
);
AppRegistry.registerComponent(appName, () => MainApp);
