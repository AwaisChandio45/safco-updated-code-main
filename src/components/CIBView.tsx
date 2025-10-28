import React, { useEffect, useRef } from 'react';

import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TextView from './TextView';

const NameAndTitle = ({ style, title, value }) => {
    return (
        <View style={[styles.row, style]}>
            <TextView style={styles.text2} text={title}></TextView>
            <TextView style={styles.text3} text={value}></TextView>
        </View>
    )
}
const CIBView = ({ reportDetail }) => {

    const [customerReport, setCustomerReport] = React.useState(reportDetail?.CreditReport);

    //console.log("cib report data ========>>>>>>",customerReport);
    // const cnicValue_two = customerReport?.CREDIT_SUMMARY[2]?.CNIC;
    // const isCNICAvailable_two = cnicValue_two !== undefined && cnicValue_two !== null;

    // const cnicValue = customerReport?.CREDIT_SUMMARY[3]?.CNIC;
    // const isCNICAvailable = cnicValue !== undefined && cnicValue !== null;

    // const cnicValue_four = customerReport?.CREDIT_SUMMARY[4]?.CNIC;
    // const isCNICAvailable_four = cnicValue_four !== undefined && cnicValue_four !== null;


     //const customerReport = ;
     const latest_address=Array.isArray(customerReport?.HOME_INFORMATION)?customerReport?.HOME_INFORMATION[0]:customerReport?.HOME_INFORMATION;
     const previous_address=Array.isArray(customerReport?.HOME_INFORMATION)?customerReport?.HOME_INFORMATION[1]:customerReport?.HOME_INFORMATION;
     const defualtHistory = Array.isArray(customerReport?.DEFAULTS)?customerReport?.DEFAULTS:[customerReport?.DEFAULTS];
     const ccpMasterData = Array.isArray(customerReport?.CCP_MASTER)?customerReport?.CCP_MASTER:[customerReport?.CCP_MASTER];
     const ccpSummaryData = Array.isArray(customerReport?.CCP_SUMMARY)?customerReport?.CCP_SUMMARY:[customerReport?.CCP_SUMMARY];
     const ccpDetailData = Array.isArray(customerReport?.CCP_DETAIL)?customerReport?.CCP_DETAIL:[customerReport?.CCP_DETAIL];
     const ccpCalender = [5,6,7,8,9,10,11,12,'1/2022',2,3,4];
    
    return <View style={styles.main}>
        <View style={styles.row}>

            <TextView style={[styles.text1, { flex: 1 }]} text={"CONFIDENTIAL"}></TextView>
            <View>
                <Image style={styles.image} source={require('../assests/images/datacheck.png')}></Image>
            </View>
        </View>
        <View style={styles.row}>
            <TextView style={[styles.text1, { flex: 1 }]} text={"Individual Credit Report"}></TextView>
            <TextView style={[styles.text1, { flex: 2, textAlign: 'center' }]} text={"Strong Match"}></TextView>
            <TextView style={[styles.text1, { flex: 1 }]} text={"DataCheck \n MicroFinance Bureau"}></TextView>

        </View>
        <View style={styles.line}></View>
        <View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"File#:"} value={customerReport?.INDIVIDUAL_DETAIL?.FILE_NO}></NameAndTitle>

                <NameAndTitle title={"Creation Date:"} value={customerReport?.INDIVIDUAL_DETAIL?.CREATION_DATE}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Name:"} value={`${customerReport?.INDIVIDUAL_DETAIL?.FIRST_NAME} ${customerReport?.INDIVIDUAL_DETAIL?.LAST_NAME}`}></NameAndTitle>

                <NameAndTitle title={"CNIC#:"} value={customerReport?.INDIVIDUAL_DETAIL?.CNIC}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Tranx#:"} value={customerReport?.INDIVIDUAL_DETAIL?.TRANX_NO}></NameAndTitle>

                <NameAndTitle title={"Tranx Date:"} value={customerReport?.INDIVIDUAL_DETAIL?.TRANX_DATE}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"NIC#:"} value={customerReport?.INDIVIDUAL_DETAIL?.NIC}></NameAndTitle>

                <NameAndTitle title={"Gender"} value={customerReport?.INDIVIDUAL_DETAIL?.GENDER}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Maker:"} value={customerReport?.INDIVIDUAL_DETAIL?.MAKER}></NameAndTitle>

                <NameAndTitle style={{ flex: 1 }} title={"Checker:"} value={customerReport?.INDIVIDUAL_DETAIL?.CHECKER}></NameAndTitle>

                <NameAndTitle style={{ flex: 1 }} title={"DOB:"} value={customerReport?.INDIVIDUAL_DETAIL?.DOB}></NameAndTitle>


            </View>

        </View>
        <View style={styles.line}></View>
        <View style={[styles.row2]}>
            <NameAndTitle style={{ flex: 1 }} title={"RELATIONS:"} value={""}></NameAndTitle>

            <NameAndTitle style={{}} title={"Father/Husband:"} value={customerReport?.INDIVIDUAL_DETAIL?.FATHER_HUSBAND_FNAME}></NameAndTitle>

        </View>
        <View style={[styles.row2]}>
            <NameAndTitle style={{ flex: 1 }} title={"Mother:"} value={""}></NameAndTitle>

            <NameAndTitle style={{}} title={""} value={""}></NameAndTitle>
        </View>
        <View style={styles.line}></View>
        {/* /////////////// LATEST ADDRESS BOX/////////////// STRATS*/}
        <View style={styles.box}>


            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LATEST ADDRESS INFORMATION"} value={""}></NameAndTitle>

                <NameAndTitle style={{}} title={"Reported On:"} value={latest_address?.REPORTED_ON}></NameAndTitle>



            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ width: Dimensions.get("screen").width / 1.4 }} title={"Residential Address:"} value={latest_address?.ADDRESS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Village:"} value={latest_address?.CITY}></NameAndTitle>

                <NameAndTitle title={"Chak:"} value={""}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Tehsil/Town:"} value={""}></NameAndTitle>

                <NameAndTitle title={"U.C:"} value={""}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Electricity Consumer #:"} value={""}></NameAndTitle>

                <NameAndTitle title={"Phone #:"} value={latest_address?.PHONE1}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Gas Consumer #:"} value={""}></NameAndTitle>

                <NameAndTitle title={"Cell #:"} value={latest_address?.PHONE2}></NameAndTitle>

            </View>
            {/* /////////////// LATEST ADDRESS /////////////// ENDS*/}

            <View style={styles.line}></View>
            {/* /////////////// PERVIOUS ADDRESS /////////////// STARTS*/}
            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"PREVIOUS ADDRESS INFORMATION"} value={""}></NameAndTitle>

                <NameAndTitle style={{}} title={"Reported On:"} value={previous_address?.REPORTED_ON}></NameAndTitle>



            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ width: Dimensions.get("screen").width / 1.4 }} title={"Residential Address:"} value={previous_address?.ADDRESS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Village:"} value={previous_address?.CITY}></NameAndTitle>

                <NameAndTitle title={"Chak:"} value={""}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Tehsil/Town:"} value={""}></NameAndTitle>

                <NameAndTitle title={"U.C:"} value={""}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Electricity Consumer #:"} value={""}></NameAndTitle>

                <NameAndTitle title={"Phone #:"} value={previous_address?.PHONE1}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"Gas Consumer #:"} value={""}></NameAndTitle>

                <NameAndTitle title={"Cell #:"} value={previous_address?.PHONE2}></NameAndTitle>

            </View>
            {/* /////////////// PERVIOUS ADDRESS /////////////// ENDS*/}
        </View>
        {/* /////////////// LATEST ADDRESS BOX/////////////// ENDS */}


{/* /////////////// EMPLOYER INFORMATION BOX/////////////// STRATS*/}
<View style={styles.box}>


<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"LATEST EMPLOYER INFORMATION"} value={""}></NameAndTitle>

    <NameAndTitle style={{}} title={"Reported On:"} value={customerReport?.EMPLOYER_INFORMATION?.REPORTED_ON}></NameAndTitle>



</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ width: Dimensions.get("screen").width / 1.4 }} title={"Address:"} value={customerReport?.EMPLOYER_INFORMATION?.ADDRESS}></NameAndTitle>
</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Ownership Status:"} value={""}></NameAndTitle>

    <NameAndTitle title={"Business Category:"} value={""}></NameAndTitle>

</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Village:"} value={""}></NameAndTitle>

    <NameAndTitle title={"Chak:"} value={""}></NameAndTitle>

</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Tehsil/Town:"} value={""}></NameAndTitle>

    <NameAndTitle title={"U.C:"} value={""}></NameAndTitle>

</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Phone #:"} value={customerReport?.EMPLOYER_INFORMATION?.PHONE1}></NameAndTitle>

    <NameAndTitle title={"Cell #:"} value={customerReport?.EMPLOYER_INFORMATION?.PHONE2}></NameAndTitle>

</View>
{/* /////////////// LATEST  EMPLOYER INFORMATION /////////////// ENDS*/}

<View style={styles.line}></View>
{/* /////////////// PREVIOUS EMPLOYER INFORMATION  /////////////// STARTS*/}
<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"PREVIOUS EMPLOYER INFORMATION"} value={""}></NameAndTitle>

    <NameAndTitle style={{}} title={"Reported On:"} value={""}></NameAndTitle>



</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ width: Dimensions.get("screen").width / 1.4 }} title={"Address:"} value={""}></NameAndTitle>
</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Ownership Status:"} value={""}></NameAndTitle>

    <NameAndTitle title={"Business Category:"} value={""}></NameAndTitle>

</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Village:"} value={""}></NameAndTitle>

    <NameAndTitle title={"Chak:"} value={""}></NameAndTitle>

</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Tehsil/Town:"} value={""}></NameAndTitle>

    <NameAndTitle title={"U.C:"} value={""}></NameAndTitle>

</View>

<View style={[styles.row2]}>
    <NameAndTitle style={{ flex: 1 }} title={"Phone #:"} value={""}></NameAndTitle>

    <NameAndTitle title={"Cell #:"} value={""}></NameAndTitle>

</View>
{/* ///////////////  PREVIOUS EMPLOYER INFORMATION /////////////// ENDS*/}
</View>
{/* /////////////// EMPLOYER INFORMATION BOX/////////////// ENDS */}


{/* my code */}
{/* /////////////// KINS INFORMATION BOX/////////////// STRATS*/}
<TextView style={styles.text2} text={"KINS INFORMATION"}></TextView>
<View style={styles.box}>
<TextView style={[styles.text2, styles.centerAlign]} text={"First KIN INFORMATION"}></TextView>


{customerReport?.CREDIT_SUMMARY?.[1] && (
    <>
           <View style={[styles.row2]}>
            
                <NameAndTitle style={{ flex: 1 }} title={"ASSOCIATION:"} value={customerReport?.CREDIT_SUMMARY[1]?.ASSOCIATION}></NameAndTitle>

                <NameAndTitle title={"CATEGORY:"} value={customerReport?.CREDIT_SUMMARY[1]?.CATEGORY}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CLOSE_AFTER_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[1]?.CLOSE_AFTER_MATURITY}></NameAndTitle>

                <NameAndTitle title={"CLOSE_WITHIN_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[1]?.CLOSE_WITHIN_MATURITY}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CNIC:"} value={customerReport?.CREDIT_SUMMARY[1]?.CNIC}></NameAndTitle>

                <NameAndTitle title={"CURRENT_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[1]?.CURRENT_30PLUS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"DEFAULT_COUNT:"} value={customerReport?.CREDIT_SUMMARY[1]?.DEFAULT_COUNT}></NameAndTitle>

                <NameAndTitle title={"DEFAULT_OS:"} value={customerReport?.CREDIT_SUMMARY[1]?.DEFAULT_OS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ENQUIRY_COUNT:"} value={customerReport?.CREDIT_SUMMARY[1]?.ENQUIRY_COUNT}></NameAndTitle>

                <NameAndTitle title={"FILE_CREATION_DT:"} value={customerReport?.CREDIT_SUMMARY[1]?.FILE_CREATION_DT}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"FILE_NO:"} value={customerReport?.CREDIT_SUMMARY[1]?.FILE_NO}></NameAndTitle>

                <NameAndTitle title={"LOAN_ABOVE_10K:"} value={customerReport?.CREDIT_SUMMARY[1]?.LOAN_ABOVE_10K}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_COUNT:"} value={customerReport?.CREDIT_SUMMARY[1]?.LOAN_COUNT}></NameAndTitle>

                <NameAndTitle title={"LOAN_LESS_10K:"} value={customerReport?.CREDIT_SUMMARY[1]?.LOAN_LESS_10K}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_LIMIT:"} value={customerReport?.CREDIT_SUMMARY[1]?.LOAN_LIMIT}></NameAndTitle>

                <NameAndTitle title={"LOAN_OS:"} value={customerReport?.CREDIT_SUMMARY[1]?.LOAN_OS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[1]?.MONTH24_30PLUS}></NameAndTitle>

                <NameAndTitle title={"MONTH24_60PLUS:"} value={customerReport?.CREDIT_SUMMARY[1]?.MONTH24_60PLUS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_90PLUS:"} value={customerReport?.CREDIT_SUMMARY[1]?.MONTH24_90PLUS}></NameAndTitle>

                <NameAndTitle title={"NAME:"} value={customerReport?.CREDIT_SUMMARY[1]?.NAME}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>

                <NameAndTitle title={"TRNX_NO:"} value={customerReport?.CREDIT_SUMMARY[1]?.TRNX_NO}></NameAndTitle>

            </View>

            </>
)}

 {/* /////////////// Second Kin INFORMATION /////////////// ENDS*/}
 {/* {isCNICAvailable_two && ( */}
 {customerReport?.CREDIT_SUMMARY?.[2] && (
    <>
     
   <View style={styles.line}></View>
   <TextView style={[styles.text2, styles.centerAlign]} text={"SECOND KIN INFORMATION"}></TextView>

          <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ASSOCIATION:"} value={customerReport?.CREDIT_SUMMARY[2]?.ASSOCIATION}></NameAndTitle>
                <NameAndTitle title={"CATEGORY:"} value={customerReport?.CREDIT_SUMMARY[2]?.CATEGORY}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CLOSE_AFTER_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[2]?.CLOSE_AFTER_MATURITY}></NameAndTitle>
                <NameAndTitle title={"CLOSE_WITHIN_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[2]?.CLOSE_WITHIN_MATURITY}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CNIC:"} value={customerReport?.CREDIT_SUMMARY[2]?.CNIC}></NameAndTitle>
                <NameAndTitle title={"CURRENT_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[2]?.CURRENT_30PLUS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"DEFAULT_COUNT:"} value={customerReport?.CREDIT_SUMMARY[2]?.DEFAULT_COUNT}></NameAndTitle>
                <NameAndTitle title={"DEFAULT_OS:"} value={customerReport?.CREDIT_SUMMARY[2]?.DEFAULT_OS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ENQUIRY_COUNT:"} value={customerReport?.CREDIT_SUMMARY[2]?.ENQUIRY_COUNT}></NameAndTitle>
                <NameAndTitle title={"FILE_CREATION_DT:"} value={customerReport?.CREDIT_SUMMARY[2]?.FILE_CREATION_DT}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"FILE_NO:"} value={customerReport?.CREDIT_SUMMARY[2]?.FILE_NO}></NameAndTitle>
                <NameAndTitle title={"LOAN_ABOVE_10K:"} value={customerReport?.CREDIT_SUMMARY[2]?.LOAN_ABOVE_10K}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_COUNT:"} value={customerReport?.CREDIT_SUMMARY[2]?.LOAN_COUNT}></NameAndTitle>
                <NameAndTitle title={"LOAN_LESS_10K:"} value={customerReport?.CREDIT_SUMMARY[2]?.LOAN_LESS_10K}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_LIMIT:"} value={customerReport?.CREDIT_SUMMARY[2]?.LOAN_LIMIT}></NameAndTitle>
                <NameAndTitle title={"LOAN_OS:"} value={customerReport?.CREDIT_SUMMARY[2]?.LOAN_OS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[2]?.MONTH24_30PLUS}></NameAndTitle>
                <NameAndTitle title={"MONTH24_60PLUS:"} value={customerReport?.CREDIT_SUMMARY[2]?.MONTH24_60PLUS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_90PLUS:"} value={customerReport?.CREDIT_SUMMARY[2]?.MONTH24_90PLUS}></NameAndTitle>
                <NameAndTitle title={"NAME:"} value={customerReport?.CREDIT_SUMMARY[2]?.NAME}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle title={"TRNX_NO:"} value={customerReport?.CREDIT_SUMMARY[2]?.TRNX_NO}></NameAndTitle>
            </View>

            </>
)}
      {/* )} */}
 
 {/* /////////////// Third Kin INFORMATION /////////////// ENDS*/}

 {/* {isCNICAvailable && ( */}

 {customerReport?.CREDIT_SUMMARY?.[3] && (
    <>
      <View style={styles.line}></View>
       {/* /////////////// Third Kin INFORMATION /////////////// STARTS*/}
       <TextView style={[styles.text2, styles.centerAlign]} text={"THIRD KIN INFORMATION"}></TextView>
       <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ASSOCIATION:"} value={customerReport?.CREDIT_SUMMARY[3]?.ASSOCIATION || ''}></NameAndTitle>
                <NameAndTitle title={"CATEGORY:"} value={customerReport?.CREDIT_SUMMARY[3]?.CATEGORY}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CLOSE_AFTER_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[3]?.CLOSE_AFTER_MATURITY}></NameAndTitle>
                <NameAndTitle title={"CLOSE_WITHIN_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[3]?.CLOSE_WITHIN_MATURITY}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CNIC:"} value={customerReport?.CREDIT_SUMMARY[3]?.CNIC}></NameAndTitle>

                <NameAndTitle title={"CURRENT_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[3]?.CURRENT_30PLUS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"DEFAULT_COUNT:"} value={customerReport?.CREDIT_SUMMARY[3]?.DEFAULT_COUNT}></NameAndTitle>

                <NameAndTitle title={"DEFAULT_OS:"} value={customerReport?.CREDIT_SUMMARY[3]?.DEFAULT_OS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ENQUIRY_COUNT:"} value={customerReport?.CREDIT_SUMMARY[3]?.ENQUIRY_COUNT}></NameAndTitle>

                <NameAndTitle title={"FILE_CREATION_DT:"} value={customerReport?.CREDIT_SUMMARY[3]?.FILE_CREATION_DT}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"FILE_NO:"} value={customerReport?.CREDIT_SUMMARY[3]?.FILE_NO}></NameAndTitle>

                <NameAndTitle title={"LOAN_ABOVE_10K:"} value={customerReport?.CREDIT_SUMMARY[3]?.LOAN_ABOVE_10K}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_COUNT:"} value={customerReport?.CREDIT_SUMMARY[3]?.LOAN_COUNT}></NameAndTitle>

                <NameAndTitle title={"LOAN_LESS_10K:"} value={customerReport?.CREDIT_SUMMARY[3]?.LOAN_LESS_10K}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_LIMIT:"} value={customerReport?.CREDIT_SUMMARY[3]?.LOAN_LIMIT}></NameAndTitle>

                <NameAndTitle title={"LOAN_OS:"} value={customerReport?.CREDIT_SUMMARY[3]?.LOAN_OS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[3]?.MONTH24_30PLUS}></NameAndTitle>

                <NameAndTitle title={"MONTH24_60PLUS:"} value={customerReport?.CREDIT_SUMMARY[3]?.MONTH24_60PLUS}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_90PLUS:"} value={customerReport?.CREDIT_SUMMARY[3]?.MONTH24_90PLUS}></NameAndTitle>

                <NameAndTitle title={"NAME:"} value={customerReport?.CREDIT_SUMMARY[3]?.NAME}></NameAndTitle>
            </View>

            <View style={[styles.row2]}>

                <NameAndTitle title={"TRNX_NO:"} value={customerReport?.CREDIT_SUMMARY[3]?.TRNX_NO}></NameAndTitle>
            </View>

            </>
 )}

            {/* /////////////// Four Kin INFORMATION /////////////// STARTS*/}
            {customerReport?.CREDIT_SUMMARY?.[4] && (
        <>
            <View style={styles.line}></View>

            <TextView style={[styles.text2, styles.centerAlign]} text={"FOUR KIN INFORMATION"}></TextView>
            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ASSOCIATION:"} value={customerReport?.CREDIT_SUMMARY[4]?.ASSOCIATION}></NameAndTitle>

                <NameAndTitle title={"CATEGORY:"} value={customerReport?.CREDIT_SUMMARY[4]?.CATEGORY}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CLOSE_AFTER_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[4]?.CLOSE_AFTER_MATURITY}></NameAndTitle>

                <NameAndTitle title={"CLOSE_WITHIN_MATURITY:"} value={customerReport?.CREDIT_SUMMARY[4]?.CLOSE_WITHIN_MATURITY}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"CNIC:"} value={customerReport?.CREDIT_SUMMARY[4]?.CNIC}></NameAndTitle>

                <NameAndTitle title={"CURRENT_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[4]?.CURRENT_30PLUS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"DEFAULT_COUNT:"} value={customerReport?.CREDIT_SUMMARY[4]?.DEFAULT_COUNT}></NameAndTitle>

                <NameAndTitle title={"DEFAULT_OS:"} value={customerReport?.CREDIT_SUMMARY[4]?.DEFAULT_OS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"ENQUIRY_COUNT:"} value={customerReport?.CREDIT_SUMMARY[4]?.ENQUIRY_COUNT}></NameAndTitle>

                <NameAndTitle title={"FILE_CREATION_DT:"} value={customerReport?.CREDIT_SUMMARY[4]?.FILE_CREATION_DT}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"FILE_NO:"} value={customerReport?.CREDIT_SUMMARY[4]?.FILE_NO}></NameAndTitle>

                <NameAndTitle title={"LOAN_ABOVE_10K:"} value={customerReport?.CREDIT_SUMMARY[4]?.LOAN_ABOVE_10K}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_COUNT:"} value={customerReport?.CREDIT_SUMMARY[4]?.LOAN_COUNT}></NameAndTitle>

                <NameAndTitle title={"LOAN_LESS_10K:"} value={customerReport?.CREDIT_SUMMARY[4]?.LOAN_LESS_10K}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"LOAN_LIMIT:"} value={customerReport?.CREDIT_SUMMARY[4]?.LOAN_LIMIT}></NameAndTitle>

                <NameAndTitle title={"LOAN_OS:"} value={customerReport?.CREDIT_SUMMARY[4]?.LOAN_OS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_30PLUS:"} value={customerReport?.CREDIT_SUMMARY[4]?.MONTH24_30PLUS}></NameAndTitle>

                <NameAndTitle title={"MONTH24_60PLUS:"} value={customerReport?.CREDIT_SUMMARY[4]?.MONTH24_60PLUS}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>
                <NameAndTitle style={{ flex: 1 }} title={"MONTH24_90PLUS:"} value={customerReport?.CREDIT_SUMMARY[4]?.MONTH24_90PLUS}></NameAndTitle>

                <NameAndTitle title={"NAME:"} value={customerReport?.CREDIT_SUMMARY[4]?.NAME}></NameAndTitle>

            </View>

            <View style={[styles.row2]}>

                <NameAndTitle title={"TRNX_NO:"} value={customerReport?.CREDIT_SUMMARY[4]?.TRNX_NO}></NameAndTitle>

            </View>
            </>
            )}
      {/* )} */}
{/* ///////////////   /////////////// ENDS*/}
</View>
{/* /////////////// KINS INFORMATION BOX/////////////// ENDS */}

<TextView style={styles.text2} text={"Credit Score:"}></TextView>
<View style={[styles.box,{height:40}]}></View>


<TextView style={styles.text2} text={"Default History:"}></TextView>
<View style={styles.box}>
<ScrollView 
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        >
<View>
<View style={[styles.row,{padding:10}]}>
            <TextView text={"Member"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"Branch"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"Date"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"Account#"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"Amount"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"TY"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"ST"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"RR"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"AC"} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={"Group Id"} style={[styles.text2]}></TextView>



        </View>


{defualtHistory[0]?.FILE_NO != "" && defualtHistory.map((deftHistoryItem,defHistoryIndex)=>{

return        <View>


        <View style={[styles.row,{padding:10}]}>

            <TextView text={"**"+deftHistoryItem?.MEM_NAME} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.SUBBRN_NAME} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ORG_STATUS_DATE} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ORG_ACCT_NO} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ORG_AMOUNT} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ORG_ACCT_TY} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ORG_STATUS} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ORG_RTR} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.ASSOC_TY} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.GROUP_ID} style={[styles.text2]}></TextView>

        </View>

        <View style={[styles.row,{padding:10}]}>

            <TextView text={"*"+deftHistoryItem?.MEM_NAME} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.SUBBRN_NAME} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.UPD_STATUS_DATE} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.UPD_ACCT_NO} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.UPD_AMOUNT} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.UPD_ACCT_TY} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.UPD_STATUS} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={deftHistoryItem?.UPD_RTR} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={''} style={[styles.text2,styles.textWith]}></TextView>
            <TextView text={''} style={[styles.text2]}></TextView>

        </View>

        </View>

        

})
}
</View>
</ScrollView>
</View>


<TextView style={styles.text2} text={"File Notes:"}></TextView>
<View style={styles.box}>
<ScrollView 
    showsHorizontalScrollIndicator={false}
    horizontal={true}
    >
    <View style={[styles.row,{padding:10}]}>
        <TextView text={"Ref. Date"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Account#"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Comments"} style={[styles.text2,{flex:1}]}></TextView>
    </View>
    </ScrollView>
</View>


<TextView style={styles.text2} text={"CCP:"}></TextView>

    
   {  ccpMasterData?.map((item, index)=>{
        
        return(
                
                <View style={styles.box}>
                    <ScrollView 
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    >
                        <View>
                        
                            <View style={[styles.row,{padding:10}]}>

                                <TextView text={"Member, Branch"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Account#"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Term,TY, ST"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Amount Disbursed"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Open Date"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Maturity Date"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"AC"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Status Date"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"LastPayment"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Overdue Amount"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Outstanding Balance"} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={"Payment Status"} style={[styles.text2]}></TextView>


                            </View>

                            {item?.FILE_NO != "" &&
                            <View>                    
                            <View style={[styles.row,{padding:10}]}>
                            
                                <TextView text={item?.MEM_NAME} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.ACCT_NO} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={`${item?.TERM} ${item?.ACCT_TY} ${item?.ACCT_STATUS}`} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.LIMIT} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.OPEN_DATE} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.MATURITY_DATE} style={[styles.text2,styles.textWith]}></TextView>
                                {/* <TextView text={item['CO-BORROWER']} style={[styles.text2,styles.textWith]}></TextView> */}
                                <TextView text={item?.STATUS_DATE} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.LAST_PAYMENT} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.OVERDUEAMOUNT} style={[styles.text2,styles.textWith]}></TextView>
                                <TextView text={item?.BALANCE} style={[styles.text2]}></TextView>
                                <TextView text={item?.PAYMENT_STATUS} style={[styles.text2]}></TextView>

                            </View>
                            
                            
                                <View style={[styles.row,{padding:10}]}>
                                {
                                    ccpCalender.map((calenderItem, calenderIndex)=>{

                                            return <TextView text={calenderItem} style={[styles.text2, styles.textWith]}></TextView>

                                    })
                                }

                                </View>

                            <View style={[styles.row,{padding:10}]}>
                            {
                                ccpDetailData.map((detailItem, detailIndex)=>{
                                    
                                    if(item?.SEQ_NO == detailItem?.SEQ_NO){
                                        
                                        return <TextView text={detailItem?.PAYMENT_STATUS} style={[styles.text2, styles.textWith]}></TextView>
                                        
                                    }
                                    
                                })
                            }

                            </View>
                                </View>
    
                                }

                        </View>
                    </ScrollView>
                </View>

        )
    })
}
  


<TextView style={styles.text2} text={"Delinquency Summary (12 Months):"}></TextView>
<View style={styles.box}>
<ScrollView 
    showsHorizontalScrollIndicator={false}
    horizontal={true}
    >
        <View>
    <View style={[styles.row,{padding:10}]}>
        <TextView text={"Member, Branch"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"A/C Type"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"Amount Disbursed"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"A/C Status"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"OK"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"X"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"30+"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"60+"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"90+"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"120+"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"150+"} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={"180+"} style={[styles.text2]}></TextView>

    </View>
    
   { ccpMasterData?.map((detailItem, detailIndex)=>{
           
        return <View style={[styles.row,{padding:10}]}>
                 
                  <TextView text={detailItem?.MEM_NAME} style={[styles.text2,styles.textWith]}></TextView>
                  <TextView text={detailItem?.ACCT_TY} style={[styles.text2,styles.textWith]}></TextView>
                  <TextView text={detailItem?.LIMIT} style={[styles.text2,styles.textWith]}></TextView>
                  <TextView text={detailItem?.ACCT_STATUS} style={[styles.text2,styles.textWith]}></TextView>
                  {ccpSummaryData?.map((summaryItem, summaryIndex)=>{
                     
                     if(detailItem?.SEQ_NO == summaryItem?.SEQ_NO){
                     return <>
                          <TextView text={summaryItem?.OK} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.X} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.P30} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.P60} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.P90} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.P120} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.P150} style={[styles.text2,styles.textWith]}></TextView>
                          <TextView text={summaryItem?.P180} style={[styles.text2]}></TextView>
                      </>
                     }
                  })
                  }
      
          </View>
  
  })
  
}
    
     





    <View style={[styles.row,{padding:10}]}>
        <TextView text={"Total"} style={[styles.text2,styles.textWith,{flex:0.9,textAlign:'right',paddingRight:10}]}></TextView>
   
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.OK} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.X} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.P30} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.P60} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.P90} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.P120} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.P150} style={[styles.text2,styles.textWith]}></TextView>
        <TextView text={customerReport?.CCP_SUMMARY_TOTAL?.P180} style={[styles.text2]}></TextView>
        




    </View>
    </View>
    </ScrollView>
    </View>


    <TextView style={styles.text2} text={"Credit Apps:"}></TextView>
<View style={styles.box}>
<ScrollView 
    showsHorizontalScrollIndicator={false}
    horizontal={true}
    >
        <View>
    <View style={[styles.row,{padding:10}]}>
        <TextView text={"Member"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Branch"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Application Date"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Application Id"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Amount"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"TY"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"AC"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={"Group Id"} style={[styles.text2,{flex:1}]}></TextView>

       



    </View>
    {Array.isArray(customerReport?.ENQUIRIES) && 
    
    customerReport?.ENQUIRIES.map((item,index)=>{
        
        return(
        
            <View style={[styles.row,{padding:10}]}>
                <TextView text={item?.MEM_NAME} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.SUBBRN_NAME} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.REFERENCE_DATE} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.REFERENCE_NO} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.AMOUNT} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.ACCT_TY} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.ASSOC_TY} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
                <TextView text={item?.CO_BORROWER} style={[styles.text2,{flex:1}]}></TextView>
            </View>

        )
    })
    
    }
    </View>
    </ScrollView>
</View>

<TextView style={styles.text2} text={"Credit Reviews:"}></TextView>
<View style={styles.box}>

        <View>
    <View style={[styles.row,{padding:10}]}>
        <TextView text={"Member"} style={[styles.text2,{flex:1,borderRightWidth:1,borderColor:'#000'}]}></TextView>
        <TextView text={"Reviews"} style={[styles.text2,{flex:1}]}></TextView>


       



    </View>

    <View style={[styles.row,{padding:10}]}>
    <TextView text={"Total"} style={[styles.text2,styles.textWith,{flex:1}]}></TextView>
        <TextView text={""} style={[styles.text2,{flex:1}]}></TextView>
        
    </View>
    </View>
</View>

<TextView style={styles.text4} text={"TY : Account Type , ST : Account Status , RR : Reason to Report , AC : Association CodeTY : Account Type , ST : Account Status , RR : Reason to Report , AC : Association Code The information provided is only for the purpose of evaluation of the customer and whatever is contained herein is data supplied by members in accordance with the rights and obligations under the conditions of Agreement."}></TextView>


<TextView style={styles.text5} text={"*** END OF CREDIT REPORT ***"}></TextView>
    </View>//Top View Ends


}
export default CIBView;
const styles = StyleSheet.create({
    main: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },
    row2: { flexDirection: 'row', alignItems: 'center', marginRight: 10, marginLeft: 10, marginTop: 10 },
    text1: { fontSize: 12, color: '#7d7d7d', marginLeft: 10, marginRight: 10, fontWeight: 'bold' },
    text3: { fontSize: 12, color: '#7d7d7d', marginLeft: 10, marginRight: 10 },
    text2: { fontSize: 12, color: '#000', marginLeft: 10, marginRight: 10, fontWeight: 'bold' },
    text4: { textAlign:'center',fontSize: 12, color: '#000', marginLeft: 20, marginRight: 20,marginTop:20,marginBottom:20, fontWeight: 'bold' },
    text5: { fontSize: 12, color: '#000', marginLeft: 10, marginRight: 10, fontWeight: 'bold',textAlign:'center',marginBottom:20 },
   
    image: { height: 50, width: 50, marginRight: 10, resizeMode: 'contain', marginBottom: 10 },
    line: { backgroundColor: '#e3e3e3', height: 2, marginLeft: 10, marginRight: 10, marginTop: 10, borderRadius: 10 },
    box: { borderRadius: 1, elevation: 3, paddingBottom: 5, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#7d7d7d', margin: 10 },
    textWith:{width:Dimensions.get("screen").width/8,borderRightWidth:1,borderColor:'#000',paddingRight:5},
    textWith2:{width:Dimensions.get("screen").width/8,borderRightWidth:1,borderColor:'#000',paddingRight:5},
    centerAlign: { textAlign: 'center', marginTop:5 },
       
     
})