import React, {memo} from 'react';
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
import {Colors} from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Modalize} from 'react-native-modalize';

const SafcoCustomersRecord = ({
  item,
  onPress,
  onPressSyncup,
  UserData,
  getCibPress,
}) => {
  return (
    <Pressable style={{marginBottom: 10}} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          padding: 20,
          margin: 10,
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 10,
          elevation: 5,
        }}>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <View style={{}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                borderColor: '#cdcdcd',
                borderWidth: 1,
                justifyContent: 'center',
              }}>
              <Fontisto
                name="person"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>

          <View style={{paddingLeft: 10}}>
            <View>
              <TextView
                type={'headingMid'}
                text={item.FirstName}
                style={{fontSize: 16, color: '#3d3d3d'}}
              />
            </View>
            <View>
              <TextView
                type={'text'}
                text={item.NICNumber}
                style={{fontSize: 12, color: '#3d3d3d'}}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.CIBButton]}
              onPressIn={() => getCibPress()}>
              <Ionicons
                name="document-text-outline"
                color={Colors.parrotGreenColor}
                size={20}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  SyncButton: {
    position: 'absolute',
    bottom: 10,
    right: 100,
    justifyContent: 'center',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  card: {
    height: 80,
    borderRadius: 5,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  updateButton: {
    position: 'absolute',
    bottom: -1,
    right: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    padding: 10,
    backgroundColor: Colors.parrotGreenColor,
  },
  bottomButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 50,
    width: 70,
    height: 30,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  CIBButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 50,
    width: 50,
    height: 30,
    elevation: 5,
    flexDirection: 'column',
    marginLeft: 180,
    position: 'absolute',
    top: 50,
  },
});
export default memo(SafcoCustomersRecord);
