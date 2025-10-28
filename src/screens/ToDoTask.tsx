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
} from "../components";
import { GlobalStyles, Colors } from "../theme";
import AddNewTask from "../components/AddNewTask";
import ViewTask from "../components/ViewTask";


export default function ToDoTask() {
    const [index, setIndex] = React.useState(2);
    return (
        <>
            <AppStatusBar></AppStatusBar>
            <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15 }}
                    text="Routene Task Manager"></TextView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabsitems
                    text={"Add New Task"}                 
                    active={index == 1 ? true : false}
                    onPress={() => { setIndex(1) }}
                />

                <Tabsitems
                    text={"View Task"}
                    active={index == 2 ? true : false}
                    onPress={() => { setIndex(2) }}
                />
            </View>

            {index == 1 && <AddNewTask/>}
            
            {index == 2 && <ViewTask/>}

        </>
    )
}