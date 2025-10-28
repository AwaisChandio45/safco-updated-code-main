import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, ScrollView, TextInput, Alert } from 'react-native'
import { GlobalStyles, Colors } from '../../src/theme';
import RNFS from 'react-native-fs';

import CreditScoringReports from '../components/CreditScoringReports';
// import BmDailyReportTableComponent from '../../components/BmDaillyReportTableComponent';
import {
    AppStatusBar,
    HeaderwithoutDialoge,
    TextView,
} from '../../src/components';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { connect, useSelector } from 'react-redux';

const CreditScoringReport = ({ route }) => {
    const [report, setReports] = React.useState(route.params.res.data);
    const [orignal, setOrignal] = React.useState(route.params.res.data);
    const [progress,setProgress]=React.useState(false)
    const AppFolder = 'Safco_reactapp'; 
    const getUserData = useSelector((state) => state.UserData);
    const [UserData, setUserData] = React.useState(undefined);


    return (
        <>
            <AppStatusBar></AppStatusBar>
            <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
            </View>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
                <CreditScoringReports report={report} />
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

export default CreditScoringReport;