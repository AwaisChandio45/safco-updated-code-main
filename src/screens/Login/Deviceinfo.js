import { StyleSheet, Text, View ,ScrollView } from 'react-native'
import React from 'react'
import { useBatteryLevel ,useBatteryLevelIsLow ,useDeviceName ,useIsEmulator} from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';

const DeviceinfoOne = (props) => {
    let deviceJSON ={};
    deviceJSON.batteryLevel = useBatteryLevel;
    deviceJSON.batteryLevelIsLow =useBatteryLevelIsLow();
    deviceJSON.deviceName = useDeviceName();
    deviceJSON.isEmulator = useIsEmulator();
    deviceJSON.uniqueId = DeviceInfo.getUniqueId();
    deviceJSON.deviceId = DeviceInfo.getDeviceId();
    deviceJSON.systemName = DeviceInfo.getSystemName();
    deviceJSON.buildNumber = DeviceInfo.getBuildNumber();
    deviceJSON.brand = DeviceInfo.getBrand();
    deviceJSON.uniqueId = DeviceInfo.getUniqueId();
    deviceJSON.deviceType = DeviceInfo.getDeviceType();
console.log(deviceJSON)
  return (
    <View>
      <Text style={styles.titleStyle}>{props.title}</Text>
      <ScrollView>
      <Text style={styles.instruction}>
        {JSON.stringify(deviceJSON, null,'')}
        </Text>
      </ScrollView>
    </View>
  )
}

export default DeviceinfoOne

const styles = StyleSheet.create({
    titleStyle:{
        fontSize:20,
        fontWeight:'bold',
        marginBottom:10,
        marginTop:10,
        textAlign:'center'
    },
    instruction:{
        textAlign:'left',
        color:'#333333',
        margin:50
    }
})