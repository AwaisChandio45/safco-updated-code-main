import React, { useState } from 'react'
import { Tab, TabView } from 'react-native-elements';
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
} from '../../components';
import { GlobalStyles, Colors } from '../../theme';
import DailyCollectionComponent from '../../components/DailyCollectionComponent';
import { getStationData, getStaffData } from '../../sqlite/sqlitedb';
import { connect, useSelector } from 'react-redux';
import { getDailyCollectionReport } from '../../apis_auth/apis';
import { getDailyCollectionReportBm ,getDailyCollectionReportRm , getDailyCollectionReportZm} from '../../apis_auth/apis';



  const DailyCollectionReport = ({ navigation }) => {
    const [toast, setToast] = React.useState({ value: "", type: "" });
    const getUserData = useSelector((state) => state.UserData);
    const [UserData, setUserData] = React.useState(undefined);
    const StationReducer = useSelector((state) => state.StationReducer);

    const [index, setIndex] = React.useState(1);
    const [getArray, setArray] = React.useState();
    const [noData, setNoData] = React.useState();

    const [staffArray, setStaffArray] = React.useState([]);
    const [noStaffData, setNoStaffData] = React.useState();
    ///////////Daily Collection Report State//////
 const [dueDetailReport, setDailyCollectionReport] = React.useState()
 const [noDueDetialdata, setNoDailyCollectionData] = React.useState(false)
 const [progressVisible, setProgressVisible] = React.useState(false)

    React.useEffect(() => {
        getStationData(setArray, setNoData);
        
        getStaffData(setStaffArray, setNoStaffData,StationReducer.station.stationId)
        setUserData(getUserData.UserData)
    
    }, [])
    return(
        <>
        <AppStatusBar></AppStatusBar>
        <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15 }}
                    text="Reports"></TextView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabsitems
                    text={"Daily Collection Report"}
                    active={index == 1 ? true : false}
                    onPress={() => { setIndex(1) }}

                />



            </View>

            {index == 1 && <DailyCollectionComponent
                StationName={StationReducer.station.stationName}
                // clientWise={clientWisedue}
                // setClientWise={setClientWisedue}
                // dropDownData={getArray}
                // staffArray={staffArray}
                onPress={() => {
                    {getUserData.UserData.EmployeeTypeName == "Credit Officer" && getDailyCollectionReport(StationReducer.station.stationId,getUserData.UserData.EmployeeId,getUserData.UserData.EmployeeTypeId, setDailyCollectionReport, setNoDailyCollectionData, setProgressVisible).then((value) => {
                        let data = value.data;
                        if (data == 'No Record Found') {
                            setToast({
                                type: "error",
                                message: '' + data,
                            });
                        } else {
                            navigation.navigate('GeneratedDailyReport', { report: value });
                        }
                    })}
                    //Branch MAnager
                    {getUserData.UserData.EmployeeTypeName == "Branch Manager" && getDailyCollectionReportBm(StationReducer.station.stationId,getUserData.UserData.EmployeeId,getUserData.UserData.EmployeeTypeId, setDailyCollectionReport, setNoDailyCollectionData, setProgressVisible).then((value) => {
                        let data = value.data;
                        if (data == 'No Record Found') {
                            setToast({
                                type: "error",
                                message: '' + data,
                            });
                        } else {
                            navigation.navigate('GeneratedDailyReport', { report: value });
                        }
                    })}
                    //


                      //Area Manager
                      {getUserData.UserData.EmployeeTypeName == "Area Manager" && getDailyCollectionReportRm(StationReducer.station.stationId,getUserData.UserData.EmployeeId,getUserData.UserData.EmployeeTypeId, setDailyCollectionReport, setNoDailyCollectionData, setProgressVisible).then((value) => {
                        let data = value.data;
                        if (data == 'No Record Found') {
                            setToast({
                                type: "error",
                                message: '' + data,
                            });
                        } else {
                            navigation.navigate('GeneratedDailyReport', { report: value });
                        }
                    })}
                    //

                       //Area Manager
                       {getUserData.UserData.EmployeeTypeName == "Manager Operation" && getDailyCollectionReportZm(StationReducer.station.stationId,getUserData.UserData.EmployeeId,getUserData.UserData.EmployeeTypeId, setDailyCollectionReport, setNoDailyCollectionData, setProgressVisible).then((value) => {
                        let data = value.data;
                        if (data == 'No Record Found') {
                            setToast({
                                type: "error",
                                message: '' + data,
                            });
                        } else {
                            navigation.navigate('GeneratedDailyReport', { report: value });
                        }
                    })}
                    //
                }}
            />}
             <CustomProgressDialoge
                dialogVisible={progressVisible}
                setDialogVisible={setProgressVisible}
                title={"Fetching reports..."}
            />
       
        </>
    )
}
export default DailyCollectionReport;