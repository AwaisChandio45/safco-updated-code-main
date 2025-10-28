import React, {useState, memo} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const QrcodeScreen = ({
  visible,
  setVisible,
  setAlldataobj,
  allDataobj,
  array_index,
  cnicFor,
}) => {
    ///////////////////////////////////////
// 0== customer Cninc
  ////////////////////////////////////////////////
  const onSuccess = e => {
    let data = e.data.substring(12, e.data.length - 1);
  
    setVisible(false);
    if (cnicFor == 0) {
      let get = allDataobj;
      get.customerInfo[array_index].customer_cnicNumber.value = data.replace(/(\d{5})(\d{7})(\d+)/, '$1-$2-$3');
      get.customerInfo[array_index].customer_cnicNumber.error = false;
      setAlldataobj({...get});
    }
    //console.log('---->', JSON.stringify(e));
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <QRCodeScanner
              onRead={onSuccess}
              flashMode={RNCamera.Constants.FlashMode.on}
              topContent={
                <Text style={styles.centerText}>
                  Go to{' '}
                  <Text style={styles.textBold}>
                    wikipedia.org/wiki/QR_code
                  </Text>{' '}
                  on your computer and scan the QR code.
                </Text>
              }
              bottomContent={
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}
                  style={styles.buttonTouchable}>
                  <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
              }></QRCodeScanner>
            <View
              style={{
                position: 'absolute',
                top: 100,
                height: '56%',
                width: '30%',
                alignSelf: 'center',
                marginLeft: 0,
              }}>
              <BarcodeMask
                width={200}
                height={'56%'}
                showAnimatedLine={true}
                outerMaskOpacity={0}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40,
  },
  bottomOverlay: {
    position: 'absolute',
    width: '100%',
    flex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default memo(QrcodeScreen);
