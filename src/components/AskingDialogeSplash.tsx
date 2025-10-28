import React,{memo,useEffect} from 'react';
import { Animated, View ,Pressable,StyleSheet,
  Modal,Dimensions

} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux'
import { BlurView } from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import { Colors } from '../theme';
import { CustomGetDataModule } from '../utilis/RequiredArrays';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { Dialog } from 'react-native-simple-dialogs';
import LottieView from 'lottie-react-native';
import TextView from './TextView';
import { FONTS } from '../theme/Fonts';
const {height, width} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';

const AskingDialoge = ({dialogVisible,setDialogVisible,
  onPress,h1="Do you really want to go back?",
  h2="You will be lost all filled data!",
onPressCancle
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  useEffect(() => {
   
  }, []);
 

return <Modal
    // animationType={'fade'}
    transparent={true}
    visible={dialogVisible}
    onRequestClose={() => {
      setDialogVisible(false);
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
     
        <Card style={styles.modalcardall}>
       <View style={{padding:10,alignSelf:'center'}}>
<LottieView
style={{height:120,width:100,alignSelf:'center'}}
    source={require('../assests/anim/question.json')}
    // colorFilters={[{
    //   keypath: "button",
    //   color: "#F00000"
    // },{
    //   keypath: "Sending Loader",
    //   color: "#F00000"
    // }]}
    autoPlay
    loop
  />
    <TextView type={'heading_20'} text={h1} 
    style={{color:Colors.darkGreenColor,marginTop:20}}></TextView>

<TextView type={'Light'} text={h2} 
    style={{color:Colors.light_grey,marginTop:10,alignSelf:'center'}}></TextView>

    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',
    marginTop:20,}}>
        <Pressable
        onPressIn={onPressCancle}
        style={styles.dialogeButton}>
<TextView type={'Light'} text={"No"} style={{alignSelf:'center'}}></TextView>
        </Pressable>

        <Pressable 
        onPressIn={onPress}
        style={styles.dialogeButton}>
<TextView type={'Light'} text={"Yes"} style={{alignSelf:'center'}}></TextView>
        </Pressable>
    </View>

</View>
       
{/* <Pressable 
        onPress={()=>{setDialogVisible(false)}}
        style={{top:10,right:10,position:'absolute'}}>
          <MaterialCommunityIcons
          name={'close'}
          style={{color:Colors.red}}
          size={26}
          ></MaterialCommunityIcons>
        </Pressable> */}
        </Card>
        

    
      </View>
    </View>
  </Modal>

}
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
    marginTop:0,
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
  dialogeButton:{
    borderColor:Colors.darkGreenColor,
    borderWidth:1,
    padding:10,
    width:100
    ,borderRadius:10 },
  name: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 14,
  },
  name2: {
    fontFamily: FONTS.FONT_BOLD,
    fontSize: 24,
  },
  editext: { marginTop: 80, marginLeft: 20 },

  textInput:{backgroundColor:'#f1f1f1',height:55,paddingLeft:0,marginTop:5,marginBottom:33,
  borderBottomColor:'#cdcdcd',borderBottomWidth:1,flexDirection:'row',alignItems:'center',
  width:width/2.5,borderRadius:3},
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
    justifyContent:'center',

  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
export default memo(AskingDialoge);