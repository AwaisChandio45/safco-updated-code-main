import React, { useEffect, useState, useRef } from 'react'
import { FlatList, Text, View, TextInput, Dimensions, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import { AppStatusBar, CustomProgressDialoge, HeaderwithoutDialoge, RepaymentScreen, Search, Tabsitems, TextView, } from '../components';
import { GlobalStyles, Colors } from '../theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from '../components';
import DetailReportPicker from '../components/DetailReportPicker';
import { Tab, TabView } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import RepaymentCustomdialoge from '../components/RepaymentCustomdialoge';
import { DeletRepaymentLogsRow, getRepaymentDataByCnic, getRepaymentDataByLoanId, getRepaymentDataForFP, getRepaymentLogs, getRepaymentLogsDataByCnic, getRepaymentLogsDataByDate, getRepaymentLogsDataByLoanId, getTotalRepaymentPaid, updateRepaymentAmount, updateSyncup } from '../sqlite/RepaymentDataBase';
import { getStateFromPath } from '@react-navigation/core';
import RepaymentLogsCustomdialoge from '../components/RepaymentLogsCustomdialoge';
import LottieView from 'lottie-react-native';
import { RepaymentSyncup } from '../apis_auth/apis';
const { FingerModule } = NativeModules;
import { NativeModules } from 'react-native';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../components/Toast';
import RepaymentLogsScreen from '../components/RepaymentLogsScreen';
import { Modalize } from 'react-native-modalize';
import { Card } from 'react-native-paper';
import { FONTS } from '../theme/Fonts';

const Repayment = () => {

    const [index, setIndex] = React.useState();
    const [repayment_cincNumber, setCnicNumber_repayment] = React.useState("");
    const [repayment_fingerPrint, setFingerprint_repayment] = React.useState(undefined);
    // ------------------------------------------
    const [manage_cincNumber, setCnicNumber_manage] = React.useState("");
    const [manage_fingerPrint, setFingerprint_manage] = React.useState();

    // ------------------------------------------
    const [delete_cincNumber, setCnicNumber_delete] = React.useState("");
    const [delete_fingerPrint, setFingerprint_delete] = React.useState();
    // ---------------------------------------------
    const [blurModal, setBlurModal] = React.useState(false)
    const [updateModal, setUpdateModal] = React.useState(false)

    // ---------------------------------------------
    const [searchData, setSearchData] = React.useState(null);
    const [searchDataforLogs, setSearchDataforLogs] = React.useState([]);

    // --------------------------------------------
    // IF TEXTFIELD == 0,MEANS CNIC OR IF TEXTFIELD ==1,MEANS LOAN ID
    const [textField, setTextField] = React.useState(0)
    // --------------------------------------------

    const [loading, setLoading] = React.useState(false);
    const [noData, setNoData] = React.useState(false);
    // ---------------------------------------------
    const [remainingBalance, setRemainingBalance] = useState(0)
    const [totalRepaymentPaid, setTotalRepaymentPaid] = useState(0);
    //--------------------------------------------------------
    // Type ----------> 1,means getting data from Repayments. 2,means getting data from RepaymentLogs both columns are different
    const [type, setType] = useState(1);
    //  ***********************************************************************
    const [isLoading, setIsLoading] = useState(false) //use for syncup
    // const [asyncFinger, setAsycFinger] = useState("");-- FOR TESTING PURPOSE
    const [toast, setToast] = React.useState({ value: "", type: "" });

    useEffect(() => {
        // GettingFinger();
    }, [])
    // -- FOR TESTING PURPOSE
    const GettingFinger = async () => {
        var get = await AsyncStorage.getItem("@userFinger");
        var pareser = JSON.parse(get);
        //console.log(pareser.imageTemp);
        if (pareser) {
            // setAsycFinger(pareser.imageTemp)
        }
    }
    // ****************************  SYNCUP START  **********************************
    const Syncup = () => {
        Alert.alert("Await!", "Do you really want to Syncup?", [{
            text: "Yes", onPress: () => {
                getRepaymentLogs(setNoData, setIsLoading)
                    .then((value) => {
                        //console.log("---->", value)
                        if (value) {
                            if (value.length > 0) {
                                RepaymentSyncup(value, setIsLoading)
                                    .then((message) => {
                                        value.map((item, index) => {
                                            updateSyncup(item.repaymentLog_id);
                                        })
                                        // Alert.alert("Done", "" + message)
                                        setToast({
                                            type: "success",
                                            message: '' + message,
                                        });
                                    })
                                    .catch((error) => {
                                        // Alert.alert("Error!", "" + error)
                                        setToast({
                                            type: "error",
                                            message: '' + error,
                                        });


                                    })

                            } else {
                                // Alert.alert("Stop!", "Data not found!")
                                setToast({
                                    type: "error",
                                    message: 'Sorry Data not found!',
                                });
                                setIsLoading(false)

                            }
                        } else {
                            // Alert.alert("Stop!", "Data not found!")
                            setToast({
                                type: "error",
                                message: 'Sorry Data not found!',
                            });
                            setIsLoading(false)

                        }

                    })
                    .catch((error) => {
                        setIsLoading(false)
                    })
            }
        }, { text: "No" }])

    }
    // ****************************  SYNCUP END  **********************************

    // ************************** FINGER PRINT MATCHER **************************
    const onMatch = async () => {
        if (repayment_fingerPrint == undefined) {
            // Alert.alert("Stop!", "Please capture fingerprint")
            setToast({
                type: "error",
                message: 'Please capture fingerprint',
            });
            return
        }
        try {
            const get = await FingerModule.permissionCheckMethod();
            setLoading(true)
            getRepaymentDataForFP().
                then((value) => {
                    if (value) {
                        //console.log("--->value", value)
                        if (value.length > 0) {
                            setLoading(true)
                            FingerPrintRecursion(value.length, value)
                        } else {
                            // Alert.alert("Stop!", "Sorry data not found!")
                            setToast({
                                type: "error",
                                message: 'Sorry data not found!',
                            });
                            setLoading(false)

                        }
                    } else {
                        // Alert.alert("Stop!", "Sorry data not found!")
                        setToast({
                            type: "error",
                            message: 'Sorry data not found!',
                        });
                        setLoading(false)

                    }

                })
        } catch (error) {
            setLoading(false)

        }



    };
    const FingerPrintRecursion = async (index, array) => {
        try {
            if (array[index - 1].FPImageTemp != "") {
                // repayment_fingerPrint.imageTemp
                const eventId = await FingerModule.matchPrintTwo(repayment_fingerPrint.imageTemp, array[index - 1].FPImageTemp);
                if (eventId == 1) {
                    getRepaymentDataByLoanId(setNoData, setLoading, array[index - 1].LoanId).then((values) => {
                        if (values) {
                            if (values.length > 0) {


                                getTotalRepaymentPaid(values[0].LoanId).then((value) => {
                                    //console.log("---->value", value)
                                    var make = Number(Number(values[0].dTotalLoanAmount) - Number(Number(values[0].Totalpaid) + Number(value)));
                                    //console.log("---->make", make)
                                    setLoading(false)
                                    setRemainingBalance(make)
                                    setSearchData(values[0]);
                                    setBlurModal(true);
                                    //console.log(values[0])
                                })

                            } else {
                                // Alert.alert('Wrong Loan Id', 'No data Found!')
                                setToast({
                                    type: "error",
                                    message: 'Sorry no any record found!',
                                });
                                setLoading(false)

                            }
                        } else {
                            // Alert.alert('Wrong Loan Id', 'No data Found!');
                            setToast({
                                type: "error",
                                message: 'Sorry no any record found!',
                            });
                            setLoading(false)

                        }

                    })
                    return
                }
                console.error(array[index - 1].FPImageTemp);
            } else {

            }


        } catch (e) {
            // setLoading(false)

            // console.error(e);
        }
        let nextNumber = index - 1;
        if (nextNumber > 0) {
            FingerPrintRecursion(nextNumber, array);
        } else {
            setLoading(false)
            // Alert.alert("Stop!","Sorry! No any record found!")
            setToast({
                type: "error",
                message: 'Sorry! No any record found!',
            });
            //console.log("--->THE END");
        }
    }
    // ************************** FINGER PRINT MATCHER **************************
    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const _onSubmit = (props) => {
        if (props.RepaymentAmount == "") {
            Alert.alert("Stop!", "Please enter mandatory fields")
            return
        } else {
            updateRepaymentAmount(props.repaymentLog_id, props.RepaymentAmount).then((value) => {
                Alert.alert("Success", "" + value)
                modalizeRef.current?.close();
            }).catch((error) => {
                Alert.alert("Stop!", "" + error)

            })
        }

    }
    const _Delete = (props) => {
        Alert.alert("Await!", "Do you really want to delete?", [{
            text: "Yes", onPress: () => {
                DeletRepaymentLogsRow(props.repaymentLog_id).then((value) => {
                    modalizeRef.current?.close();

                    Alert.alert("Success", "" + value)
                }).catch((error) => {

                    Alert.alert("Stop!", "" + error)
                })
            }
        }, {
            text: "No", onPress: () => {

            }
        }])
    }
    const renderItemforLogs = ({ item, index }) => {
        return (
            <Card style={styles.modalcardall}>

                <View style={{ padding: 10 }}>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View>
                            <TextView text={'Repayment Logs'} style={{ color: "#cdcdcd", alignSelf: 'center' }} />
                        </View>
                        <View style={{ borderColor: Colors.darkGreenColor, padding: 5, marginTop: 15 }}>
                            <View style={styles.rows}>
                                <View style={styles.labelColumn}>
                                    <TextView style={styles.rowstext} text={'Customer Name'} />
                                </View>
                                <View style={styles.valueColumn}>
                                    <TextView text={item.customerName} style={styles.customerInfoText} /></View>
                            </View>
                            <View style={styles.rows}>
                                <View style={styles.labelColumn}>
                                    <TextView style={styles.rowstext} text={'Loan Id'} />
                                </View>
                                <View style={styles.valueColumn}>
                                    <TextView text={item.loanId} style={styles.customerInfoText} />
                                </View>
                            </View>
                            <View style={styles.rows}>
                                <View style={styles.labelColumn}>
                                    <TextView style={styles.rowstext} text={'CNIC'} />
                                </View>
                                <View style={styles.valueColumn}>
                                    <TextView text={item.NICNumber} style={styles.customerInfoText} />
                                </View>
                            </View>
                            <View style={styles.rows}>
                                <View style={styles.labelColumn}>
                                    <TextView style={styles.rowstext} text={'Repayment Date'} />
                                </View>
                                <View style={styles.valueColumn}>
                                    <TextView text={item.RepaymentDateTime} style={styles.customerInfoText} />
                                </View>
                            </View>
                            <View style={styles.rows}>
                                <View style={styles.labelColumn}>
                                    <TextView style={styles.rowstext} text={'Penalty'} />
                                </View>
                                <View style={styles.valueColumn}>
                                    <TextView text={item.Penalty} style={styles.customerInfoText} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 6 }}>
                                <View style={styles.labelColumn}>
                                    <TextView style={styles.rowstext} text={'Processing Fees'} />
                                </View>
                                <View style={styles.valueColumn}>
                                    <TextView text={item.ProccessingFees} style={styles.customerInfoText} />
                                </View>
                            </View>
                            <View style={{ marginTop: 20, marginBottom: 10 }}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextView text={'Repayment Amount:'} style={[styles.inputLabel, { flex: 1 }]} />

                                        <TextView text={'*'} style={{ color: Colors.red, alignSelf: 'center', marginRight: 20 }} />

                                    </View>

                                    <TextInput
                                        keyboardType={'decimal-pad'}
                                        editable={item.IsSyncedUp == 0 ? true : false}
                                        value={item.RepaymentAmount}
                                        onChangeText={(value) => {
                                            let getetr = searchDataforLogs;
                                            getetr[index].RepaymentAmount = value;
                                            setSearchData({ ...getetr })
                                        }}
                                        style={styles.inputText1}>

                                    </TextInput>
                                </View>

                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            {item.IsSyncedUp == 0 ? <CustomButton
                                onPress={() => _onSubmit(item)}
                                text={"Update"}
                                style={{ padding: 10, borderRadius: 20, alignItems: 'center', width: '90%' }}
                                textStyle={{ fontSize: 17 }}
                            />
                                :
                                <Pressable
                                    onPress={_Delete}
                                    style={{ backgroundColor: Colors.red, padding: 10, borderRadius: 20, alignItems: 'center', width: '75%' }}

                                >
                                    <TextView
                                        text={"Delete"}
                                        type={'Login'}
                                        style={[{ color: "#fff", fontSize: 17 }]}
                                    >

                                    </TextView>
                                </Pressable>
                            }
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
                        text="Repayment"></TextView>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabsitems
                        text={"Repayment"}
                        active={type == 1 ? true : false}
                        onPress={() => { setType(1) }}

                    />


                    <Tabsitems
                        text={"Manage Repayment"}
                        active={type == 2 ? true : false}
                        onPress={() => { setType(2) }}

                    />


                    <Tabsitems
                        text={"Syncup Repayment"}
                        active={type == 3 ? true : false}
                        onPress={() => { setType(3) }}
                    />

                </View>


                <View style={{ flex: 1 }}>
                    {/* /////////////  REPAYMENTS ////////////////////// */}

                    {type == 1 && <RepaymentScreen
                        screenNo={1}
                        _onSeacrch={() => {
                            setType(1)
                            if (repayment_cincNumber == '') {
                                // Alert.alert('', 'Please insert CNIC Number or Loan Id!')
                                setToast({
                                    type: "error",
                                    message: 'Please insert CNIC Number or Loan Id!',
                                });
                            } else {
                                if (textField == 0) {
                                    setLoading(true)
                                    getRepaymentDataByCnic(setNoData, setLoading, repayment_cincNumber).then((values) => {
                                        if (values) {

                                            if (values.length > 0) {

                                                getTotalRepaymentPaid(values[0].LoanId).then((value) => {
                                                    //console.log("---->value", value)
                                                    setTotalRepaymentPaid(value)
                                                    var make = Number(Number(values[0].dTotalLoanAmount) - Number(Number(values[0].Totalpaid) + Number(value)));
                                                    //console.log("---->make", make)
                                                    setLoading(false)

                                                    setRemainingBalance(make)
                                                    setSearchData(values[0]);
                                                    setBlurModal(true);
                                                    //console.log(values[0])
                                                })



                                            } else {
                                                setLoading(false)

                                                // Alert.alert('Wrong CNIC', 'No data Found!')
                                                setToast({
                                                    type: "error",
                                                    message: 'Sorry No record Found!',
                                                });
                                            }
                                        } else {
                                            // Alert.alert('Wrong CNIC', 'No data Found!');
                                            setToast({
                                                type: "error",
                                                message: 'Sorry No record Found!',
                                            });
                                            setLoading(false)

                                        }

                                    })
                                } else {
                                    setLoading(true)
                                    getRepaymentDataByLoanId(setNoData, setLoading, repayment_cincNumber).then((values) => {
                                        if (values) {
                                            if (values.length > 0) {


                                                getTotalRepaymentPaid(values[0].LoanId).then((value) => {
                                                    //console.log("---->value", value)
                                                    var make = Number(Number(values[0].dTotalLoanAmount) - Number(Number(values[0].Totalpaid) + Number(value)));
                                                    //console.log("---->make", make)
                                                    setLoading(false)

                                                    setRemainingBalance(make)
                                                    setSearchData(values[0]);
                                                    setBlurModal(true);
                                                    //console.log(values[0])
                                                })

                                            } else {
                                                setLoading(false)

                                                // Alert.alert('Wrong Loan Id', 'No data Found!')
                                                setToast({
                                                    type: "error",
                                                    message: 'Sorry No record Found!',
                                                });
                                            }
                                        } else {
                                            setLoading(false)

                                            // Alert.alert('Wrong Loan Id', 'No data Found!');
                                            setToast({
                                                type: "error",
                                                message: 'Sorry No record Found!',
                                            });
                                        }

                                    })

                                }
                            }
                        }}
                        _onSubmit={onMatch}
                        cincNumber={repayment_cincNumber}
                        setCnicNumber={setCnicNumber_repayment}
                        fingerPrint={repayment_fingerPrint}
                        setFingerImage={setFingerprint_repayment}
                        textField={textField}
                        setTextField={setTextField}
                        toast={toast}
                        setToast={setToast}
                    />}

                    {/* ///////////// MANAGE REPAYMENTS ////////////////////// */}
                    {type == 2 && <RepaymentLogsScreen
                        screenNo={2}
                        _onSeacrch={() => {
                            setType(2)
                            if (manage_cincNumber == '') {
                                // Alert.alert('', 'Please insert CNIC Number or Loan Id!')
                                setToast({
                                    type: "error",
                                    message: 'Please insert CNIC Number or Loan Id!',
                                });
                            } else {
                                setLoading(true)
                                if (textField == 0) {
                                    getRepaymentLogsDataByCnic(setNoData, setLoading, manage_cincNumber).then((values) => {
                                        if (values) {

                                            if (values.length > 0) {
                                                setLoading(false)

                                                setSearchData(values[0]);
                                                setUpdateModal(true);



                                            } else {
                                                setLoading(false)

                                                // Alert.alert('Wrong CNIC', 'No data Found!')
                                                setToast({
                                                    type: "error",
                                                    message: 'Sorry No record Found!',
                                                });
                                            }
                                        } else {
                                            setLoading(false)
                                            // Alert.alert('Wrong CNIC', 'No data Found!');
                                            setToast({
                                                type: "error",
                                                message: 'Sorry No record Found!',
                                            });
                                        }

                                    })
                                } else if (textField == 1) {
                                    getRepaymentLogsDataByLoanId(setNoData, setLoading, manage_cincNumber).then((values) => {
                                        if (values) {
                                            if (values.length > 0) {
                                                setLoading(false)

                                                setSearchData(values[0]);
                                                setUpdateModal(true);

                                            } else {
                                                setLoading(false)

                                                // Alert.alert('Wrong Loan Id', 'No data Found!')
                                                setToast({
                                                    type: "error",
                                                    message: 'Sorry No record Found!',
                                                });
                                            }
                                        } else {
                                            setLoading(false)
                                            // Alert.alert('Wrong Loan Id', 'No data Found!');
                                            setToast({
                                                type: "error",
                                                message: 'Sorry No record Found!',
                                            });
                                        }

                                    })

                                } else {
                                    getRepaymentLogsDataByDate(setNoData, setLoading, manage_cincNumber)
                                        .then((values) => {
                                            if (values) {
                                                if (values.length > 0) {
                                                    setLoading(false)

                                                    setSearchDataforLogs(values);
                                                    onOpen()
                                                    // setUpdateModal(true);

                                                } else {
                                                    setLoading(false)
                                                }
                                            } else {
                                                setLoading(false)
                                                // Alert.alert('Wrong Loan Id', 'No data Found!');
                                                setToast({
                                                    type: "error",
                                                    message: 'Sorry No record Found!',
                                                });
                                            }
                                        }).catch((error) => {
                                            setLoading(false)
                                            console.log(error)
                                            setToast({
                                                type: "error",
                                                message: '' + error,
                                            });
                                        })
                                }
                            }
                        }}
                        _onSubmit={() => {

                        }}
                        cincNumber={manage_cincNumber}
                        setCnicNumber={setCnicNumber_manage}
                        fingerPrint={manage_fingerPrint}
                        setFingerImage={setFingerprint_manage}
                        textField={textField}
                        setTextField={setTextField}
                        toast={toast}
                        setToast={setToast}
                    />}


                    {/* ///////////// SYNCUP REPAYMENTS ////////////////////// */}

                    {type == 3 && <View style={{ justifyContent: 'center', flex: 1 }}>
                        <LottieView
                            source={isLoading ? require('../assests/anim/spinnerallcolor.json') : require('../assests/anim/repaymentSyncup.json')}

                            style={{ alignSelf: 'center', height: 200, width: 200, margin: 20 }}
                            autoPlay
                            loop
                        />
                        <CustomButton
                            onPress={Syncup}
                            text={"Sync up"}
                            style={{ alignSelf: 'center', padding: 10, borderRadius: 20, alignItems: 'center', width: '90%' }}
                            textStyle={{ fontSize: 17 }}
                        ></CustomButton>
                    </View>}
                </View>

                <RepaymentCustomdialoge
                    type={type}
                    props={searchData}
                    filterModal={blurModal}
                    setfilterModal={setBlurModal}
                    remainingBalance={remainingBalance}
                    totalRepaymentPaid={totalRepaymentPaid}
                ></RepaymentCustomdialoge>
                <RepaymentLogsCustomdialoge
                    props={searchDataforLogs}
                    filterModal={updateModal}
                    setfilterModal={setUpdateModal}
                    remainingBalance={remainingBalance}
                    totalRepaymentPaid={totalRepaymentPaid}
                ></RepaymentLogsCustomdialoge>
                <CustomProgressDialoge
                    messageshow={false}
                    dialogVisible={loading}
                    setDialogVisible={setLoading}
                    title={"Searching data please wait.."}
                />

            </View>
            <Modalize ref={modalizeRef}
                
                onOpen={() => {
                    setType(4)

                }}
                onClose={() => {
                    setType(2)
                }}
            >

                <View style={{ flex: 1, padding: 10, alignItems: 'center' }}>

                    <FlatList

                        data={searchDataforLogs}

                        renderItem={renderItemforLogs}

                        keyExtractor={item => item.id}

                    />

                </View>

            </Modalize>
            {type == 3 && <Toast  {...toast} onDismiss={() => setToast({ message: "", type: "" })} />}

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

export default Repayment;