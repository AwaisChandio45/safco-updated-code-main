import React,{useState} from 'react';
import {StyleSheet, View, Pressable, Modal, Dimensions,ScrollView} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

const ModalView = ({visible, setVisible,onPress,setValuefromModule,getValuefromModule,stations,text}) => {
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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // setVisible(false);
      }}>
         <BlurView
        style={styles.absolute}
        //   viewRef={this.state.viewRef}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.modalMainView}>
        <TextView type="heading_20" text={text}></TextView>
        {stations.length > 0 && (
           <DropDownPicker
           open={open}
           dropDownContainerStyle={{borderColor:'#cdcdcd',marginTop:20,maxHeight: height / 3,}}
           searchTextInputProps={{borderColor:'#cdcdcd'}}
           style={{marginTop:20,borderColor:'#cdcdcd'}}
           value={getValuefromModule}
           placeholder="Select an Station"
           searchable={true}
           items={stations}
           setOpen={setOpen}
           setValue={setValuefromModule}
          //  setItems={setItems}
         />
         
        
        )}
        <CustomButton
          style={{
            alignSelf: 'center',
            width: width / 2,
            borderRadius: 10,
            padding: 10,
          }}
          text={'Saved'}
          onPress={onPress}
          textStyle={{alignSelf: 'center', fontSize: 14}}></CustomButton>
        <Pressable
          style={{position: 'absolute', top: 10, right: 10}}
          onPress={_onPress}>
          <MaterialCommunityIcons
            style={{color: '#FF0000', alignSelf: 'center'}}
            name="close"
            size={26}></MaterialCommunityIcons>
        </Pressable>
      </View>
 
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalMainView: {
    height: height / 2,
    width: width / 1.5,
    marginTop: height / 4,
    borderRadius: 20,
    padding: 10,
    elevation: 20,
    backgroundColor: '#FFF',
    alignSelf: 'center',
  }, absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ModalView;
