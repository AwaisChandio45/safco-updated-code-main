import React, { useEffect, useState, useRef } from 'react'
import { FlatList, Text, View, TextInput, Dimensions, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import { AppStatusBar, CustomProgressDialoge, HeaderwithoutDialoge, LoanVerificationScreen, Search, Tabsitems, TextView,CreditScoringReportScreen } from '../components';
import { GlobalStyles, Colors } from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from '../components';
import DetailReportPicker from '../components/DetailReportPicker';
import { Tab, TabView } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { LoanVerificationByCnic ,CreditScoringReport } from '../apis_auth/apis';
const { FingerModule } = NativeModules;
import { NativeModules } from 'react-native';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../components/Toast';
import RepaymentLogsScreen from '../components/RepaymentLogsScreen';
import { Modalize } from 'react-native-modalize';
import { Card } from 'react-native-paper';
import { FONTS } from '../theme/Fonts';
import {useSelector} from 'react-redux';




const LoanVerification = () => {
    // Type ----------> 1,Loan Verification. 
    const [type, setType] = useState(1);
    // ---------------------------------------------
    const [searchData, setSearchData] = React.useState(null);
    const [manage_cincNumber, setCnicNumber_manage] = React.useState("");
    const [toast, setToast] = React.useState({ value: "", type: "" });
    const [loading, setLoading] = React.useState(false);
    const [progressVisible, setProgressVisible] = React.useState(false)
    const navigation = useNavigation();
    const getUserData = useSelector(state => state.UserData);
    const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
    const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
    const renderItem = ([ ])=>{
        return (
            <Card style={styles.modalcardall}>
                <View style={{ padding: 10 }}>
                        <ScrollView
                            keyboardShouldPersistTaps={'handled'}
                        >
                            <View>
                                <TextView text={'Repayment Logs'} style={{ color: "#cdcdcd", alignSelf: 'center' }} />
                            </View>
                         
                        </ScrollView>
                    </View>
            </Card>
        )
    }
   
    return (
        <>
        <View style={{ flex: 1 }}>
                <AppStatusBar></AppStatusBar>
                <View style={GlobalStyles.row}>
                    <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>
                    <TextView
                        type={'mini_heading22'}
                        style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15 }}
                        text={`${loanLabel} Verification`}></TextView>
                </View>
               
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabsitems
                         text={`${loanLabel} Verification`}
                        active={type == 1 ? true : false}
                        onPress={() => { setType(1) }}
                    />

                     <Tabsitems
                        text={"Credit Scoring Report"}
                        active={type == 2 ? true : false}
                        onPress={() => { setType(2) }}

                    />

                </View>


                <View style={{ flex: 1 }}>
                    {/* /////////////  Loan Verification ////////////////////// */}

                   {/* ///////////// MANAGE REPAYMENTS ////////////////////// */}
                   {type == 1 && <LoanVerificationScreen
                        screenNo={1}
                        _onSeacrch={() => {
                            // alert("Alert")
                            setType(1)
                            if (manage_cincNumber == '') {
                                setToast({
                                    type: "error",
                                    message: 'Please insert CNIC Number!',
                                });
                            } else {
                                // setLoading(true)
                                LoanVerificationByCnic( manage_cincNumber , setProgressVisible).then((res) => {
                                    console.log('res=-=>'+JSON.stringify(res))
                                    if (res.StatusCode == 200) {
                                        navigation.navigate('LoanVerificationReport', {  res });    
                                    } else {
                                        setToast({
                                            type: "error",
                                            message: 'Data Not Found!',
                                        });
                                    }

                
                                })
                             
                            }
                        }}
                        _onSubmit={() => {

                        }}
                        cincNumber={manage_cincNumber}
                        setCnicNumber={setCnicNumber_manage}
                        toast={toast}
                        setToast={setToast}
                    />}

                      {/* ///////////// Credit Scoring Report ////////////////////// */}
                   {type == 2 && <CreditScoringReportScreen
                        screenNo={2}
                        _onSeacrch={() => {
                            // alert("Alert")
                            setType(1)
                            if (manage_cincNumber == '') {
                                setToast({
                                    type: "error",
                                    message: 'Please insert CNIC Number!',
                                });
                            } else {
                                // setLoading(true)
                                CreditScoringReport( manage_cincNumber , setProgressVisible).then((res) => {
                                    console.log('res=-=>'+JSON.stringify(res.StatusCode))                        
                                    if (res.StatusCode == 200) {
                                        navigation.navigate('CreditScoringReport', { res });    
                                    } else {
                                        setToast({
                                            type: "error",
                                            message: 'Data Not Found!',
                                        });
                                    }

                
                                })
                             
                            }
                        }}
                        _onSubmit={() => {

                        }}
                        cincNumber={manage_cincNumber}
                        setCnicNumber={setCnicNumber_manage}
                        toast={toast}
                        setToast={setToast}
                    />}
                    

<CustomProgressDialoge
                dialogVisible={progressVisible}
                setDialogVisible={setProgressVisible}
                title={"Fetching reports..."}
            />
                   
                </View>


            </View>
           
        </>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    Container: {
        //width:width/1,
        //margin:20,
        backgroundColor: "#fff",
        borderRadius: 15,
        elevation: 10
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 20
    },
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
        marginTop: '-12%'
    },
    inputText: {
        fontFamily: 'PoppinsRegular',
        backgroundColor: '#fff',
        width: '100%',
        marginLeft: 15,
        paddingLeft: 10,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#c4c4c2',
        marginBottom: 20,
        color: '#1d1d1d',
        fontSize: 14,
    },
    BtnCont: {
        padding: 10,
        alignItems: 'center'
    },
    pressSubmit: {
        margin: 10,
        backgroundColor: Colors.kulfa,
        borderRadius: 10,
        elevation: 5
    },
    pressVerify: {
        margin: 10,
        backgroundColor: Colors.kulfa,
        borderRadius: 10,
        elevation: 5
    },
    bottomBtn: {
        width: '30%',
        backgroundColor: Colors.parrotGreenColor,
        borderRadius: 10,
        elevation: 10,
    },
    bottomnewBtn: {
        height: 30, width: 100, borderRadius: 20, justifyContent: 'center',
        backgroundColor: '#FFF', elevation: 10,
    },
    modalcardall: {
        borderRadius: 20,
        margin: 10,
        width: width / 1.3,
        elevation: 10,
    },
    text1: { fontSize: 14, color: '#8E8E93', fontFamily: FONTS.FONT_REGULAR },
    text2: { fontSize: 20, color: '#000', fontFamily: FONTS.FONT_SEMI_BOLD },
    flexrow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        position: 'absolute',
    },
    circle: {
        height: 30, width: 30, borderRadius: 100, marginLeft: 0, marginRight: 10,
        justifyContent: 'center', backgroundColor: '#f1f1f1'
    },
    name: {
        fontFamily: FONTS.FONT_REGULAR,
        fontSize: 14,
    },
    name2: {
        fontFamily: FONTS.FONT_BOLD,
        fontSize: 24,
    },
    editext: { marginTop: 80, marginLeft: 20 },

    textInput: {
        backgroundColor: '#f1f1f1', height: 55, paddingLeft: 0, marginTop: 5, marginBottom: 33,
        borderBottomColor: '#cdcdcd', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center',
        width: width / 2.5, borderRadius: 3
    },
    alltext: {
        marginRight: 10,
        fontFamily: FONTS.FONT_REGULAR,
        fontSize: 14,
    },
    historytext: {
        fontFamily: FONTS.FONT_MEDIUM,
        fontSize: 18,
    },
    historyblock: {
        justifyContent: 'center',
        marginTop: 20,
        padding: 20,
        backgroundColor: '#F8F8F9',
        borderRadius: 30,
        width: Dimensions.get('screen').width,
    },
    labelColumn: { flex: 1, borderRightWidth: 0 },
    valueColumn: { flex: 1, alignItems: 'center', borderLeftWidth: 0 },
    rows: { flexDirection: 'row', padding: 6, borderBottomColor: '#cdcdcd', borderBottomWidth: 1 },
    customerInfoText: { fontSize: 14 },
    inputLabel: { fontSize: 12 },
    inputText1: { padding: 5, borderBottomColor: '#cdcdcd', borderBottomWidth: 1, },
    rowstext: { fontSize: 14, color: '#7d7d7d' },

})

export default LoanVerification;