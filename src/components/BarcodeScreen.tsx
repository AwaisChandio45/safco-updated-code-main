import React, {useState, memo, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
// import BarcodeScanner, {
//   Exception,
//   FocusMode,
//   TorchMode,
//   CameraFillMode,
//   BarcodeType,
//   pauseScanner,
//   resumeScanner,
// } from '';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {height, width} = Dimensions.get('window');
import BarcodeMask from 'react-native-barcode-mask';
const BarcodeScreen = ({
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
  const convertToUrdu = text => {
    let characters = text.split(',');
    var sb = '';

    for (var i = 0; i < characters.length; i++) {
      switch (characters[i]) {
        case '20':
          sb + ' ';
          break;

        case '22':
          sb + '\u0622';
          break;

        case '27':
          sb + '\u0627';
          break;

        case '13':
          sb + '\u0613';
          break;

        case '28':
          sb + '\u0628';
          break;

        case '2B':
          sb.push('\u062b');
          break;

        case '86':
          sb + '\u0686';
          break;

        case '88':
          sb + '\u0688';
          break;

        case '2F':
          sb + '\u062f';
          break;

        case '10':
          sb + '\u0610';
          break;

        case '39':
          sb + '\u0639';
          break;

        case '41':
          sb + '\u0641';
          break;

        case '3A':
          sb + '\u063a';
          break;

        case 'AF':
          sb + '\u06af';
          break;

        case '2D':
          sb + '\u062d';
          break;

        case 'BE':
          sb + '\u06be';
          break;

        case 'CC':
          sb + '\u06cc';
          break;

        case '36':
          sb + '\u0636';
          break;

        case '2C':
          sb + '\u062c';
          break;

        case '2E':
          sb + '\u062e';
          break;

        case '43':
          sb + '\u0643';
          break;

        case '12':
          sb + '\u0612';
          break;

        case '44':
          sb + '\u0644';
          break;

        case '45':
          sb + '\u0645';
          break;

        case 'BA':
          sb + '\u06ba';
          break;

        case '46':
          sb + '\u0646';
          break;

        case '29':
          sb + '\u0629';
          break;

        case 'A9':
          sb + '\u06a9';
          break;

        case 'C1':
          sb + '\u06c1';
          break;

        //case "45":
        //    sb+("\u0645");
        //    break;

        case '7E':
          sb + '\u067e';
          break;

        case '42':
          sb + '\u0642';
          break;

        case '91':
          sb + '\u0691';
          break;

        case '31':
          sb + '\u0631';
          break;

        case '35':
          sb + '\u0635';
          break;

        case '33':
          sb + '\u0633';
          break;

        case '79':
          sb + '\u0679';
          break;

        case '2A':
          sb + '\u062a';
          break;

        case '21':
          sb + '\u0621';
          break;

        case '38':
          sb + '\u0638';
          break;

        case '37':
          sb + '\u0637';
          break;

        //case "48":
        //    sb+("\\u0635\u0644\u0649\u0020\u0627\u0644\u0644\u0647\u0020\u0639\u0644\u064a\u0647\u0020\u0648\u0633\u0644\u0645");
        //    break;

        case '48':
          sb + '\u0648';
          break;

        case '98':
          sb + '\u0698';
          break;

        case '34':
          sb + '\u0634';
          break;

        case 'D2':
          sb + '\u06d2';
          break;

        case '30':
          sb + '\u0630';
          break;

        case '32':
          sb + '\u0632';
          break;

        case '60':
          sb + '\u0660';
          break;

        case '61':
          sb + '\u0661';
          break;

        case '62':
          sb + '\u0662';
          break;

        case '63':
          sb + '\u0663';
          break;

        case '64':
          sb + '\u0664';
          break;

        case '65':
          sb + '\u0665';
          break;

        case '66':
          sb + '\u0666';
          break;

        case '67':
          sb + '\u0667';
          break;

        case '68':
          sb + '\u0668';
          break;

        case '69':
          sb + '\u0669';
          break;

        case '0C':
          sb + ' \u200c';
          break;

        case 'D4':
          sb + '\u06d4';
          break;

        //case "0C":
        //    sb+("\u060c");
        //    break;

        case '1F':
          sb + '\u061f';
          break;

        case '02':
          sb + '\u0602';
          break;

        case '1B':
          sb + '\u061b';
          break;

        case '7b':
          sb + '\u007b';
          break;

        case '7D':
          sb + '\u007d';
          break;
        //default:
        //    sb+(ch);
        //    break;
      }
    }

    return sb.toString();
  };

  const barcodes = ({data, type}) => {
    if (type == 'PDF417') {
      let data2 = data.split('\r');
      //console.log('--->', JSON.stringify(data2[2]));
      setVisible(false);
      if (cnicFor == 0) {
        try {
          let get = allDataobj;
          get.customerInfo[array_index].customer_cnicNumber.value =
            data2[2].replace(/(\d{5})(\d{7})(\d+)/, '$1-$2-$3');
          get.customerInfo[array_index].customer_cnicNumber.error = false;
          setAlldataobj({...get});
        } catch (e) {
          alert('Barcode contains invalid information');
        }
      }
    } else {
      alert("WRONG CNIC Barcode.'");
    }
  };

  return (
    <View style={{}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}>
        <View style={styles.container}>
          <QRCodeScanner
            // style={{
            //   height: '86%',
            //   width: '90%',
            //   alignSelf: 'center',
            //   marginLeft: 20,
            // }}
            onRead={barcodes}
            // focusMode={FocusMode.ON}
            flashMode={RNCamera.Constants.FlashMode.torch}
            topContent={
              <Text style={{}}>
                Go to <Text style={{}}>wikipedia.org/wiki/QR_code</Text> on your
                computer and scan the QR code.
              </Text>
            }
            bottomContent={
              // <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={{}}>OK. Got it!</Text>
              // </TouchableOpacity>
            }
            // cameraFillMode={CameraFillMode.COVER}
            // barcodeType={
            //   BarcodeType.CODE_128 |
            //   BarcodeType.EAN_13 |
            //   BarcodeType.PDF417 /* replace with ALL for all alternatives */
            // }
          />
          {/* // Barcode example 2 */}

          <View
            style={{
              position: 'absolute',
              height: '66%',
              width: '60%',
              alignSelf: 'center',
              marginLeft: 0,
            }}>
            <BarcodeMask
              width={200}
              height={'76%'}
              showAnimatedLine={true}
              outerMaskOpacity={0.1}
            />
          </View>
        </View>

        <Pressable
          onPress={() => {
            setVisible(false);
          }}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: '#f1f1f1',
            borderRadius: 50,
            width: 40,
            height: 40,
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons
            style={{color: '#FF0000', alignSelf: 'center'}}
            name="close"
            size={26}></MaterialCommunityIcons>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    // backgroundColor: "white",
    // borderRadius: 20,
    // alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    margin: 20,
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
});

export default memo(BarcodeScreen);
