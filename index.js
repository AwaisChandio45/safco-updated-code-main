/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

AppRegistry.registerComponent(appName, () => App);

// IMPORT
import {onquestionsArray,alterTables, initDatabase, getLoanTopupLoanArray, getEmployeesRegionArray, getAssetsDocuments} from './src/sqlite/sqlitedb';
import { CreateDatabaseManually, CreateRepaymentLogTable } from './src/sqlite/RepaymentDataBase';

// ********************** INITIALIZE DATABASE ************************************
  
initDatabase();

alterTables().then(() => {
    AsyncStorage.setItem("@station", "");

}).catch((error) => {
    console.log('index=>',error)
    

});
  

CreateDatabaseManually();

CreateRepaymentLogTable();

// ********************** INITIALIZE DATABASE ************************************

