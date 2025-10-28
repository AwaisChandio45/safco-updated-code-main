import React,{memo} from "react";
import { View, StyleSheet, Pressable, Animated,Dimensions,Alert } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Card } from 'react-native-paper'
const {height, width} = Dimensions.get('window');
import { LogBox } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { TouchableOpacity} from 'react-native-gesture-handler'
import { useSelector, useDispatch, connect } from "react-redux";
import { getPermission } from "../utilis/GetPermission";
import Colors from '../theme/Colors';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();
 const BottomAnim=(props)=>{
  const navigation = useNavigation();
//   const updatecheck = useSelector((state) => state.updateCheck);
const StationReducer = useSelector((state) => state.StationReducer);
const SyncdownReducer = useSelector((state) => state.SyncdownReducer);
    const[mode,setMode] =React.useState(new Animated.Value(0))
    const[buttonSize,setButtonSize] =React.useState(new Animated.Value(1))
    const [UserData, setUserData] = React.useState(undefined);
    const getUserData = useSelector((state) => state.UserData);
    React.useEffect(async () => {
  
      // let get = await AsyncStorage.getItem('@userData');
      // let parser = JSON.parse(get);
      // alert(JSON.stringify(getUserData.UserData.EmployeeTypeName))
      setUserData(getUserData);
    }, []);
    const handlePress = () => {
        // alert(SyncdownReducer.syncDown)
        // return
        if(SyncdownReducer.syncDown==""){
            
            Alert.alert(
                "Process Stop!","Please Syncdown first.",
                [
                
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
            return
        }else if(UserData != undefined && UserData.UserData.EmployeeTypeName == "Branch Manager"){
            Alert.alert(
                "Sorry!","Branch Manager have not rights to add Customers or Groups!",
                [
                
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
            return
        }
        else if(UserData != undefined && UserData.UserData.EmployeeTypeName == "Verification Officer"){
            Alert.alert(
                "Sorry!","Verification Officer have not rights to add Customers or Groups!",
                [
                
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
            return
        }
        Animated.sequence([
            Animated.timing(buttonSize, {
                toValue: 0.95,
                duration: 200,
                useNativeDriver: false,
                
            }),
            Animated.timing(buttonSize, {
                toValue: 1
            }),
            Animated.timing(mode, {
                toValue: mode._value === 0 ? 1 : 0
            })
        ]).start();
    };

        const thermometerX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-24, -50]
        });

        const thermometerY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, -100]
        });

        const timeX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-24, -24]
        });

        const timeY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, -150]
        });

        const pulseX = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-24, 20]
        });

        const pulseY = mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, -100]
        });

        const rotation = mode.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "45deg"]
        });

        const sizeStyle = {
            transform: [{ scale: buttonSize }]
        };
        const handletogoAddcustomer=()=>{
            handlePress()
            getPermission().then(valid=>{

                props.UpdateCheck({value:false, id: null})
                //navigation.navigate('HalafNama',{item:{}})
                navigation.navigate('CIBReport')
        
              }).catch(e=> navigation.replace('PermissionScreen', { userData: {}, station: 101 }))
           
        }
        const handletogoAddgroup=()=>{
            handlePress()
            navigation.navigate('AddGroup',{item:{}})
        }

        return (
            <View style={{ position: "absolute", alignItems: "center"}}>
                <Animated.View style={{ position: "absolute", left: thermometerX, top: thermometerY }}>
                <TouchableOpacity 
                activeOpacity={0.7}
                style={{ width: 48,
                    height: 48,}}
                onPress={handletogoAddgroup}>
                    <View style={styles.secondaryButton}>
                        <AntDesign name="addusergroup" size={24} color="#FFF" />
                    </View>
                    </TouchableOpacity>
                </Animated.View>
                {/* <Animated.View style={{ position: "absolute", left: timeX, top: timeY }}>
                    <View style={styles.secondaryButton}>
                        <Feather name="clock" size={24} color="#FFF" />
                    </View>
                </Animated.View> */}
                <Animated.View style={{ position: "absolute", left: pulseX, top: pulseY }}>
                <TouchableOpacity 
                activeOpacity={0.7}
                style={{ width: 48,
                    height: 48,}}
                onPress={handletogoAddcustomer}>
                   
                    <View style={styles.secondaryButton}>
                    <AntDesign name="adduser" size={24} color="#FFF" />
                    </View>
                </TouchableOpacity>

                </Animated.View>
            

                <Animated.View style={[styles.button, sizeStyle]}>
                    <Pressable onPressIn={handlePress}>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            {/* <FontAwesome5 name="plus" size={24} color="#FFF" /> */}
                         <Card style={{height:height/10,width:height/10,borderRadius:200,
            elevation:20,marginBottom:25}}>
              <View style={{alignSelf:'center',justifyContent:'center',flex:1}}>
               <MaterialIcons name="add" color={props.color} size={46} />
               </View>
             </Card>
                        </Animated.View>
                    </Pressable>
                </Animated.View>
            </View>
        );
    
}
const mapDispatchToProps = (dispatch) => {
    return {
        UpdateCheck: (Data) => {
        dispatch({
          type: 'SET_UPDATECHECK',
          payload:Data
        });
      },
    };
  };
  export default connect(null,mapDispatchToProps)(memo(BottomAnim));
const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 72,
        height: 72,
        borderRadius: 36,
        position: "absolute",
        marginTop: -40,
        shadowColor: "#7F58FF",
        shadowRadius: 5,
        shadowOffset: { height: 10 },
        shadowOpacity: 0.3,
       
    },
    secondaryButton: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor:Colors.primary,
    }
});