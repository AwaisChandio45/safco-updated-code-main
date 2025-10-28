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
import { CustomButton } from '../../components';
import CustomCalender from '../../components/CustomCalender';
import DetailReportPicker from '../../components/DetailReportPicker';
import { FONTS } from '../../theme/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DetailReport from '../../components/DetailReportComponent';
import { getStationData, getStaffData } from '../../sqlite/sqlitedb';
import { getDueDetailReport, getRemainingDetailReport } from '../../apis_auth/apis';
import Toast from '../../components/Toast';
import { connect, useSelector } from 'react-redux';


const DueDetalReport = ({ navigation }) => {
    const getUserData = useSelector((state) => state.UserData);
    const [UserData, setUserData] = React.useState(undefined);
    const StationReducer = useSelector((state) => state.StationReducer);

    const [index, setIndex] = React.useState(1);
    const { height, width } = Dimensions.get('window');
    const array_index = 0
    const [allDataobj, setAlldataobj] = React.useState([]);
    const [toast, setToast] = React.useState({ value: "", type: "" });
    const [staionVal, setStationVal] = React.useState();
    const [staffName, setStaffName] = React.useState();
    const [getArray, setArray] = React.useState();
    const [noData, setNoData] = React.useState();
    const [staffArray, setStaffArray] = React.useState([]);
    const [noStaffData, setNoStaffData] = React.useState();
    
    const [clientWisedue, setClientWisedue] = React.useState(
        {
            stationName: '',
            stationId: '',
            disburseDateFrom: '',
            disburseDateTo: '',
            recoveryDateFrom: '',
            recoveryDateTo: '',
            staffName: '',
            staffId: ''

        }

    );
    const [clientWiseRemaings, setClientWiseRemaings] = React.useState(
        {
            stationName: '',
            stationId: '',
            disburseDateFrom: '',
            disburseDateTo: '',
            recoveryDateFrom: '',
            recoveryDateTo: '',
            staffName: '',
            staffId: ''

        }
    );
    ///////////////////////// Due Detail Report State
    const [dueDetailReport, setDueDetailReport] = React.useState()
    const [noDueDetialdata, setNoDueDetialData] = React.useState(false)
    const [progressVisible, setProgressVisible] = React.useState(false)

    //////////////////////// Remaining Detail Report State

    const [remDetailReport, setRemDetailReport] = React.useState()
    const [noRemDetialData, setNoRemDetialData] = React.useState()
    const [remProgressVisible, setRemProgressVisible] = React.useState()

    React.useEffect(() => {
        getStationData(setArray, setNoData);
        
        getStaffData(setStaffArray, setNoStaffData,StationReducer.station.stationId)
        setUserData(getUserData.UserData)

    }, [])

    return (
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
                    text={"Client wise due detail report"}
                    active={index == 1 ? true : false}
                    onPress={() => { setIndex(1) }}

                />


                <Tabsitems
                    text={"Client wise remaining detail report"}
                    active={index == 2 ? true : false}
                    onPress={() => { setIndex(2) }}

                />




            </View>

            {index == 1 && <DetailReport
                StationName={StationReducer.station.stationName}
                clientWise={clientWisedue}
                setClientWise={setClientWisedue}
                dropDownData={getArray}
                staffArray={staffArray}
                onPress={() => {
                    getDueDetailReport(StationReducer.station.stationId,clientWisedue, setDueDetailReport, setNoDueDetialData, setProgressVisible).then((value) => {
                        let loanDetail = value.LoanDetails;
                        if (loanDetail == 'No Record Found') {
                            setToast({
                                type: "error",
                                message: '' + loanDetail,
                            });
                        } else {
                            navigation.navigate('GeneratedReport', { report: value });
                        }
                    })
                }}
            />}
            {index == 2 && <DetailReport
                staffArray={staffArray}
                StationName={StationReducer.station.stationName}
                clientWise={clientWiseRemaings}
                onPress={() => {
                    getRemainingDetailReport(StationReducer.station.stationId,clientWiseRemaings, setRemDetailReport, setNoRemDetialData, setProgressVisible, UserData.MobileToken).then((value) => {
                        let loanDetail = value.LoanDetails;
                        if (loanDetail == 'No Record Found') {
                            setToast({
                                type: "error",
                                message: '' + loanDetail,
                            });
                        } else {
                            navigation.navigate('GeneratedReport', { report: value });
                        }
                    })
                }}
                setClientWise={setClientWiseRemaings}
                dropDownData={getArray}
            />}

            {/* /////////////////// PRORESSS  */}
            <CustomProgressDialoge
                dialogVisible={progressVisible}
                setDialogVisible={setProgressVisible}
                title={"Fetching reports..."}
            />
            <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />

        </>
    )
}

export default DueDetalReport;