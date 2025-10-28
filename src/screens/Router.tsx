import React, { useEffect, memo } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  useColorScheme,
  View,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {AppStatusBar, TextView} from '../components';
import {connect, useSelector} from 'react-redux';
import {onquestionsArray, initDatabase, getLoanTopupLoanArray, getEmployeesRegionArray, getAssetsDocuments} from '../sqlite/sqlitedb';
import { CreateDatabaseManually, CreateRepaymentLogTable } from '../sqlite/RepaymentDataBase';

const Router: () => Node = props => {

  const navigation = useNavigation();
  
  
  const [noData, setNoData] = React.useState([]);


 

  useEffect(async () => {

    
  getEmployeesRegionArray(setNoData).then((regions) => {

    props.GETRegions(regions)
      

      navigation.replace('Splash');
  
    
  
  })
});


  

  return (
   
    <>
      <AppStatusBar></AppStatusBar>
</>
     
  );
};


const mapDispatchToProps = dispatch => {

  return {
   
   
    GETRegions: Data => {

      dispatch({

        type: 'REGIONS',

        payload: Data,

      });
    },
  };
};
export default connect(null, mapDispatchToProps)(memo(Router));
