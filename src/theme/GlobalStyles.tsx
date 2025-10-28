import React, {useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';

var {height, width} = Dimensions.get('window');

var GlobalStyles = StyleSheet.create({
  bounceview: {marginTop: 20, marginBottom: 10, padding: 10},
  buttomheader: {
    flexDirection: 'row',
    elevation: 5,
    alignItems: 'center',
    backgroundColor: Colors.kulfa,
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
  },

  box: {
    width: '99%',
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#f1f1f1',
    alignSelf: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainView: {paddingTop: 30},
});

export default GlobalStyles;
