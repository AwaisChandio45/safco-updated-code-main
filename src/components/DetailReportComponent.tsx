import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';
import {
    AppStatusBar,
    HeaderwithoutDialoge,
    TextView,
    DateSelector
} from '.';
import { GlobalStyles, Colors } from '../theme';
import { CustomButton } from '.';
import ClientDueDateComponent from './ClientDueDateComponent';
import DetailReportPicker from './DetailReportPicker';
import { FONTS } from '../theme/Fonts';
import ModalListComponent from './ModalListComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DetailReport = ({
    dropDownData,
    staffArray,
    clientWise,
    setClientWise,
    StationName,
    onPress
}) => {

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            <View style={styles.formContainer}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoContainerSecondLayer}>
                        <MaterialCommunityIcons
                            name="clipboard-text-outline"
                            color='#fff'
                            size={50} />
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputContainer}>
                        <TextView style={styles.textViewStyle} text={"Select Station"}></TextView>
                        <TextView style={{ marginLeft: 0, borderBottomWidth: 1, borderBottomColor: '#cdcdcd',
                            marginTop: 10, color: '#1d1d1d',paddingLeft:20,
                             fontsFamily: FONTS.FONT_REGULAR, 
                             fontSize: 12 }} text={StationName}></TextView>
                        {/* <ModalListComponent
                                text={"Select Station"}
                                required={false}
                                type={2}                       
                                tempdata={dropDownData}
                                label={clientWise.stationName?clientWise.stationName:'Select Station'}
                                onSelect={
                                    async (value, underindex) => {
                                        // alert(JSON.stringify(value))
                                       setClientWise({...clientWise,stationName:value.label,stationId:value.id})
                                }}

                            /> */}
                        {/* <DetailReportPicker onValueChange={onChange} value={"DropDown"} data={dropDownData?dropDownData:['No Data']} /> */}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextView style={styles.textViewStyle} text={"Disburse Date From"}></TextView>
                        <ClientDueDateComponent
                            container={clientWise}
                            //isDatePickerVisible = {isDatePickerVisible} 
                            variable={1}
                            //setDatePickerVisibility = {setDatePickerVisibility} 
                            //handleConfirm={handleConfirmDispurseFrom}
                            //showDatePicker={showDatePicker}
                            //hideDatePicker={hideDatePicker}
                            text={clientWise.disburseDateFrom}
                            setDate={setClientWise}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextView style={styles.textViewStyle} text={"Disburse Date To"}></TextView>
                        <ClientDueDateComponent
                            container={clientWise}
                            //isDatePickerVisible = {isDatePickerVisible} 
                            //setDatePickerVisibility = {setDatePickerVisibility}
                            variable={2}
                            //handleConfirm={handleConfirmDispurseTo}
                            //showDatePicker={showDatePicker}
                            //hideDatePicker={hideDatePicker}
                            text={clientWise.disburseDateTo}
                            setDate={setClientWise}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextView style={styles.textViewStyle} text={"Recovery Date From"}></TextView>
                        <ClientDueDateComponent
                            container={clientWise}
                            //isDatePickerVisible = {isDatePickerVisible} 
                            //setDatePickerVisibility = {setDatePickerVisibility} 
                            variable={3}
                            //handleConfirm={handleConfirmRecoverFrom}
                            //showDatePicker={showDatePicker}
                            //hideDatePicker={hideDatePicker}
                            text={clientWise.recoveryDateFrom}
                            setDate={setClientWise}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextView style={styles.textViewStyle} text={"Recovery Date To"}></TextView>
                        <ClientDueDateComponent
                            container={clientWise}
                            //isDatePickerVisible = {isDatePickerVisible} 
                            //setDatePickerVisibility = {setDatePickerVisibility} 
                            variable={4}
                            //handleConfirm={handleConfirmRecoverTo}
                            //showDatePicker={showDatePicker}
                            //hideDatePicker={hideDatePicker}
                            text={clientWise.recoveryDateTo}
                            setDate={setClientWise}
                        />
                    </View>
                    <View style={{ marginTop: 13 }}>
                        <ModalListComponent
                            text={"Select Staff"}
                            required={false}
                            type={2}
                            tempdata={staffArray}
                            label={clientWise.staffName ? clientWise.staffName : 'Select Station'}
                            onSelect={
                                async (value, underindex) => {
                                    setClientWise({ ...clientWise, staffName: value.label, staffId: value.id })
                                }}

                        />
                    </View>
                    <View style={{ marginTop: 13, flexDirection: 'row', justifyContent: 'center' }}>
                        <CustomButton
                            text={"Generate Report"}
                            style={{ padding: 10, borderRadius: 20, alignItems: 'center', width: "90%" }}
                            textStyle={{ fontSize: 17 }}
                            onPress={onPress}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        backgroundColor: "#fff",
        elevation: 10,
        padding: 20,
        marginTop: 30,
        borderRadius: 10
    },

    inputContainer: {
        marginTop: 13
    },
    textViewStyle: {
        fontSize: 12,
        marginLeft: 10,
        fontFamily: FONTS.FONT_REGULAR
    },
    textContainer: { padding: 10, borderWidth: 1 },
    logoContainer: {
        alignItems: 'center'
    },
    logoContainerSecondLayer: {
        backgroundColor: Colors.parrotGreenColor,
        elevation: 10,
        width: 80,
        height: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: '-19%'
    },
})

export default DetailReport;