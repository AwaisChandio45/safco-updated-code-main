import React, { useState } from 'react';
import { SafeAreaView , View, Image, StyleSheet, Dimensions, ScrollView} from 'react-native';
import TextView from './TextView';


const { width, height } = Dimensions.get('window');
const CirView = ({ reportDetail }) => {
    
    const [obj, setObj] = useState(reportDetail?.CreditReport);
    
    //console.log('===>',obj)

    const tableHeadings = {
        overDueSummary:["30+", "60+", "90+", "120+", "150+", "180+", "MFI Default"],
        statusHeading:["Product", "Financial Institution", "Date of Application", "Amount of Facility", "Status"],
        SettlementOfLoanHeading:["Product", "Total Limit", "Approval Date", "Relationship Date", "Maturity Date", "Date of Settlement"],
        PersonalGuranteesHeading:["Product", "Name", "CNIC", "Date of Invocation", "Date", "Amount"],
        DetailsOfCoborrowerHeading:["Name", "CNIC"],
        DetailsOfBankruptcyHeading:["Court Name", "Declaration Date"],
        DetailsOfEnquiriesHeading:["Sr.", "FI Type", "Date of Enquiry"],
        MfiIncomeGenerationHeadings:{
            incomeGenerationheadings:[ 
                ["LOAN_ACCOUNT_STATUS","LOAN_TYPE", "DATE_OF_LAST_PAYMENT_MADE","FACILITY_DATE", "MATURITY_DATE", "BOUNCED_REPAYMENT_CHEQUES", "SECURITY_COLLATERAL", "WRITE_OFF_AMOUNT", "RECOVERY_DATE"],
                ["LOAN_LAST_PAYMENT_AMOUNT", "POSITION_AS_OF", "REPAYMENT_FREQUENCY" , "CLASSIFICATION_NATURE", "CLASSIFICATION_TYPE", "RESTRUCTURING_DATE", "RESTRUCTURING_AMOUNT", "WRITEOFF_DATE"],
                ["LOAN_LIMIT", "OUTSTANDING_BALANCE","MINIMUM_AMOUNT_DUE", "COLLATERAL_AMOUNT", "LITIGATION_AMOUNT","SECURED_UNSECURED","WRITEOFF_TYPE", "RECOVERY_AMOUNT"]
            ],
            summaryOfOverdues:[
                "Days", "30+",	"60+",	"90+",	"120+",	"150+",	"180+",	"MFI Default",	"1 - 15",	"16 - 20",	"21 - 29",	"30"
            ]

        }
    }

    const PersonaInfoView = ({heading, text}) => {
        return(
            
            <View style={{flexDirection:"row", padding:5}}>
                <View style={{flex:1,}}>
                    <TextView style={{fontSize:12, fontWeight:"bold"}} text={heading} />
                </View>
                <View style={{flex:1, }}>
                    <TextView style={{fontSize:12}} text={text} />
                </View>
            </View>
        )
    }

    const SummaryView = ({summary, text}) => {
        return(
            <View style={{marginTop:10}}>
                                
                <View style={{width:width/4, height:40, backgroundColor:"#cdcdcd", justifyContent:"center", alignItems:'center'}}>
                    <TextView text={summary} />
                </View>
                
                <TextView style={{fontSize:12, marginTop:5, width:width/3}} text={text} />
            
            </View>
        )
    }

    const OverDueSummary = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>

                        <View style={styles.grayRowHeading}>

                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={""} />

                                    </View>   
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                    </>
                                )
                            
                            })}
                        </View>

                        {data?.map((dataItem, index) => {
                            
                            return (
                                    <View style={{flexDirection:"row",}}>
                                        <View style = {styles.column}>
                                            
                                            <TextView style={{fontSize:12, color:"#000", }} text={"No. of Times"} />

                                        </View>
                                        <>
                                        
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PLUS_30_24M} />

                                            </View>
                                        
                                            <View style = {styles.column}>
                                
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PLUS_60_24M} />

                                            </View>

                                            <View style = {styles.column}>
                                
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PLUS_90_24M} />

                                            </View>

                                            <View style = {styles.column}>
                                
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PLUS_120_24M} />

                                            </View>

                                            <View style = {styles.column}>
                                
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PLUS_150_24M} />

                                            </View>

                                            <View style = {styles.column}>
                                
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PLUS_180_24M} />

                                            </View>

                                            <View style = {styles.column}>
                                
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.MFI_DEFAULT} />

                                            </View>
                                        </>
                                    
                                    </View>
                                )

                        })}
                    
                    </View>

                </ScrollView>
        )
    }

    const DetailOfStatus = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>

                        <View style={styles.grayRowHeading}>
                                
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                    </>
                                )
                            
                            })}
                        </View>

                        {data?.map((dataItem, index) => {
                                
                            return(
                                <View style={{flexDirection:"row",}}>
                                    
                                            <>

                                                <View style = {styles.column}>
                                        
                                                    <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PRODUCT} />

                                                </View>

                                                <View style = {styles.column}>
                                        
                                                    <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.FINANCIAL_INSTITUTION} />

                                                </View>

                                                <View style = {styles.column}>
                                        
                                                    <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.DATE_OF_APPLICATION} />

                                                </View>

                                                <View style = {styles.column}>
                                        
                                                    <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.AMOUNT_OF_FACILITY} />

                                                </View>

                                                <View style = {styles.column}>
                                        
                                                    <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.STATUS} />

                                                </View>
                                            
                                            </>    
                                
                                </View>
                            ) 

                        })}
                    
                    </View>

                </ScrollView>
        )
    }

    const DetailsOfSettlement = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>

                        <View style={styles.grayRowHeading}>
                                
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                    </>
                                )
                            
                            })}
                        </View>

                        {data?.map((dataItem, index) => {
                            
                            return(
                                <View style={{flexDirection:"row",}}>
                                    
                                    <>
                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PRODUCT} />

                                        </View>

                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.TOTAL_LIMIT} />

                                        </View>

                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.APPROVAL_DATE} />

                                        </View>

                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.RELATIONSHIP_DATE} />

                                        </View>

                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.MATURITY_DATE} />

                                        </View>

                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.DATE_OF_SETTLEMENT} />

                                        </View>      
                                    </>
                                
                                </View>
                                ) 

                        })}
                    
                    </View>

                </ScrollView>
        )
    }

    const DetailsOfPersonalGurantees = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>
                        <View style={{backgroundColor:"#777272"}}>
                            <View style={{flexDirection:"row", marginLeft:'40%', justifyContent:"space-between"}}>
                                <TextView style={{fontSize:12,color:"#fff"}} text={"Principal Borrower"} />
                                <TextView style={{fontSize:12, marginRight:30, color:"#fff"}} text={"Guarantee"} />
                            </View>

                        </View>

                        <View style={styles.grayRowHeading}>
                                
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                </>
                                )
                            
                            })}
                        </View>

                            {data?.map((dataItem, index) => {
                                
                                return (
                                    <View style={{flexDirection:"row",}}>
                                        
                                        <>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PRODUCT} />

                                            </View>

                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PRINCIPAL_BORROWER_NAME} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.PRINCIPAL_BORROWER_CNIC} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.DATE_OF_INVOCATION} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.GUARANTEE_DATE} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.GUARANTEE_AMOUNT} />

                                            </View>
                                            

                                        </>
                                    
                                    </View>
                                )

                            })}
                    
                    </View>

                </ScrollView>
        )
    }

    const DetailsOfCoborrower = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>

                        <View style={styles.grayRowHeading}>
                                
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                    </>
                                )
                            
                            })}
                        </View>

                            {data?.map((dataItem, index) => {
                                
                                return (
                                    <View style={{flexDirection:"row",}}>
                                        
                                        <>
                                        
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.NAME} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.CNIC} />

                                            </View>
                                        
                                        </>
                                    
                                    </View>
                                )

                            })}
                    
                    </View>

                </ScrollView>
        )
    }

    const DetailsOfBankruptcy = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>

                        <View style={styles.grayRowHeading}>
                                
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                    </>
                                )
                            
                            })}
                        </View>

                            {data?.map((dataItem, index) => {
                                
                                return (
                                    
                                    <View style={{flexDirection:"row",}}>
                                        
                                        <>
                                        
                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.COURT_NAME} />

                                        </View>
                                        <View style = {styles.column}>
                                
                                            <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.DECLARATION_DATE} />

                                        </View>
                                        
                                        </>
                                                    
                                    
                                    </View>
                                )

                            })}
                    
                    </View>

                </ScrollView>
        )
    }

    const DetailsOfEnquiries = ({data, headings}) => {
        return(
                
                <ScrollView horizontal= {true}>
                    <View style={{}}>

                        <View style={styles.grayRowHeading}>
                                
                            {headings.map((item, index) => {
                                
                            return (
                                <>    
                                    <View style = {styles.column}>
                                    
                                        <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />

                                    </View>
                                    </>
                                )
                            
                            })}
                        </View>

                            {data?.map((dataItem, index) => {
                                
                                return (
                                    <View style={{flexDirection:"row",}}>
                                        
                                        <>
                                        
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.SR_NO} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.FI_TYPE} />

                                            </View>
                                            <View style = {styles.column}>
                                    
                                                <TextView style={{fontSize:12, color:"#000", }} text={dataItem?.DATE_OF_ENQUIRY} />

                                            </View>
                                        
                                        </>
                                    
                                    </View>
                                )

                            })}
                    
                        </View>

                </ScrollView>
        )
    }

    const MfiIncomeGeneration = ({loanHistoryData, creditHistoryData ,headings,twoyears}) => {

        return (
            <View style={{marginTop:20, borderWidth:0.5, borderColor:"#cdcdcd",}}>
                <TextView style={styles.mainHeading} text={`${loanHistoryData?.LOAN_SERIAL_NUMBER}-${loanHistoryData?.BANK_NAME}-${loanHistoryData?.PRODUCT}`} />

                <ScrollView horizontal = {true}>
                
                    <View style = {{flexDirection:"row"}}>
                        <View style={{}}>
                            {headings[0].map((item, index) => {
                               
                               return item in  loanHistoryData? <TextView style={[styles.loanDetailColumn, {fontWeight:"bold"}]} text={item+":"} />:null

                            })}
                        </View>
                        <View style={{}}>
                            {"LOAN_ACCOUNT_STATUS" in loanHistoryData? <TextView style={styles.loanDetailColumn} text={loanHistoryData?.LOAN_ACCOUNT_STATUS} />:null}
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.LOAN_TYPE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.DATE_OF_LAST_PAYMENT_MADE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.FACILITY_DATE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.MATURITY_DATE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.BOUNCED_REPAYMENT_CHEQUES}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.SECURITY_COLLATERAL}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.WRITE_OFF_AMOUNT}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.RECOVERY_DATE}/>
                        </View>
                        <View style={{}}>
                            {headings[1].map((item, index) => {
                                
                                return item in  loanHistoryData? <TextView style={[styles.loanDetailColumn, {fontWeight:"bold"}]} text={item+":"} />:null

                            })}
                        </View>
                        <View style={{}}>
                        {"LOAN_LAST_PAYMENT_AMOUNT" in loanHistoryData? <TextView style={styles.loanDetailColumn} text={loanHistoryData?.LOAN_LAST_PAYMENT_AMOUNT} />:null}
                            {/* <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={"Nahin mila"}/> */}
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.POSITION_AS_OF}/>
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.REPAYMENT_FREQUENCY}/>
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.CLASSIFICATION_NATURE}/>
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.CLASSIFICATION_TYPE}/>
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.RESTRUCTURING_DATE}/>
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.RESTRUCTURING_AMOUNT}/>
                            <TextView style={{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40}} text={loanHistoryData?.WRITEOFF_DATE}/>
                        </View>
                        <View style={{}}>
                            {headings[2].map((item, index) => {
                                
                                return <TextView style={[styles.loanDetailColumn,{fontWeight:"bold"}]} text={item} />

                            })}
                        </View>
                        <View style={{}}>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.LOAN_LIMIT}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.OUTSTANDING_BALANCE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.MINIMUM_AMOUNT_DUE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.COLLATERAL_AMOUNT}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.LITIGATION_AMOUNT}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.SECURED_UNSECURED}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.WRITEOFF_TYPE}/>
                            <TextView style={styles.loanDetailColumn} text={loanHistoryData?.RECOVERY_AMOUNT}/>
                        </View>
                    </View>

                </ScrollView>

                <View style={{padding:5}}>
                    
                    <TextView style={styles.mainHeading} text={"SUMMARY OF OVERDUES AND LATE PAYMENTS FOR LAST 24 MONTHS"} />

                    <ScrollView horizontal = {true}>
                        <View>
                            <View style={{backgroundColor:"#777272", flexDirection:"row",}}>
                                
                                {tableHeadings.MfiIncomeGenerationHeadings.summaryOfOverdues.map((item, index) => {
                                    
                                return (
                                        <View style = {styles.column}>
                                        
                                            <TextView style={{fontSize:12, color:"#fff", fontWeight:"bold",}} text={item} />
    
                                        </View>
                                    )
                                
                                })}
                            </View>

                            <View style={{flexDirection:"row",}}>
                                <View style = {styles.column}>
                        
                                    <TextView style={{fontSize:12, color:"#000", }} text={"Times"} />

                                </View>
                                
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.PLUS_30} />

                                </View>

                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.PLUS_60} />

                                </View>

                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.PLUS_90} />

                                </View>

                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.PLUS_120} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.PLUS_150} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.PLUS_180} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.MFI_DEFAULT} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.LATE_PAYMENT_1TO15} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.LATE_PAYMENT_16TO20} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.LATE_PAYMENT_21TO29} />

                                </View>
                                <View style = {styles.column}>
                                
                                    <TextView style={{fontSize:12, color:"#000", }} text={loanHistoryData?.LATE_PAYMENT_30} />

                                </View>

                            </View>
                        </View>

                    </ScrollView>

                    <TextView style={styles.mainHeading} text={"DETAILS OF CREDIT HISTORY FOR LAST 24 MONTHS"} />

                    <ScrollView horizontal = {true}>
                        <View>
                            {/* Table Headings */}
                            <View style ={{flexDirection:"row"}}>
                                
                                {/* Table One Heading*/}
                                <View style={{flexDirection:'row', }}>
                                    <View>
                                        <View style={{borderWidth:0.5, borderColor:"#cdcdcd", height:70, justifyContent:"center", width:55}}>
                                            
                                            <TextView style={{fontSize:12, fontWeight:'bold', padding:5}} text={'Month'} />

                                        </View>
                                    </View>
                                    
                                    <View>
                                        <View style={{}}>
                                            <View style = {{borderWidth:0.5, borderColor:"#cdcdcd", alignItems:'center', height:35, padding:5}}>
                                                <TextView style={{fontSize:12, fontWeight:'bold',}} text={'Amount Overdue'}  />

                                            </View>
                                        </View>

                                        <View style = {{flexDirection:'row'}}>

                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'30+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'60+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'90+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'120+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'150+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'180+'} />
                                            </View>
                                            

                                        </View>

                                    </View>

                                    <View style = {{flexDirection:"row", height:60,}}>
                                        <View style={{borderWidth:0.5, borderColor:"#cdcdcd", alignItems:'center', justifyContent:"center", padding:5, width:100, height:70}}>
                                            <TextView style={{fontSize:12, fontWeight:'bold',}} text={'MFI Default'} />
                                        </View>
                                        <View style={{borderWidth:0.5, borderColor:"#cdcdcd", alignItems:'center', justifyContent:"center", padding:5, width:100, height:70}}>
                                            <TextView style={{fontSize:12, fontWeight:'bold',}} text={'Late PMT Days'} />
                                        </View>
                                    </View>

                                </View>

                                {/* Table Two Heading*/}
                                <View style={{flexDirection:'row', }}>
                                    <View>
                                        <View style={{borderWidth:0.5, borderColor:"#cdcdcd", height:70, justifyContent:"center", width:55}}>
                                            
                                            <TextView style={{fontSize:12, fontWeight:'bold', padding:5}} text={'Month'} />

                                        </View>
                                    </View>
                                    
                                    <View>
                                        <View style={{}}>
                                            <View style = {{borderWidth:0.5, borderColor:"#cdcdcd", alignItems:'center', height:35, padding:5}}>
                                                <TextView style={{fontSize:12, fontWeight:'bold',}} text={'Amount Overdue'}  />

                                            </View>
                                        </View>

                                        <View style = {{flexDirection:'row'}}>

                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'30+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'60+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'90+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'120+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'150+'} />
                                            </View>
                                            <View style = {styles.MfiTableHeadingPlus}>
                                                <TextView style={{fontSize:12, fontWeight:'bold', }} text={'180+'} />
                                            </View>
                                            

                                        </View>

                                    </View>

                                    <View style = {{flexDirection:"row", height:60,}}>
                                        <View style={{borderWidth:0.5, borderColor:"#cdcdcd", alignItems:'center', justifyContent:"center", padding:5, width:100, height:70}}>
                                            <TextView style={{fontSize:12, fontWeight:'bold',}} text={'MFI Default'} />
                                        </View>
                                        <View style={{borderWidth:0.5, borderColor:"#cdcdcd", alignItems:'center', justifyContent:"center", padding:5, width:100, height:70}}>
                                            <TextView style={{fontSize:12, fontWeight:'bold',}} text={'Late PMT Days'} />
                                        </View>
                                    </View>

                                </View>
                            </View>
                            
                            {/* Table Headings End */}

                            {/* Table Data Start */}
                           {twoyears.length>0 && <View style={{flexDirection:'row'}}>
                               
                               {/* Table Data */}

                               {/* {twoyears.map((underItem, underIndex) => {
                                    return(
                                        underIndex<12 ? */}

                                <View style={{flexDirection:'row', }}>

                                        <View>

                                            {twoyears.map((underItem, underIndex) => {
                                                //console.log("wishnu===>",twoyears[underIndex])
                                                
                                    return(
                                        underIndex<12 ? <View style = {{flexDirection:'row'}}>
                                                    <View style={styles.detailOfCreditMonthColumn}>
                                                    
                                                        <TextView style={{fontSize:12, fontWeight:'bold',}} text={twoyears[underIndex]?.MONTH_NAME} />
    
                                                    </View>
    
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.PLUS_30} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.PLUS_60} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.PLUS_90} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.PLUS_120} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.PLUS_150} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.PLUS_180} />
                                                    </View>
                                                    <View style={styles.MfiDefaultColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.MFI_DEFAULT} />
                                                    </View>
                                                    <View style={styles.MfiDefaultColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex]?.LATE_PMT_DAYS} />
                                                    </View>
    
                                                    {/* --------------------------------------------------- */}
    
                                                    <View style={styles.detailOfCreditMonthColumn}>
                                                    
                                                        <TextView style={{fontSize:12, fontWeight:'bold',}} text={twoyears[underIndex+12]?.MONTH_NAME} />
    
                                                    </View>
                                                    
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.PLUS_30} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.PLUS_60} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.PLUS_90} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.PLUS_120} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.PLUS_150} />
                                                    </View>
                                                    <View style = {styles.detailOfCreditColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.PLUS_180} />
                                                    </View>
                                                    <View style={styles.MfiDefaultColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.MFI_DEFAULT} />
                                                    </View>
                                                    <View style={styles.MfiDefaultColumn}>
                                                        <TextView style={{fontSize:12, }} text={twoyears[underIndex+12]?.LATE_PMT_DAYS} />
                                                    </View>
                                                </View>:null
                                    )})}

                                                
    
                                        </View>
                                        {/* <View>
                                            <View style = {{flexDirection:"row", height:35,}}>
                                                    <View style={{borderWidth:0.5, borderColor:"#cdcdcd", padding:5,width:100,}}>
                                                        <TextView style={{fontSize:12, }} text={'0'} />
                                                    </View>
                                                    <View style={{borderWidth:0.5, borderColor:"#cdcdcd", padding:5, width:100}}>
                                                        <TextView style={{fontSize:12, }} text={'0'} />
                                                    </View>
                                            </View>
    
                                        </View> */}
    
                                </View>
                                
                               
                                
                            </View>}
                            {/* Table Data End */}
                        </View>
                    </ScrollView>

                </View>
            
            </View>
        )

    }
    //return <></>

    return (
        <SafeAreaView style={{padding:10, backgroundColor:"#fff"}}>
            
            {/* Header */}
            <View style={{flexDirection:"row"}}>

                <View style={{padding:5, flex:1, alignItems:'center'}}>
                    <Image source = {require("../assests/images/Tasdeeq_Logo_1.png")} style={{width:100, height:50, resizeMode:"stretch"}} />
                </View>

                <View style={{padding:5, flex:1, alignItems:"center"}}>
                    <TextView style={{fontSize:11, fontWeight:'bold', textAlign:'center'}} text = {"CONSUMER CREDIT INFORMATION REPORT"} />
                </View>

                <View style={{padding:5 ,flex:1, alignItems:'center'}}>
                    <TextView style={{fontSize:11}} text = {"CONFIDENTIAL"} />
                    
                    <TextView style={{fontSize:11, fontWeight:"bold"}} text = {"DATE TIME:"} />
                    <TextView style={{fontSize:11}} text={`${obj?.reportDate} ${obj?.reportTime}` } />
                
                    <TextView style={{fontSize:11, fontWeight:"bold"}} text = {"Report Ref No:"} />

                    <TextView style={{fontSize:11}} text={obj?.refNo} />

                </View>
            </View>
            
            {/* Personal Information */}
            <View style={{}}>
                <TextView style={styles.mainHeading} text={"PERSONAL INFORMATION"} />

                <View>
                    <PersonaInfoView heading = {"Name"} text={obj?.personalInformation?.NAME} />

                    <PersonaInfoView heading = {"Gender"} text={obj?.personalInformation?.GENDER} />

                    <PersonaInfoView heading = {"Date of Birth"} text={obj?.personalInformation?.DOB} />

                    <PersonaInfoView heading = {"Nationality"} text={obj?.personalInformation?.NATIONALITY} />

                    <PersonaInfoView heading = {"CNIC"} text={obj?.personalInformation?.CNIC} />

                    <PersonaInfoView heading = {"NIC"} text={obj?.personalInformation?.NIC} />

                    <PersonaInfoView heading = {"NTN"} text={obj?.personalInformation?.NTN} />

                    <PersonaInfoView heading = {"Father Name"} text={obj?.personalInformation?.FATHER_OR_HUSBAND_NAME} />

                    <PersonaInfoView heading = {"Passport No"} text={obj?.personalInformation?.PASSPORT} />

                    <PersonaInfoView heading = {"Business/Profession"} text={obj?.personalInformation?.BUSINESS_OR_PROFESSION} />

                    <PersonaInfoView heading = {"Borrower Type"} text={obj?.personalInformation?.BORROWER_TYPE} />
                    
                    <PersonaInfoView heading = {"Current Residential Address"} text={obj?.personalInformation?.CURRENT_RESIDENTIAL_ADDRESS} />
                    
                    <PersonaInfoView heading = {"Permanent Address"} text={obj?.personalInformation?.PERMANENT_ADDRESS_DATE} />
                    
                    <PersonaInfoView heading = {"Previous Residential Address"} text={obj?.personalInformation?.PREVIOUS_RESIDENTIAL_ADDRESS} />

                    <PersonaInfoView heading = {"Employe/Business"} text={obj?.personalInformation?.EMPLOYER_OR_BUSINESS} />
                </View>
            
            </View>
            
            {/* Summary Infomation */}
            <View style={{marginTop:20,}}>
                <TextView style={styles.mainHeading} text={"SUMMARY OF INFORMATION CONTAINED IN THIS REPORT"} />
                
                <View style = {{flexDirection:"row", justifyContent:"space-between"}}>
                    
                    <SummaryView summary = {obj?.noOfCreditEnquiry} text={"No. of Credit Enquiries (Last 12 Months"} />

                    <SummaryView summary = {obj?.noOfActiveAccounts} text={"No. of Active Accounts"} />

                    <SummaryView summary = {`PKR ${obj?.totalOutstandingBalance}`} text={"Total Outstanding Balance"} />
                
                </View>
            
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"OVERDUE SUMMARY OF LOANS FOR LAST 24 MONTHS"} />
                                
                <OverDueSummary data = {obj?.summaryOverdue_24M} headings = {tableHeadings?.overDueSummary} />
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"DETAILS OF STATUS OF CREDIT APPLICATIONS FOR THE LAST 24 MONTHS"} />
                                
                <DetailOfStatus data = {obj?.detailsOfStatusCreditApplication} headings = {tableHeadings?.statusHeading} />
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"DETAILS OF SETTLEMENT OF LOANS FOR LAST FIVE YEARS"} />
                                
                <DetailsOfSettlement data = {obj?.detailsOfLoansSettlement} headings = {tableHeadings.SettlementOfLoanHeading} />
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"DETAILS OF PERSONAL GUARANTEES GIVEN BY THE DEBTOR"} />
                                
                <DetailsOfPersonalGurantees data = {obj?.personalGuarantees} headings = {tableHeadings?.PersonalGuranteesHeading} />
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"DETAILS OF CO-BORROWER OF DEBTOR"} />
                                
                <DetailsOfCoborrower data = {obj?.coborrowerDetail} headings = {tableHeadings?.DetailsOfCoborrowerHeading} />
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"DETAILS OF BANKRUPTCY CASES"} />
                                
                <DetailsOfBankruptcy data = {obj?.detailsOfBankruptcyCases} headings = {tableHeadings?.DetailsOfBankruptcyHeading} />
            </View>

            <View style={{marginTop:20}}>
                <TextView style={styles.mainHeading} text={"DETAILS OF ENQUIRIES FOR LAST 24 MONTHS"} />
                                
                <DetailsOfEnquiries data = {obj?.creditEnquiry} headings = {tableHeadings?.DetailsOfEnquiriesHeading} />
            </View>

            <View style={{marginTop:20 }}>
                                
                {obj?.loanDetails.map((item, index)=>{
                    let make = obj?.creditHistory.filter(obj=>obj.LOAN_SERIAL_NUMBER===item.LOAN_SERIAL_NUMBER);
                    return <MfiIncomeGeneration twoyears={make} loanHistoryData={item} creditHistoryData={obj?.creditHistory} headings = {tableHeadings?.MfiIncomeGenerationHeadings.incomeGenerationheadings} />

                })}
            </View>
        
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainHeading:{fontSize:12, backgroundColor:"#444343", color:"#fff", fontWeight:"bold", padding:5},
    column:{width:100, padding:5},
    loanDetailColumn:{fontSize:12, padding:5, borderWidth:0.5, borderColor:"#cdcdcd", width:160, height:40},
    detailOfCreditMonthColumn:{borderWidth:0.5, borderColor:"#cdcdcd", height:35, padding:5, width:55 },
    detailOfCreditColumn:{borderWidth:0.5, borderColor:"#cdcdcd", width:35, height:35, justifyContent:"center", alignItems:"center"},
    MfiDefaultColumn:{borderWidth:0.5, borderColor:"#cdcdcd",width:100, alignItems:"center"},
    grayRowHeading:{backgroundColor:"#777272", flexDirection:"row",},
    MfiTableHeadingPlus:{borderWidth:0.5, borderColor:"#cdcdcd", width:35, height:35, alignItems:"center"},
})

export default CirView;