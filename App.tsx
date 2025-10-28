

import React from 'react';
import type {Node} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigations/RootNavigator'
// import { configureFontAwesomePro } from "react-native-fontawesome-pro";
// configureFontAwesomePro();
import { Provider } from 'react-redux';
import store from "./src/Redux/store";
import {Alert} from 'react-native'
// import codePush from 'react-native-code-push';
// import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { setJSExceptionHandler, setNativeExceptionHandler  } from 'react-native-exception-handler';

const App: () => Node = () => {
  const errorHandler = (e, isFatal) => {
    if (isFatal) {
      // Alert.alert(
      //     'Unexpected error occurred',
      //     `
      //     Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
      //     We have reported this to our team ! Please close the app and start again!
      //     `,
      //   [{
      //     text: 'Close'
      //   }]
      // );
    } else {
      console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
  };
  
  setJSExceptionHandler(errorHandler, true);
  
  setNativeExceptionHandler((errorString) => {
      console.log('setNativeExceptionHandler'+errorString);
  });
  
  return (
    <Provider store={store}>
    <NavigationContainer>
      <RootNavigator></RootNavigator>
    </NavigationContainer>
    </Provider>
  );
}
// export default codePush(App);
export default App;

