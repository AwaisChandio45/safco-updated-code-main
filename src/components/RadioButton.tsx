import React, { useState, useEffect,memo } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import {RadioButton} from 'react-native-paper';
import { Colors } from "../theme";

const CustomRadioButton = ({ onPress, selected, children }) => {
  
  return (
    <View style={styles.radioButtonContainer}>
    <RadioButton
    value={selected}
    uncheckedColor={'#cdcdcd'}
    color={Colors.parrotGreenColor}
    status={selected ? 'checked' : 'unchecked'}
    onPress={onPress}
  />
  <View style={{display:children?null:"none"}}>
      <Pressable onPress={onPress} >
        <Text style={styles.radioButtonText}>{children}</Text>
      </Pressable>
      </View>
  </View>
    // <View style={styles.radioButtonContainer}>
    //   <View style={{flex:1}}>
    //   {/* <Pressable onPress={onPress} style={styles.radioButton}>
    //     {
    //     selected ?
    //     <View style={styles.radioButtonIcon} />
    //     : null
    //     }
    //   </Pressable> */}
    //    <RadioButton
    //         value={selected}
    //         uncheckedColor={'#cdcdcd'}
    //         color={Colors.parrotGreenColor}
    //         status={selected ? 'checked' : 'unchecked'}
    //         onPress={onPress}
    //       />
    //   </View>
    //   {/* <View style={{flex:9}}>
    //   <Pressable onPress={onPress} style={styles.radioBtnText}>
    //     <Text style={styles.radioButtonText}>{children}</Text>
    //   </Pressable>
    //   </View> */}
    // </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20
  },
  title: {
    fontWeight: "bold",
    fontSize: 10,
    marginVertical: 1,
    textAlign: "center"
  },
  radioButtonContainer: {
    flexDirection: "row",
    marginRight:20,
    marginBottom: 5
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center"
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#98CFB6"
  },
  radioButtonText: {
    marginLeft: 5,
    padding:5
  },
  text: {
    lineHeight: 30,
    fontSize: 20,
    marginVertical: 5
  }
});

export default memo(CustomRadioButton);
