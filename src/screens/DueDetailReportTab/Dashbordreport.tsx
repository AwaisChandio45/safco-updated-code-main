import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, ScrollView, TextInput, Alert } from 'react-native'
import { GlobalStyles, Colors } from '../../theme';
import RNFS from 'react-native-fs';

import DailyReportTableComponent from '../../components/DaillyReportTableComponent';
import BmDailyReportTableComponent from '../../components/BmDaillyReportTableComponent';
import {
    AppStatusBar,
    HeaderwithoutDialoge,
    TextView,
} from '../../components';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { connect, useSelector } from 'react-redux';
import ReportCard from '../../components/ReportCard';
import moment from 'moment';

const Dashbordreport = ({ route }) => {
    const [report, setReports] = React.useState(route.params.report.data);
    const [orignal, setOrignal] = React.useState(route.params.report.data);
    const [progress, setProgress] = React.useState(false)
    const AppFolder = 'Safco_reactapp';
    const getUserData = useSelector((state) => state.UserData);
    const [UserData, setUserData] = React.useState(undefined);
    // console.log("Report===>"+ JSON.stringify(report))
    React.useEffect(() => {
        setUserData(getUserData.UserData)
    }, [])
    //console.log(route.params.report.LoanDetails)
    const handleSearch = (text) => {
        try {
            if (text) {
                const newData = orignal.filter((item) => {
                    return (
                        item.LoanId.toLowerCase().indexOf(text.toLowerCase()) >= 0
                        || item.CustomerName.toLowerCase().indexOf(text.toLowerCase()) >= 0
                        || item.MobileNo.toLowerCase().indexOf(text.toLowerCase()) >= 0
                    )
                }


                    //  var itemData   = item
                    //   ? item.LoanId.toUpperCase()
                    //   : ''.toUpperCase();


                    // const textData = text.toUpperCase();
                    // return itemData.indexOf(textData) > -1;
                );
                setReports(newData);
                // setSearch(text);
            } else {
                setReports(orignal);
                // setSearch(text);
            }
        } catch (error) {
            //console.log(error)
        }

    }

    return (
        <>
            {/* <AppStatusBar></AppStatusBar> */}
            <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
            </View>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 20, top: 20 }}>
                <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10  }}>
                    <TextView text={"Daily Collection Report"} style={{textDecorationLine: 'underline', }} />
                </View>
                {getUserData.UserData.EmployeeTypeName === 'Credit Officer' && (
                    <View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: "#cdcdcd", justifyContent: 'flex-end' }}>
                            <Text style={{ padding: 6, fontWeight: '800', color: '#000', fontSize: 12 }}>
                                Date: {moment(report[0].Date).format("dddd, MMMM D, YYYY")}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Total Customer'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Total Repayment'} />
                            </View>
                        </View></View>


                )}
                {getUserData.UserData.EmployeeTypeName === 'Branch Manager' && (
                    <View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: "#cdcdcd", justifyContent: 'flex-end' }}>
                            <Text style={{ padding: 6, fontWeight: '800', color: '#000', fontSize: 12 }}> Date : {moment(report[0].Date).format("dddd, MMMM D, YYYY")}  </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Station Name'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Employee Name'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Repayment Amount'} />
                            </View>
                        </View></View>

                )}
                {getUserData.UserData.EmployeeTypeName === 'Area Manager' && (
                    <View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: "#cdcdcd", justifyContent: 'flex-end' }}>
                            <Text style={{ padding: 6, fontWeight: '800', color: '#000', fontSize: 12 }}> Date : {moment(report[0].Date).format("dddd, MMMM D, YYYY")}  </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Station Name'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'BM Name'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Repayment Amount'} />
                            </View>
                        </View></View>

                )}
                  {getUserData.UserData.EmployeeTypeName === 'Manager Operation' && (
                    <View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: "#cdcdcd", justifyContent: 'flex-end' }}>
                            <Text style={{ padding: 6, fontWeight: '800', color: '#000', fontSize: 12 }}> Date : {moment(report[0].Date).format("dddd, MMMM D, YYYY")}  </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Station Name'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'RM Name'} />
                            </View>
                            <View style={styles.tableCell}>
                                <TextView style={styles.columnOneText} text={'Repayment Amount'} />
                            </View>
                        </View></View>

                )}
                {getUserData.UserData.EmployeeTypeName == "Credit Officer" && <FlatList
                    data={report}
                    renderItem={({ item }) => (
                        <DailyReportTableComponent item={item} />

                    )}
                    keyExtractor={item => item.SrNo}
                />}
                {(getUserData.UserData.EmployeeTypeName == "Branch Manager" || getUserData.UserData.EmployeeTypeName == "Area Manager" || getUserData.UserData.EmployeeTypeName == "Manager Operation") && <FlatList
                    data={report}
                    renderItem={({ item }) => (
                        <BmDailyReportTableComponent item={item} />
                    )}
                    keyExtractor={item => item.SrNo}
                />}
            </SafeAreaView>

            <ProgressDialog
                visible={progress}
                title="Downloading Report..."
                message="Please, wait..."
                activityIndicatorColor={Colors.parrotGreenColor}
            />
        </>
    )
}

export default Dashbordreport;
const styles = StyleSheet.create({
    rowOne: {
        flexDirection: 'row',
    }, rowTwo: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1'
    }, columnOne: {
        padding: 10,
        alignItems: 'flex-start'
    }, columnOneText: {
        fontSize: 12, color: 'white',
        fontWeight: 'bold',

    }, columnTwo: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 10
    }, columnTwoText: {
        fontSize: 12
    }, tableContainer: {
        flexDirection: 'column',
    }, tableRow: {
        flexDirection: 'row',
        backgroundColor: '#130C52',

    }, tableCell: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',


    }, tableHeaderText: {
        fontWeight: 'bold',
    }, tableText: {
        fontWeight: 'normal',
    },
})