import React, {memo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  TextInput,
  Pressable,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card} from 'react-native-paper';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
const {height, width} = Dimensions.get('window');
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import RejectCommentModal from './RejectCommentModal';

const GroupRecorditems = ({
  item,
  onPress,
  onPressSyncup,
  onPressReject,
  setCommentRecject,
  comment,
  UserData
}) => {
  const [modalVisiblereject, setModalVisibleReject] = useState(false);
  //console.log('===check this=>',modalVisiblereject )
  return (
    <View style={{marginBottom:10}}>
       <RejectCommentModal onPress={onPressReject} modalVisiblereject={modalVisiblereject} setCommentRecject={setCommentRecject} comment={comment} setModalVisibleReject={setModalVisibleReject} />
    <View
      style={{
        flexDirection: 'row',
        padding: 20,
        margin:10,
        alignItems:'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
      }}>
        <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
      <View style={{}}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            borderColor: '#cdcdcd',
            borderWidth: 1,justifyContent:'center'
          }}>
             <MaterialCommunityIcons
              name="account-group"
              color={Colors.parrotGreenColor}
              size={20}
              style={{alignSelf: 'center'}}
            />
          </View>
      </View>
      <View style={{ paddingLeft: 10}}>
        <View>
          <TextView type={"headingMid"} text={item.group_name} style={{fontSize: 16,color:'#3d3d3d'}} />
        </View>
      </View>
      </View>
      <View style={{paddingRight: 5}}>
      <TouchableOpacity
            // activeOpacity={0.7}
          style={{
            alignSelf: 'center',
            backgroundColor: Colors.parrotGreenColor,
            padding:8,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPressIn={onPress}
          >
          <TextView text={'Update'} style={{fontSize: 12, color: '#fff'}} />
        </TouchableOpacity>
        
        
      </View>
      <View
          style={{
            flexDirection: 'row',
            justifyContent:'space-around',
            position:'absolute',
            right:20,
            bottom:-10,              
            //marginBottom: 0,
            //marginTop: 20,
          }}>
          {
          (UserData?.UserData?.EmployeeTypeId == 5 || UserData?.UserData?.EmployeeTypeId == 33) &&            
              <Pressable
              style={[styles.bottomButton,{marginRight:10}]}
              // onPressIn={onPressReject}
              onPressIn={()=>setModalVisibleReject(true)}
              >
              <Entypo
                name="block"
                color={Colors.parrotGreenColor}
                size={17}
                style={{alignSelf: 'center'}}
              />
              
              </Pressable>

              
         }
          <Pressable
              style={[styles.bottomButton,{marginRight:10}]}
              onPressIn={onPressSyncup}
              >
              <EvilIcons
                name="refresh"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
              
              </Pressable>
          
        
        </View>
        
        
    </View>
  
  </View>
  );
};
const styles = StyleSheet.create({
  SyncButton:{position:'absolute',bottom:10,right:100,
    justifyContent:'center'},
    row:{flexDirection:"row",alignItems:'center'},
    card:{height:80,borderRadius:5,elevation:3,marginTop:10,marginBottom:10},
    updateButton:{position:'absolute',bottom:-1,right:1,
    justifyContent:'center',borderTopLeftRadius:10,padding:10,
    backgroundColor:Colors.parrotGreenColor},
    bottomButton:{
      backgroundColor: '#fff',
      alignItems: 'center',
      borderRadius: 50,
      width: 70,
      height: 30,
      elevation: 5,
      flexDirection: 'column',
      justifyContent: 'center',
    }
});
export default memo(GroupRecorditems);
