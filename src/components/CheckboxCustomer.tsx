import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View,TextInput,Pressable,Dimensions,StyleSheet,Alert,} from 'react-native';
import { Checkbox } from 'react-native-paper';
import {Card} from 'react-native-paper';
import {connect, useSelector} from 'react-redux';
import {TextView} from '.';
import {FONTS} from '../theme/Fonts';
import LottieView from 'lottie-react-native';
const {height, width} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';


const CheckboxCustomer = ({
  item,
  onPress,
  onPresscheckBox
}) => {
  return (
    <Card style={styles.card}>
   
      <View style={{justifyContent: 'center'}}>
        <View style={[styles.row,{marginTop:10,marginLeft:20}]}>
        <Ionicons  name="person-circle-outline"  color={Colors.parrotGreenColor}  size={26}  />         
          <TextView style={{marginLeft:10}} type="small" text={"Name: "}></TextView>
          <TextView type="Light" text={item.user_name}></TextView>
        </View>
        <View style={[styles.row,{marginTop:5,marginLeft:20}]}>
        <Entypo name="v-card" color={Colors.parrotGreenColor} size={26} />            
          <TextView style={{marginLeft:10}} type="small" text={"CNIC: "}></TextView>
          <TextView type="Light" text={item.user_cnic}></TextView>
        </View>   
      </View>
    <View style={styles.updateButton}  >
      <Checkbox
      color={"#FFF"}
      uncheckedColor={"#FFF"}
      status={item.isCheck ? 'checked' : 'unchecked'}
      onPress={onPresscheckBox}
    />
      </View>
    </Card>  
  );
};
const styles = StyleSheet.create({
    row:{flexDirection:"row",alignItems:'center'},
    card:{height:100,borderRadius:5,elevation:3,marginTop:10,marginBottom:10},
    updateButton:{position:'absolute',bottom:-1,right:1,
    justifyContent:'center',borderTopLeftRadius:10,padding:10,
    backgroundColor:Colors.parrotGreenColor}
});
export default memo(CheckboxCustomer);
