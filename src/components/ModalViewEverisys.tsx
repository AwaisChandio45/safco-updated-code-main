import React,{useState} from 'react';
import {StyleSheet, View, Pressable, Modal, Dimensions,ScrollView} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../theme';
import TextView from './TextView';
import {getStationArray} from '../sqlite/sqlitedb';
var {height, width} = Dimensions.get('window');
import DropDownPicker from 'react-native-dropdown-picker';
import {FONTS} from '../theme/Fonts';
import CustomButton from './CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';

const ModalView = ({visible, setVisible,childerns}) => {
  const navigation = useNavigation();
  const [getStation, setStation] = React.useState([]);
  const [selectStation, setSelectStation] = React.useState('');
  const [open, setOpen] = useState(false);
 
  const [noData, setNoData] = React.useState([]);

  React.useEffect(() => {
    // getStationArray(setStation, setNoData);
  }, []);
  const _onPress = () => {
    setVisible(false);
  };
  // const _onSavedClick=() => {
  //   AsyncStorage.setItem("@station",JSON.stringify(value));
  //   setVisible(false)
  // }

  return (
    <Modal
    animationType={'fade'}
    transparent={true}
    visible={visible}
    onRequestClose={() => {
      setVisible(false);
      //console.log('Modal has been closed.');
    }}>
    <View style={styles.modal}>
    
      <BlurView
        style={styles.absolute}
        //   viewRef={this.state.viewRef}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
        <Pressable 
            onPress={()=>{setVisible(false)}}
            style={{alignSelf:'flex-end'}}>
              <MaterialCommunityIcons
              name={'close'}
              style={{color:Colors.red}}
              size={26}
              ></MaterialCommunityIcons>
            </Pressable>
      {childerns}
     
    </View>
  </Modal>
  );
};
const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalcardall: {
    borderRadius: 20,
    marginTop:20,
    width: width/1.1,
    elevation: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },

});

export default ModalView;
