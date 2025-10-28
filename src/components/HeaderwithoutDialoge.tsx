import React,{memo,useEffect} from 'react';
import { Animated, View ,Pressable,BackHandler } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux'

import {useNavigation} from '@react-navigation/native';
import { Colors } from '../theme';
import { CustomGetDataModule } from '../utilis/RequiredArrays';
import AskingDialoge from './AskingDialoge';

const HeaderwithoutDialoge = ({Theme,back=false}) => {
  const navigation = useNavigation();
  const[dialogVisible,setDialogVisible]=React.useState(false);

  const _onPress=() =>{
    if(back){
      navigation.goBack()
     
    }else{
      navigation.openDrawer()

    }
  }
return <Pressable  onPressIn={_onPress}>

   {back ?
      <Ionicons name={"ios-caret-back"} size={28} color={Colors.parrotGreenColor} style={{ paddingHorizontal: 30,marginTop: 50}} />

   :
      <Feather name={"menu"} size={28} color={Colors.parrotGreenColor} style={{ paddingHorizontal: 30,marginTop: 50}} />
   }
    </Pressable> 
    
};

export default memo(HeaderwithoutDialoge);