import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  Dimensions,
  Platform,
  Modal,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import {TouchableOpacity,TouchableWithoutFeedback} from 'react-native-gesture-handler'
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {Colors, GlobalStyles} from '../theme';
import { Card } from 'react-native-paper';
const {height, width} = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../theme/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from '@react-native-community/blur';
const CustomDropdown = ({style,text,required}) => {
const[filterModal,setfilterModal]=React.useState(false);
  return (<View>
    
    {/* <TextView type={'formLabel'} text={text.length>20?text.substring(0,20)+"...":text} 
      style={{color:'#737373',marginLeft:10}}></TextView> */}
   <View style={styles.textinput}>
   {required && <View style={{position:'absolute',right:1,top:-5}}>
        <Text style={{color:'#FF0000'}}>*</Text>
      </View>}
      <Pressable
      onPress={()=>{
        setfilterModal(true)
      }}
      style={[styles.dropdownstyles,{flexDirection:'row',alignItems:'center'}]}
      >
    {/* <TextView type={'formLabel'} text={text.length>20?text.substring(0,20)+"...":text} /> */}
      <MaterialCommunityIcons name="menu-down"  
         color={'#000'} size={26}></MaterialCommunityIcons>
      </Pressable>
      </View>
   { filterModal && (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={filterModal}
        onRequestClose={() => {
          setfilterModal(false);
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
          <View style={{width:'100%', flexDirection: 'column', alignItems: 'center' }}>
          <Pressable 
            onPress={()=>{setfilterModal(false)}}
            style={{alignSelf:'flex-end'}}>
              <MaterialCommunityIcons
              name={'close'}
              style={{color:Colors.red}}
              size={26}
              ></MaterialCommunityIcons>
            </Pressable>
            <Card style={styles.modalcardall}>
              <View style={{ flex: 1, padding: 5 }}>
               {/* //your content */}
               <TextView text="hello"></TextView>
              </View>
            </Card>
            
 
        
          </View>
        </View>
      </Modal>
    )}
  </View>
   

  );
};
const styles = StyleSheet.create({
  shareview: { flexDirection: 'row', alignItems: 'center', margin: 5 },
  modalcardtopright: {
    borderRadius: 20,
    height: height / 10,
    width: width / 4,
    elevation: 20,
  },
  dropdownstyles:{marginLeft:20,flex:1},
  modalcardall: {
    borderRadius: 20,
    marginTop:20,
    width: width / 1.3,
    elevation: 20,
  },
  text1: { fontSize: 14, color: '#8E8E93', fontFamily: FONTS.FONT_REGULAR },
  text2: { fontSize: 20, color: '#000', fontFamily: FONTS.FONT_SEMI_BOLD },
  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
  },

  name: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 14,
  },
  name2: {
    fontFamily: FONTS.FONT_BOLD,
    fontSize: 24,
  },
  editext: { marginTop: 80, marginLeft: 20 },

  textinput: {
    width: width / 2.5,
    height: 100,
    justifyContent: 'center',
    backgroundColor: '#F8F8F9',
    borderRadius: 20,
    alignSelf: 'center',
  },
  alltext: {
    marginRight: 10,
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 14,
  },
  historytext: {
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: 18,
  },
  historyblock: {
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F8F8F9',
    borderRadius: 30,
    width: Dimensions.get('screen').width,
  },

  modal: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default memo(CustomDropdown);












// import React, { useState } from "react";
// import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import DetailReportPicker from "./DetailReportPicker";
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Colors } from "../theme";
// import { TextView } from ".";

// const {width, height} = Dimensions.get('window')
// const ModalDropDown = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [dropDownVal, setDropDownVal] = useState('Select Value');
//   const [data, setData] = useState(
//       [
//           'car',
//           'bike',
//           'house',
//           'cycle',
//           'desk',
//           'verge',
//           'hamza',
//           'computer',
//           'laptop',
//         ])
//     const setValue = (val)=>{
//         setDropDownVal(val);
//         setModalVisible(!modalVisible)
//     }
//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           // Alert.alert("Modal has been closed.");
//           // setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={{width:width,height:height, }}>
//           <View style={styles.modalView}>
//               <ScrollView >
//                   {data.map((item,index)=>{
//                       return(
//                           <Pressable 
//                           style={{padding:12, borderBottomColor:'#f0f5f1', borderBottomWidth:1}}
//                           onPress = {() => setValue(item)}
//                           >
//                               <Text>{item}</Text>
//                           </Pressable>
                          
//                       )
//                   })}
//               </ScrollView>
//                 <Pressable style={{
//                     marginBottom:'-5%', 
//                     alignItems:'center', 
//                     backgroundColor:Colors.parrotGreenColor,
//                     padding:5,
//                     width:'60%',
//                     borderRadius:6,
//                     elevation:5,
//                     alignSelf:"center"
//                     }}
//                     onPress = {() => setModalVisible(!modalVisible)}
//                     >
//                     <TextView
//                     style={{color:'#fff'}}
//                     text={"Cancel"}>
//                         </TextView>     
//                 </Pressable>
//                 {/* <DetailReportPicker 
//                 onValueChange={() => setModalVisible(!modalVisible)} 
//                 value={'custom drop'} 
//                 data={['verge', 'verge','verge']} 
//                 /> */}
//             {/* <Pressable
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.textStyle}>Hide Modal</Text>
//             </Pressable> */}
//           </View>
//           </View>
//         </View>
//       </Modal>
//       <Pressable
//         style={[styles.button, styles.buttonOpen]}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.textStyle}>{dropDownVal}</Text>
//         <MaterialCommunityIcons
//         name="chevron-down"
//         size={20}
//         style={{marginLeft:10}}
//         color={Colors.parrotGreenColor}>

//         </MaterialCommunityIcons>
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'rgba(52, 52, 52, 0.1)',
//     borderRadius: 20,
//     width:'80%',
//     height:'80%',
//     padding: 35,
//     //alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   button: {
//     padding: 10,
//   },
//   buttonOpen: {
//     borderBottomWidth:1,
//     borderColor:'#cdcdcd',
//     flexDirection:'row',
//   },
//   buttonClose: {
//     marginTop:30,
//     backgroundColor: "green",
//   },
//   textStyle: {
//     color:'black',
//     fontWeight: "bold",
//     textAlign: "center"
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center"
//   }
// });

// export default ModalDropDown;