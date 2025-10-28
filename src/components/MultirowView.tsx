import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TextView from "./TextView";
const _MultirowView = ({ text1, text2, text3, text4, text5, text6, value = 2 }) => {
    return (
        <View style={styles.row}>

            <TextView style={value == 2 ? styles.txt2 : styles.txt1} text={text1} />
            <TextView style={value == 2 ? styles.txt2 : styles.txt1} text={text2} />
            <TextView style={value == 2 ? styles.txt2 : styles.txt1} text={text3} />
            <TextView style={value == 2 ? styles.txt2 : styles.txt1} text={text4} />
            <TextView style={value == 2 ? styles.txt2 : styles.txt1} text={text5} />
            <TextView style={value == 2 ? styles.txt2 : styles.txt1} text={text6} />





        </View>
    )
}
export default memo(_MultirowView);
const styles = StyleSheet.create({
    row: { margin: 5, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' },

    txt1: { fontSize: 12, color: '#7d7d7d', margin: 10, fontWeight: 'bold', textAlign: 'center' },
    txt2: { fontSize: 12, color: '#000', fontWeight: 'bold', margin: 10, textAlign: 'center' },

})