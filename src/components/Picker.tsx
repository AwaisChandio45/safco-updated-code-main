import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet, Dimensions} from 'react-native';
import {FONTS} from '../theme/Fonts';
import {View} from 'react-native-animatable';
var {height, width} = Dimensions.get('window');

const MyPicker = ({onValueChange, value, data}) => {
  return (
    <View style={styles.picker}>
      <Picker
        selectedValue={value}
        mode="dropdown"
        dropdownIconColor="#f1f1f1"
        onValueChange={onValueChange}
        fontFamily={FONTS.FONT_REGULAR}
        numberOfLines={3}>
        {data.map(item => {
          return (
            <Picker.Item
              style={styles.pickerItem}
              fontFamily={FONTS.FONT_REGULAR}
              label={item}
              value={item}
              color="#737373"
            />
          );
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    backgroundColor: '#f1f1f1',
    height: 55,
    paddingLeft: 0,
    marginTop: 5,
    marginBottom: 33,
    borderBottomColor: '#cdcdcd',
    borderBottomWidth: 1,
    //flexDirection:'row',
    width: width / 2.5,
    borderRadius: 3,
  },
  pickerItem: {
    height: 55,
    fontSize: 12,
    marginBottom: 33,
    borderBottomColor: '#cdcdcd',
    borderBottomWidth: 1,
    alignItems: 'center',
    width: width / 2.5,
    borderRadius: 3,
  },
});

export default MyPicker;
