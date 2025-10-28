import React, { useRef, useState } from "react";
import {
  SafeAreaView,Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Dimension,
  useColorScheme,
  Animated,
  View,
  Dimensions,Easing, TouchableOpacity, Alert
} from 'react-native';



    export default  Customprogress=(props)=>{
  const [leftPosition,setLeftpostion] =useState(new Animated.Value(0)) 
  const [onLoad,setonLoad] =useState(false)
  const [value] = useState(new Animated.Value(10))
  const playAnimation=()=>{
    Animated.parallel([
      Animated.timing(leftPosition, {
        toValue:400,
        useNativeDriver: false,
        duration:1000
      }),
      Animated.timing(value, {
        toValue: 100,
        duration: 1000,
        useNativeDriver:false
    })
    ]).start(()=>{
        setTimeout(() => {
          Animated.parallel([
          Animated.timing(leftPosition, {
            toValue: 0,
            useNativeDriver: false,
            duration:1000
          }),
          Animated.timing(value, {
            toValue: 10,
            duration: 1000,
            useNativeDriver:false
        }).start()
        
        ]).start(()=>{
            setonLoad((v)=>({...v}))});
        }, 100);
      });
    }
  React.useEffect(()=>{
    
    if(onLoad){
      
      playAnimation()
    }else{
  playAnimation()

    }
  },[onLoad])
  React.useEffect(()=>{
   
}, [props.value])

const width = value.interpolate({
    inputRange: [0, 10],
    outputRange: ['0%', '10%'],
})
//this methodes are using right now ---------
//   calling this when you want to move view to left to right

const mooveLR=()=>{
    Animated.timing(
      leftPosition,
      {
        toValue:500,
        duration: 1000, // the duration of the animation
        easing: Easing.linear,
        useNativeDriver:false // the style of animation 
      }
    ).start() 
    
  } 
//   calling this when you want to move view to right to left
  const  mooveRL=()=>{
    Animated.timing(
      leftPosition,
      {
        toValue: 0,
        duration: 1000, // the duration of the animation
        easing: Easing.linear,
        useNativeDriver:false // the style of animation 
      }
    ).start() 
    
   
  }
    return(
        <View style={{marginTop:0,width:Dimensions.get('window').width,height:3,backgroundColor:'#f1f1f1'}}>
        <Animated.View style={{marginLeft:leftPosition,width:width
       
       }}>
          <View style={{height:3,backgroundColor:props.color}}>
     <Text></Text>
          </View>
        </Animated.View>
         </View>
         
    )
    
    }
