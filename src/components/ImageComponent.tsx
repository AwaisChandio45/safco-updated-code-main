import React, { useState, useEffect,memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, ActivityIndicator, Alert } from 'react-native';
import { FormInputs } from '.';
import ZoomableImage from './ZoomableImage';

const { height, width } = Dimensions.get('window');
const ImageComponent = ({onChangeText,imgValue,error,value,dropdownshow}) => {
return (
    <View>
      <ZoomableImage
      images={`data:image/gif;base64,${imgValue}`}
      />
   
    <FormInputs
      required={true}
      text={'Image title'}
      error={error}
      value={value}
      onChangeText={onChangeText}
      dropDownButton={true}
      dropdownshow={dropdownshow}
      ></FormInputs>
  </View>
    )
}
export default memo(ImageComponent);