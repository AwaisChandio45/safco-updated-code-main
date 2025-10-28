import React,{ memo }from "react";
import { View, StyleSheet } from "react-native";
import TextView from "./TextView";


const _rowView = ({ text, value }) => {
    return (
        <View style={styles.row}>
            <TextView style={styles.txt11} text={text} />

            <TextView style={styles.txt22} text={value} />



        </View>
    )
}
export default memo(_rowView);
const styles = StyleSheet.create({
    row: { margin: 5, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' },

    txt11: { fontSize: 16, color: '#7d7d7d', fontWeight: 'bold', textAlign: 'center' },
    txt22: { fontSize: 16, color: '#000', fontWeight: 'bold', textAlign: 'center' },

})