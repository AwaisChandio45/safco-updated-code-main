import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import { BlurView } from '@react-native-community/blur';
import { TextView } from '.';
var {height, width} = Dimensions.get('window');

const SelectPhotosDialoge = ({dialogVisible, onPress, onBarcode, onQrcode, closeModal,enableInput}) => {
  return (

    <Modal
    animationType="slide"
    transparent={true}
    visible={dialogVisible}
    onRequestClose={onPress}>
       <BlurView
      style={styles.absolute}
      //   viewRef={this.state.viewRef}
      blurType="light"
      blurAmount={10}
      reducedTransparencyFallbackColor="white"
    />
    <View style={styles.modalMainView}>
      <TextView type="heading_20" text={"Select option"}></TextView>
       <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',

        }}>
        <TouchableWithoutFeedback onPress={onBarcode}>
          <View style={{margin: 20, justifyContent: 'center'}}>
          <MaterialCommunityIcons 
          style={{alignSelf:'center'}}
          name="barcode" size={26}></MaterialCommunityIcons>

            <Text style={{textAlign: 'center'}}>Barcode</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onQrcode}>
          <View style={{margin: 20, justifyContent: 'center'}}>
          <MaterialCommunityIcons 
          style={{alignSelf:'center'}}
          
          name="qrcode" size={26}></MaterialCommunityIcons>

            <Text style={{textAlign: 'center'}}>Qrcode</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>{closeModal() 
          enableInput()}}>
          <View style={{margin: 20, justifyContent: 'center'}}>
          <MaterialCommunityIcons 
          style={{alignSelf:'center'}}
          name="pen" size={26}></MaterialCommunityIcons>

            <Text style={{textAlign: 'center'}}>Edit</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
       
    
    </View>

  </Modal>
 
  )
};
const styles = StyleSheet.create({
  modalMainView: {
    height: height / 5,
    width: width / 1.3,
    marginTop: height / 4,
    borderRadius: 20,
    padding: 10,
    elevation: 20,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    justifyContent:'center',
  }, absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
export default SelectPhotosDialoge;
