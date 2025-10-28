import React, {memo,useState, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  TextInput,
  Pressable,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import {Card} from 'react-native-paper';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
const {height, width} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import RejectCommentModal from './RejectCommentModal';

const CustomerRecorditems = ({
  item,
  onPress,
  onPressView,
  onPressIn,
  onPresscomment,
  onPressReject,
  setCommentRecject,
  comment,
  onPressNavigation,
  UserData,
  getCibPress,
  getCreditScoringReport
}) => {
  const [modalVisiblereject, setModalVisibleReject] = useState(false);
  return (
    <View>
        <RejectCommentModal onPress={onPressReject} modalVisiblereject={modalVisiblereject} setCommentRecject={setCommentRecject} comment={comment} setModalVisibleReject={setModalVisibleReject} />
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 20,
          paddingTop:5,
          paddingLeft:10,paddingRight:10,
          margin:0,
          marginLeft:5,
          marginRight:5,
          marginBottom:20,
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
               <Fontisto
                name="person"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
            </View>
        </View>
        <View style={{ paddingLeft: 10}}>
          <View>
            <TextView type={"headingMid"} text={item.user_name} style={{fontSize: 14,color:'#3d3d3d'}} />
            <TextView text={item.user_cnic} style={{fontSize: 12,color:'#7d7d7d'}} />
          </View>
        </View>
        </View>
        <View style={{paddingRight: 5,marginLeft:10,display:'flex',flexDirection:'row',justifyContent:'space-between',alignContent:'space-between'}}>
        <TouchableOpacity
            style={{
              alignSelf: 'center',
              backgroundColor: Colors.parrotGreenColor,
              padding:8,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              right:2      
            }}
            onPressIn={onPressView}
            >
            <TextView text={'View'} style={{fontSize: 12, color: '#fff'}} />
          </TouchableOpacity>
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
              right:-2,
              bottom:-10,              
            }}>
                {
             (UserData?.UserData?.EmployeeTypeId == 5 || UserData?.UserData?.EmployeeTypeId == 33) &&            
              <Pressable
              style={[styles.bottomButton,{marginRight:5}]}
              onPressIn={()=>setModalVisibleReject(true)}
              //onPressIn={onPressReject}
              >
              <Entypo
                name="block"
                color={Colors.parrotGreenColor}
                size={17}
                style={{alignSelf: 'center'}}
              />
              
              </Pressable>
             
         }

           <TouchableOpacity
            // activeOpacity={0.7}
              style={[styles.bottomButton, {marginRight: 5}]}
              onPressIn={()=>getCreditScoringReport()}
              >
              <Ionicons
                name="md-documents-outline"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
              </TouchableOpacity>

              <TouchableOpacity
            // activeOpacity={0.7}
              style={[styles.bottomButton, {marginRight: 5}]}
              onPressIn={()=>getCibPress()}
              >
              <Ionicons
                name="document-text-outline"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
              </TouchableOpacity>
            
            {
            UserData != undefined && 
            // UserData.UserData.EmployeeTypeName == "Branch Manager" &&
            item.isGroupMember != 1 &&             
            <TouchableOpacity
            activeOpacity={0.7}
                style={[styles.bottomButton,{marginRight:5}]}
                onPressIn={onPresscomment}
                >
                <EvilIcons
                  name="comment"
                  color={Colors.parrotGreenColor}
                  size={20}
                  style={{alignSelf: 'center'}}
                />
                </TouchableOpacity>
           }
            {
            // UserData != undefined && UserData.UserData.EmployeeTypeName == "Branch Manager" && 
            item.isGroupMember!=1 &&
            <TouchableOpacity
            // activeOpacity={0.7}
              style={styles.bottomButton}
              onPressIn={onPressIn}
              >
              <EvilIcons
                name="refresh"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
         </TouchableOpacity>
          }
         
                 <TouchableOpacity
            // activeOpacity={0.7}
              style={[styles.bottomButton,{marginLeft:10}]}
              onPressIn={onPressNavigation}
              >
              <Ionicons
                name="md-navigate-outline"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>         
          </View>          
      </View>  
    </View>
  );
};
const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  card: {
    height: 100,
    borderRadius: 10,
    elevation: 5,
    margin: 5,
  },
  updateButton: {
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    padding: 10,
    backgroundColor: Colors.parrotGreenColor,
  },
  SyncButton: {
    justifyContent: 'center',
    marginRight: 10,
  },
  commentButton: {
    justifyContent: 'center',
    marginRight: 5,
  },
  bottomButton:{
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 50,
    width: 50,
    height: 30,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  }
});
export default memo(CustomerRecorditems);
