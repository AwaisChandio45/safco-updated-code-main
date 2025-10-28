import React from "react";
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';
import {
    AppStatusBar,
    HeaderwithoutDialoge,
    TextView,
    DateSelector,
    CustomProgressDialoge,
    Tabsitems
} from "../../components";
import { GlobalStyles, Colors } from "../../theme";

import HrmsComplainView from "../../components/HrmsComplainView";
import HrmsComplainAdd from "../../components/HrmsComplainAdd";


export default function HrmsComplain() {
    const [index, setIndex] = React.useState(2);
    return (
        <>
            <AppStatusBar></AppStatusBar>
            <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15 }}
                    text="HrmsComplain Registration"></TextView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabsitems
                    text={"HrmsComplain View"}
                    active={index == 1 ? true : false}
                    onPress={() => { setIndex(1) }}

                />


                <Tabsitems
                    text={"Add New Complain"}
                    active={index == 2 ? true : false}
                    onPress={() => { setIndex(2) }}

                />
            </View>
            
            {index == 1 && <HrmsComplainView/>}

            {index == 2 && <HrmsComplainAdd/>}



        </>
    )
}