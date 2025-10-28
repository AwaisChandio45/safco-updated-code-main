import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Dimensions, ScrollView, Alert } from "react-native";
import { View } from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppStatusBar, CustomDropdown, DateSelector, FormInputs, HeaderwithoutDialoge, Tabsitems, TextView } from "../components";
import MultirowView from "../components/MultirowView";
import RowView from "../components/RowView";
import Toast from "../components/Toast";
import { getAutofinanceCalculatorProducts, getCalculatorProducts } from "../sqlite/sqlitedb";
import { Colors, GlobalStyles } from "../theme";
import NumberFormater from "../utilis/NumberFormater";
import {useSelector} from 'react-redux';
const { height, width } = Dimensions.get("window");
const LoanCalculator = () => {
    const [index, setIndex] = React.useState(1);
    var aRepaymentFrequency = ["Select Frequency", "Monthly", "Bi-monthly", "Quartely", "6 Monthly", "Yearly"];

    const [loanAmount, setLoanAmount] = React.useState({
        loanAmount: { value: '', error: false },
        donor: "SBP",
        project: "State Bank - Line of Credit",
        loantype: "",
        loanTypeObject: undefined,
        startingDate: ''
    });

    const [toast, setToast] = React.useState({ value: "", type: "" });
    const [loanProducts, setLoanProducts] = useState([]);
    const [isLoader, setLoader] = useState(false);
    const [salaryIncome, setSalaryIncome] = useState({ show: false, value: 0, error: false });



    const [loader2, setLoader2] = useState(false);
    const [resultShow, setResultShow] = useState(false)
    const [resultShow2, setResultShow2] = useState(false)

    const [repaymets, setRepayments] = useState([])

    // Auto finacne calculator
    const [loanAmount2, setLoanAmount2] = React.useState({
        product: { value: undefined, object: undefined },
        productItem: { value: undefined, object: undefined },
        loanTerm: { value: undefined, object: undefined },
        repaymetsFrequency: { value: undefined, object: undefined },
        downPaymentPercentage: { value: "", error: false },
        RepaymentStartDate: ''
    });
    const [autoFinanceloanProducts, setAutoFinanceLoanProducts] = useState([]);
    const [productItems, setProductItems] = useState([]);
    const [loanTermsArray, setLoanTermArray] = useState(["6", "12", "18", "24"])
    const [RepaymentFrequencys, setRepaymentFrequencys] = useState([{ name: "Monthly", value: 12 }, { name: "Bi-monthly", value: 24 }, { name: "Quartely", value: 3 }, { name: "6 Monthly", value: 6 }, { name: "Yearly", value: 1 }])
    const [resultMaker, setResultMaker] = useState(
        {
            pricipalAmount: '',
            loanTerms: "",
            financialIncomeRate: '',
            serviesCharge: '',
            totalLoanAmount: '',
            repaymentFrequency: '',
            downpayment: '',
            productRegistrationFee: '',
            ownAmount: '',
            emergencyFund: '',
            cibCharges: '',
            nadraCharges: '',
            repaymentAmount: '',
            financialIncome: '',
            totalRepaymentAmount: '',

        })
    const [repaymets2, setRepayments2] = useState([])



    useEffect(() => {
        getLoanProductsArray();
        getLoanAutoFinanceProductsArray();
    }, [])

    const getLoanProductsArray = async () => {
        getCalculatorProducts().then((res) => {
            // console.log(res);
            setLoanProducts(res);
        });
    }
    const getLoanAutoFinanceProductsArray = async () => {

        getAutofinanceCalculatorProducts().then((res) => {
            console.log("===>Autofinance",res);
            // alert(JSON.stringify(res))
            setAutoFinanceLoanProducts(res);
        });
    }
    const _handleCalculate = () => {

        // console.log("calculate==>", loanAmount);
        if (loanAmount.loanAmount.value == "") {
            setToast({ message: "Please enter Loan amount", type: "error" });
            return;
        }
        if (loanAmount.loantype == "") {
            setToast({ message: "Please Select Loan Product", type: "error" });
            return;
        }
        if (salaryIncome.show && salaryIncome.value == "") {
            setToast({ message: "Please enter client income", type: "error" });
            return;
        }
        if (loanAmount.startingDate == "" || loanAmount.startingDate == undefined) {
            setToast({ message: "Please select date", type: "error" });
            return;
        }
        handleNormalLoanCalcalate();
    }

    const _handleAutoFinanceCalculate = () => {


        // console.log("calculate==>", loanAmount2);
        if (loanAmount2.product.value == undefined) {
            setToast({ message: "Please Select Product", type: "error" });
            return;
        }
        if (loanAmount2.productItem.value == undefined) {
            setToast({ message: "Please Select Item", type: "error" });
            return;
        }
        if (loanAmount2.loanTerm.value == undefined) {
            setToast({ message: "Please Select Loan term", type: "error" });
            return;
        }
        if (loanAmount2.repaymetsFrequency.value == undefined) {
            setToast({ message: "Please Select Frequency", type: "error" });
            return;
        }

        if (index == 2) {
            handleAutoFinanceCalcalate();
        }






    }


    const handleNormalLoanCalcalate = () => {
        setRepayments([])
        setLoader(true)


        var $dServiceChargesRate = loanAmount.loanTypeObject?.ServiceChargesRate;
        var $iRepaymentFrequency = loanAmount.loanTypeObject?.RepaymentFrequency;
        var $sRepaymentRule = loanAmount.loanTypeObject?.RepaymentRule
        var $iLoanTerm = loanAmount.loanTypeObject?.LoanTerm;
        var $iServiceChargesFrequency = loanAmount.loanTypeObject?.ServiceChargesFrequency;
        var $iServiceChargesType = loanAmount.loanTypeObject?.ServiceChargesType;
        var dRepaymentStartDate: any = loanAmount.startingDate;
        var $dLoanAmount: any = loanAmount.loanAmount.value;
        var $dApprovedLoanAmount = $dLoanAmount;
        var $iRepaymentFrequencyInAYear = 0;
        var $iApprovedLoanAmount = 0;
        var $iNumberOfMonths = 0;
        var $iApprovedLoanAmount1 = 0
        var totalFinancialIncome = 0;
        // console.log("dServiceChargesRate", $dServiceChargesRate);
        // console.log("iRepaymentFrequency", $iRepaymentFrequency);
        // console.log("sRepaymentRule", $sRepaymentRule);
        console.log("iLoanTerm", $iLoanTerm);
        // alert($iLoanTerm)
        // console.log("iServiceChargesFrequency", $iServiceChargesFrequency);
        // console.log("iServiceChargesType", $iServiceChargesType);
        // console.log("dRepaymentStartDate", dRepaymentStartDate);
        $iNumberOfMonths = 12
        $iRepaymentFrequencyInAYear = 1
        var $iRepaymentFrequencyInAYear2 = 1
        var $sProductRepaymentFrequency = "";

        // console.log("---->swtich")
        // console.log("---->$iRepaymentFrequency", $iRepaymentFrequency)
        // console.log("---->swtich")

        switch ($iRepaymentFrequency) {
            case 1:
                $sProductRepaymentFrequency = "Monthly";
                $iNumberOfMonths = 12;
                $iRepaymentFrequencyInAYear = 1;
                $iRepaymentFrequencyInAYear2 = 12;
                break;
            case 2:
                $sProductRepaymentFrequency = "Bi-Monthly";
                $iNumberOfMonths = 24; // was 24
                $iRepaymentFrequencyInAYear = 0.5;
                $iRepaymentFrequencyInAYear2 = 24;
                break;
            case 3:
                $sProductRepaymentFrequency = "Quarterly";
                $iNumberOfMonths = 12; // was 3
                //    $iRepaymentFrequencyInAYear = 1;
                $iRepaymentFrequencyInAYear2 = 4;
                $iRepaymentFrequencyInAYear = 4;
                //                        if($iDonorProjectId==1){
                //                            $iRepaymentFrequencyInAYear = 1;
                //                        }

                break;
            case 4:
                $sProductRepaymentFrequency = "Half-Yearly";
                $iNumberOfMonths = 12; // was 2
                $iRepaymentFrequencyInAYear = 2;
                $iRepaymentFrequencyInAYear2 = 2;
                //   $iRepaymentFrequencyInAYear = 1;

                break;
            case 5:
                $sProductRepaymentFrequency = "Yearly";
                $iNumberOfMonths = 12; // was 1
                $iRepaymentFrequencyInAYear = 1;
                $iRepaymentFrequencyInAYear2 = 1;
                break;
            //   default:
            //       $sProductRepaymentFrequency = "";
            //       $iNumberOfMonths = 1;
            //       $iRepaymentFrequencyInAYear = 1;
            //       $iRepaymentFrequencyInAYear2 = 1;
            //       break;
        }
        if ($iServiceChargesFrequency == 1) {

            $iNumberOfMonths = $iLoanTerm;
        }

        // console.log(` Number(Number(Number(${$dLoanAmount}) * Number(${$iLoanTerm})) * Number(Number(${$dServiceChargesRate}) / 100) / Number(${$iNumberOfMonths}))`)

        var $dServiceCharges = Number($dLoanAmount) * Number($iLoanTerm) * Number($dServiceChargesRate) / 100 / Number($iNumberOfMonths); // In actual formula, its 12
        // console.log("--->$dServiceCharges", $dServiceCharges)
        $dLoanAmount = Number(Number($dLoanAmount) + Number($dServiceCharges));
        var $dBalance = $dLoanAmount;
        var $iTotalLoanTerms = $iLoanTerm;
        var $dRepaymentStartDate = loanAmount.startingDate // Today
        var finalobj = []
        




        var $dPreviousBalance = 0;
        var $iBalanceEntry = 0;
        var $dRepaymentAmount: any = 0;
        var $iServiceCharges: any = 0;
        var $aApprovedLoanAmount: any = 0;
        var $aApprovedLoanAmount1: any = 0;
        var $iRemainingAmount1: any = 0;
        var $ServiceCharges1: any = 0;
        var $iServiceCharges1: any = 0;
        var $dServiceChargesTotal: any = 0;
        var $Balance: any = 0;
        var $iBalance: any = 0;
        var $dTotalRepaymentAmount: any = 0;
        var $iLoanTermAdusted1: any = 0;
        var $iLoanTermsPassed = 0;


        if ($iServiceChargesType == '1') {


            $dServiceCharges = 0;


            for (var $i = 0; $i < $iLoanTerm; $i++) {
                var $dRepaymentRule_Percentage = $sRepaymentRule[$i][0];

                if ($dRepaymentRule_Percentage == 0) {
                    $dRepaymentAmount = 0;
                    $iServiceCharges = 0;
                    $aApprovedLoanAmount += $iApprovedLoanAmount;
                } else {
                    if ($iRepaymentFrequencyInAYear == 1)
                        $iRepaymentFrequencyInAYear = 12;
                    $aApprovedLoanAmount1 += Number($iApprovedLoanAmount1);
                    $iRemainingAmount1 = Number($dApprovedLoanAmount) - Number($aApprovedLoanAmount1);
                    $iLoanTermAdusted1 = Number($iLoanTerm) / 12;
                    $iApprovedLoanAmount1 = Number($dApprovedLoanAmount) / (Number(Number($iRepaymentFrequencyInAYear) * Number($iLoanTermAdusted1)));

                    $ServiceCharges1 = (Number($iRemainingAmount1) * Number($dServiceChargesRate) * Number($iLoanTermAdusted1)) / 100;
                    $iServiceCharges1 = Number($ServiceCharges1) / Number($iRepaymentFrequencyInAYear);

                    $dServiceChargesTotal += Number($iServiceCharges1);

                    $Balance = Number($dApprovedLoanAmount) 
                    //+ Number($dServiceChargesTotal);
                    $Balance = Number($Balance).toFixed();
                }
            }

            $aApprovedLoanAmount = 0;
            $dServiceCharges = 0;
            $dRepaymentAmount = 0;
            var $iCounter = 1;
            for (var $j = 0; $j < $iLoanTerm; $j++) {
                // if($dRepaymentAmount <= 0) continue;

                $dRepaymentRule_Percentage = $sRepaymentRule[$j][0];
                var $dRepaymentRule_PercentageOf = $sRepaymentRule[$j][1];
                var $dRepaymentRule_AddBalanceAmount = $sRepaymentRule[$j][2];
                if ($dRepaymentRule_Percentage == 0) {
                    $dRepaymentAmount = 0;
                    $iServiceCharges = 0;
                    $aApprovedLoanAmount += Number($iApprovedLoanAmount);

                }
                else {

                    $aApprovedLoanAmount += Number($iApprovedLoanAmount);
                    var $iRemainingAmount = Number($dApprovedLoanAmount) - Number($aApprovedLoanAmount);

                    var $iLoanTermAdusted = Number($iLoanTerm) / 12;
                    $iApprovedLoanAmount = Number($dApprovedLoanAmount) / Number(Number($iRepaymentFrequencyInAYear) * Number($iLoanTermAdusted));
                    //var $ServiceCharges = (Number($iRemainingAmount) * Number($dServiceChargesRate) * Number($iLoanTermAdusted)) / 100;
                    var $ServiceCharges = (Number($iRemainingAmount) * (Number($dServiceChargesRate)/ 100) ) ;
                    
                    $iServiceCharges = Number($ServiceCharges) / Number($iRepaymentFrequencyInAYear);
                    $dRepaymentAmount = Number($iApprovedLoanAmount);
                    $dServiceCharges += Number($iServiceCharges);

                }

                var date = new Date(dRepaymentStartDate);

                var $dRepaymentDate: any = new Date(date.setMonth(date.getMonth() + $j));

                $dRepaymentDate = moment($dRepaymentDate).format("DD MMM YYYY");

                if ($iRepaymentFrequencyInAYear > 1) {
                    {
                        $iApprovedLoanAmount = $dRepaymentAmount;
                        $iServiceCharges = $iServiceCharges;
                        $dRepaymentAmount = Number($iApprovedLoanAmount) 
                        //+ Number($iServiceCharges);
                        $dTotalRepaymentAmount += Number($dRepaymentAmount);
                        if ($dRepaymentRule_Percentage != 0)
                            $iBalance = Number($Balance) - Number($dTotalRepaymentAmount);
                        if ($iBalance == 0 && $j < 2)
                            $iBalance = $Balance;
                    }
                }
                $iBalance = Number($iBalance);
                $dRepaymentAmount = Number($iServiceCharges) + Number($iApprovedLoanAmount);
                // $dRepaymentAmount = Number($dRepaymentAmount).toFixed()
                $iApprovedLoanAmount=$iApprovedLoanAmount;
                // ********************************************************
                if (Number(salaryIncome.value) > 0 && (Number($dRepaymentAmount) > Number(salaryIncome.value))) {
                    Alert.alert("Sorry", "Salary Income is less than Repayment Amount");
                    break;

                }
                console.log("===========================================================");
                console.log("--->$dRepaymentAmount", $iServiceCharges)
                console.log("===========================================================");

                totalFinancialIncome += Number($iServiceCharges)>0 ? Number($iServiceCharges) : 0;
                console.log("--->$totalFinancialIncome", totalFinancialIncome)

                finalobj.push({
                    no: $j + 1,
                    RepaymentDate: $dRepaymentDate,
                    PrincipalAmount: NumberFormater(Number($iApprovedLoanAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    FinancialIncome: NumberFormater(Number($iServiceCharges).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    RepaymentAmount: NumberFormater(Number($dRepaymentAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    Balance: NumberFormater(Number($iBalance).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),

                })
                // console.log("final Object=>" + finalobj)
                if ($j == Number($iLoanTerm - 1)) {
                    // let get=repaymets;
                    // var adder=get.concat(finalobj)
                    setLoader(false)
                    setResultShow(true)
                    setRepayments([...finalobj]);

                }
            }
        } else {
            // console.log("iLoanTerm", $iLoanTerm);
            // alert($iLoanTerm)
            for (var $i = 0; $i < Number($iLoanTerm); $i++) {

                $iLoanTermsPassed++;

                $dRepaymentAmount = Number(Number($dLoanAmount) / Number($iLoanTerm));
                // console.log("$dRepaymentAmount=>" + $dRepaymentAmount)
                if ($dRepaymentAmount <= 0) continue;

                $dRepaymentRule_Percentage = $sRepaymentRule[$i][0];
                $dRepaymentRule_PercentageOf = $sRepaymentRule[$i][1];
                $dRepaymentRule_AddBalanceAmount = $sRepaymentRule[$i][2];
                // echo "  $dRepaymentRule_Percentage </br>
                // $dRepaymentRule_PercentageOf </br>
                // $dRepaymentRule_AddBalanceAmount </br>"; 
                // console.log("--->$dRepaymentRule_Percentage", $dRepaymentRule_Percentage)
                // console.log("--->$$dRepaymentRule_PercentageOf", $dRepaymentRule_PercentageOf)
                // console.log("--->$dRepaymentRule_AddBalanceAmount", $dRepaymentRule_AddBalanceAmount)

                if ($dRepaymentRule_Percentage == 0) {
                    $dRepaymentAmount = 0;
                }
                else {
                    if ($dRepaymentRule_PercentageOf > -1) {
                        var $dBalanceAmount = $dLoanAmount;
                        if ($dRepaymentRule_PercentageOf == 0)	// x % of Repayment Amount
                        {
                            if ($dRepaymentRule_Percentage < 100) {
                                var $dRepaymentRule_Percentage_Left = 100 - $dRepaymentRule_Percentage;
                                $dPreviousBalance += $dRepaymentAmount * ($dRepaymentRule_Percentage_Left / 100);
                            }

                            if ($dRepaymentRule_Percentage > 100)
                                $dRepaymentAmount = $dBalanceAmount * ($dRepaymentRule_Percentage / 100 / ($iTotalLoanTerms - 1));
                            if ($dRepaymentRule_Percentage == 100 && $iBalanceEntry == 1)
                                $dRepaymentAmount = $dBalanceAmount * ($dRepaymentRule_Percentage / 100 / ($iTotalLoanTerms - 1));
                        }
                        else if ($dRepaymentRule_PercentageOf == 1) {	// x % of Loan Amount
                            $dRepaymentAmount = $dLoanAmount * ($dRepaymentRule_Percentage / 100);
                            $dLoanAmount -= $dRepaymentAmount;
                            //$iLoanTerm -= $iLoanTermsPassed;
                        }
                        else if ($dRepaymentRule_PercentageOf == 3) {	// x % of Loan Amount

                            $dRepaymentAmount = Number($dApprovedLoanAmount) * ((Number($dRepaymentRule_Percentage) / 100) / 10);
                            // die("$dApprovedLoanAmount * (($dRepaymentRule_Percentage/100)/10)");
                            $dLoanAmount -= $dRepaymentAmount;
                            $dBalanceAmount = $dLoanAmount;
                            $iBalanceEntry = 1;




                        } else
                            $dBalanceAmount = $dLoanAmount;

                    }
                }

                // console.log("--->$dRepaymentAmount", $dRepaymentAmount)
                // console.log("--->$dLoanAmount", $dLoanAmount)
                // console.log("--->$dBalanceAmount", $dBalanceAmount)
                // console.log("--->$iBalanceEntry", $iBalanceEntry)
                // console.log("--->$dBalanceAmount", $dBalanceAmount)
                if ($dRepaymentRule_AddBalanceAmount == 1) {
                    $dRepaymentAmount += $dPreviousBalance;
                    $dPreviousBalance = 0;
                }

                if ($dBalance > 0) {

                    $dBalance -= $dRepaymentAmount;
                }
                // console.log("--->$$dRepaymentAmount", $dRepaymentAmount)
                // console.log("--->$$dBalance", $dBalance)

                if ($i == ($iLoanTerm - 1)) {
                    $dRepaymentAmount += $dBalance;

                }

                // console.log(`Number(Number(${$dLoanAmount}) / Number(${$iLoanTerm}))`)
                // console.log(`Number(Number(${$dServiceCharges}) / Number(${$iLoanTerm}))`)

                var $dRepayment_PrincipalAmount = Number(Number($dLoanAmount) / Number($iLoanTerm));
                var $dRepayment_ServiceCharges = Number(Number($dServiceCharges) / Number($iLoanTerm));

                // console.log("--->", $dRepayment_PrincipalAmount);
                // console.log("--->", $dRepayment_ServiceCharges);


                //new code by aqureshi for half-installments loan 2012-01-17

                //                console.log(`Number(${$dRepaymentAmount}) / (1 + ((Number(${$dServiceChargesRate})/100) / Number(${$iRepaymentFrequencyInAYear})));`)
                // console.log(`Number(${$dRepaymentAmount}) - Number(${$dRepayment_PrincipalAmount})}`)

                $dRepayment_PrincipalAmount = Number($dRepaymentAmount) / (1 + ((Number($dServiceChargesRate) / 100) / Number($iRepaymentFrequencyInAYear)));
                $dRepayment_ServiceCharges = Number($dRepaymentAmount) - Number($dRepayment_PrincipalAmount);
                //end new code by aqureshi for half-installments loan 2012-01-17
                //              console.log("--->", $dRepayment_PrincipalAmount);
                //            console.log("--->", $dRepayment_ServiceCharges);

                if ($iRepaymentFrequencyInAYear > 1) {
                    //$dRepaymentAmount = $dApprovedLoanAmount * (($dRepaymentRule_Percentage/100)/10);
                    {
                        $dRepayment_PrincipalAmount = Number($dRepaymentAmount) / (1 + ((Number($dServiceChargesRate) / 100) / Number($iRepaymentFrequencyInAYear)));
                        $dRepayment_ServiceCharges = Number($dRepaymentAmount) - Number($dRepayment_PrincipalAmount);
                    }
                }

                var date = new Date(dRepaymentStartDate);

                var $dRepaymentDate: any = new Date(date.setMonth(date.getMonth() + $i));

                $dRepaymentDate = moment($dRepaymentDate).format("DD MMM YYYY");


                // $sLoanRepaymentSchedule .= '<tr onMouseOver="bgColor=\'#ffe69c\';" onMouseOut="bgColor=\'#efefee\';" bgcolor="#efefee">
                // 		<td>' . ($i+1) . '</td>
                // 		<td>' . date("F j, Y", strtotime($dRepaymentDate)) . '</td>
                // 		<td align="right">' . number_format($dRepayment_PrincipalAmount, 2) . '</td>
                // 		<td align="right">' . number_format($dRepayment_ServiceCharges, 2) . '</td>
                // 		<td align="right">' . number_format($dRepaymentAmount, 2) . '</td>
                // 		<td align="right">' . number_format($dBalance, 2) . '</td>
                // 		</tr>';
                if (Number(salaryIncome.value) > 0 && (Number($dRepaymentAmount) > Number(salaryIncome.value))) {
                    Alert.alert("Sorry", "Salary Income is less than Repayment Amount");
                    break;
                }
                totalFinancialIncome += Number($dRepayment_ServiceCharges)>0 ? Number($dRepayment_ServiceCharges) : 0;
                finalobj.push({
                    no: $i,
                    RepaymentDate: $dRepaymentDate,
                    PrincipalAmount: NumberFormater(Number($dRepayment_PrincipalAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    FinancialIncome: NumberFormater(Number($dRepayment_ServiceCharges).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    RepaymentAmount: NumberFormater(Number($dRepaymentAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    Balance: NumberFormater(Number($dBalance).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),

                })
                // //console.log(finalobj)

                $dTotalRepaymentAmount += $dRepaymentAmount;
                //console.log("--->indexer-->", $i + "===" + Number($iLoanTerm - 1))
                if ($i == Number($iLoanTerm - 1)) {

                    // let get=repaymets;
                    // var adder=get.concat(finalobj)
                    setLoader(false)
                    setResultShow(true)
                    setRepayments([...finalobj]);

                }

            }
        }
        let get = loanAmount;
        var adder=Number(Number(loanAmount.loanAmount.value)+Number(totalFinancialIncome))
        get["RepaymentAmount"] = NumberFormater(Number(loanAmount.loanAmount.value).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        get["FinancialIncome"] = NumberFormater(Number(totalFinancialIncome).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        
        get["Balance"] = NumberFormater(Number(adder).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        setLoanAmount({ ...get });

        console.log("--->totalFinancialIncome<---", totalFinancialIncome);

    }
    const handleAutoFinanceCalcalate = () => {
        setRepayments2([])
        setLoader2(true)
        var RepaymentFrequencyArray = ["12", "24", "3", "6", "1"];
        var ServiceChargesRate = loanAmount2.product?.object?.ServiceChargesRate;
        var LoanTerm = loanAmount2.loanTerm.value;
        var RepaymentFrequency = loanAmount2.repaymetsFrequency.object;
        var ownAmount: any = loanAmount2.productItem.object?.Price;
        var dRepaymentStartDate: any = loanAmount2.RepaymentStartDate;
        var downPaymentPercentage: any = loanAmount2.downPaymentPercentage.value;

        //console.log("=============== final===>");

        // console.log("ServiceChargesRate", ServiceChargesRate);
        // console.log("LoanTerm", LoanTerm);
        // console.log("ownAmount", ownAmount);
        // console.log("RepaymentFrequency", RepaymentFrequency);
        // console.log("dRepaymentStartDate", dRepaymentStartDate);
        // console.log("downPaymentPercentage", downPaymentPercentage);




        var Data = GetRepaymentFrequencyByName(RepaymentFrequency, LoanTerm);
        //console.log("=============== Data===>", Data);

        //console.log("=============== final===>");
        var iNumberOfRepayments = Data['NumberOfRepayments'];

        var DifferenceInMonths = Data['DifferenceInMonths'];

        var iNumberOfMonths = LoanTerm;
        if (loanAmount2.downPaymentPercentage.value != undefined) {
            ownAmount = Number(Number(ownAmount) - Number(downPaymentPercentage));
        }
        var dServiceCharges = Number((Number(ownAmount) * Number(LoanTerm))) * (Number(ServiceChargesRate) / 100) / Number(iNumberOfMonths);

        downPaymentPercentage = Number(ownAmount) * Number(Number(downPaymentPercentage) / 100);
        if (LoanTerm == '6')
            dServiceCharges = dServiceCharges * 0.5;
        else if (LoanTerm == '12')
            dServiceCharges = dServiceCharges * 1;
        else if (LoanTerm == '18')
            dServiceCharges = dServiceCharges * 1.5;
        else if (LoanTerm == '24')
            dServiceCharges = dServiceCharges * 2;

        var dTotalLoanAmount: any = Number(Number(ownAmount) + Number(dServiceCharges));


        var dBalance = dTotalLoanAmount;

        // let get = loanAmount;
        // get["RepaymentAmount"] = ownAmount;
        // get["FinancialIncome"] = dServiceCharges;
        // get["Balance"] = dBalance;
        // setLoanAmount({ ...get });

        setResultMaker(
            {
                pricipalAmount: NumberFormater(Number(ownAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                loanTerms: NumberFormater(Number(LoanTerm).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                financialIncomeRate: NumberFormater(Number(ServiceChargesRate).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                serviesCharge: NumberFormater(Number(dServiceCharges).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                totalLoanAmount: NumberFormater(Number(dTotalLoanAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                repaymentFrequency: loanAmount2.repaymetsFrequency.value,
                downpayment: NumberFormater(Number(downPaymentPercentage).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                productRegistrationFee: NumberFormater(Number(loanAmount2.productItem.object?.ProductRegistrationFee).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                ownAmount: NumberFormater(Number(ownAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                emergencyFund: 0,
                cibCharges: 0,
                nadraCharges: 0,
                repaymentAmount: NumberFormater(Number(ownAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                financialIncome: NumberFormater(Number(dServiceCharges).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                totalRepaymentAmount: NumberFormater(Number(dBalance).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),

            }
        )

        var finalobj = [];
        var loop = 0;
        for (var i = 1; i <= iNumberOfRepayments; i++) {
            var dRepaymentAmount = Number(dTotalLoanAmount) / Number(iNumberOfRepayments);

            var dServiceChargesNew = Number(Number(dRepaymentAmount) * Number(ServiceChargesRate)) / Number(dTotalLoanAmount);

            var dServiceCharges2: any = (Number(dServiceChargesNew) * Number(ownAmount)) / 100;

            if (LoanTerm == '6')
                dServiceCharges2 = Number(Number(dServiceCharges2) * 0.5);
            else if (LoanTerm == '12')
                dServiceCharges2 = Number(Number(dServiceCharges2) * 1);
            else if (LoanTerm == '18')
                dServiceCharges2 = Number(Number(dServiceCharges2) * 1.5);
            else if (LoanTerm == '24')
                dServiceCharges2 = Number(Number(dServiceCharges2) * 2);

            // $dServiceCharges = ($dRepaymentAmount * $iLoanTerm) * ($dServiceChargesRate / 100) / $iNumberOfMonths;

            var iPrincipalAmount = Number(Number(dRepaymentAmount) - Number(dServiceCharges2));


            if (i == 1)
                loop = 0;
            else
                loop += DifferenceInMonths;
            //console.log("loop==>", loop);

            var date = new Date(dRepaymentStartDate);

            var dRepaymentDate: any = new Date(date.setMonth(date.getMonth() + loop));

            dRepaymentDate = moment(dRepaymentDate).format("DD MMM YYYY");



            dBalance -= dRepaymentAmount;

            console.log("iPrincipalAmount", iPrincipalAmount);
            console.log("dServiceCharges2", dServiceCharges2);
            console.log("dRepaymentAmount", dRepaymentAmount);
            console.log("dBalance", dBalance);
         


            finalobj.push({
                no: i,
                RepaymentDate: dRepaymentDate,
                PrincipalAmount: NumberFormater(Number(iPrincipalAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                FinancialIncome: NumberFormater(Number(dServiceCharges2).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                RepaymentAmount: NumberFormater(Number(dRepaymentAmount).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                Balance: NumberFormater(Number(dBalance).toFixed()).replace(/\d(?=(\d{3})+\.)/g, '$&,'),

            })

        }
        //console.log("finalobj==>", finalobj);
        setRepayments2([...finalobj]);
        setLoader2(false)
        setResultShow2(true)
    }

    const GetRepaymentFrequency = (iRepaymentFrequency, iLoanTerm) => {
        var iNumberOfRepayments = 0;
        var DifferenceInMonths = 0;
        if (iRepaymentFrequency == 1) {
            iNumberOfRepayments = iLoanTerm;
            DifferenceInMonths = 1;// monthly
        }
        else if (iRepaymentFrequency == 2) {
            iNumberOfRepayments = iLoanTerm / 2;
            DifferenceInMonths = 2; // bi-monthly
        }
        else if (iRepaymentFrequency == 3) {
            iNumberOfRepayments = iLoanTerm / 3;
            DifferenceInMonths = 3;// quartely
        }
        else if (iRepaymentFrequency == 4) {
            iNumberOfRepayments = iLoanTerm / 6;
            DifferenceInMonths = 6; // 6 monthly
        }
        else if (iRepaymentFrequency == 5) {
            iNumberOfRepayments = iLoanTerm / 12;
            DifferenceInMonths = 12; // yearly
        }
        var Data = [];
        Data['NumberOfRepayments'] = iNumberOfRepayments;
        Data['DifferenceInMonths'] = DifferenceInMonths;

        return (Data);
    }


    const GetRepaymentFrequencyByName = (iRepaymentFrequency, iLoanTerm) => {
        var iNumberOfRepayments = 0;
        var DifferenceInMonths = 0;
        if (iRepaymentFrequency == 12) {
            iNumberOfRepayments = iLoanTerm;
            DifferenceInMonths = 1;// monthly
        }
        else if (iRepaymentFrequency == 24) {
            iNumberOfRepayments = iLoanTerm / 2;
            DifferenceInMonths = 2; // bi-monthly
        }
        else if (iRepaymentFrequency == 3) {
            iNumberOfRepayments = iLoanTerm / 3;
            DifferenceInMonths = 3;// quartely
        }
        else if (iRepaymentFrequency == 6) {
            iNumberOfRepayments = iLoanTerm / 6;
            DifferenceInMonths = 6; // 6 monthly
        }
        else if (iRepaymentFrequency == 1) {
            iNumberOfRepayments = iLoanTerm / 12;
            DifferenceInMonths = 12; // yearly
        }
        var Data = [];
        Data['NumberOfRepayments'] = iNumberOfRepayments;
        Data['DifferenceInMonths'] = DifferenceInMonths;

        return (Data);
    }





    const renderItem = (itemm) => {
        const { item } = itemm;
        return (
            <MultirowView
                text1={item.no}
                text2={item.RepaymentDate}
                text3={item.PrincipalAmount}
                text4={item.FinancialIncome}
                text5={item.RepaymentAmount}
                text6={item.Balance}

            />
        )
    }
    const getUserData = useSelector(state => state.UserData);
    const OrganizationType = Number(getUserData?.UserData?.OrganizationType);
    const loanLabel = OrganizationType === 2 ? 'Finance Facility' : 'Loan';
    const serviceChargesLabel = OrganizationType === 2 ? 'Markup into Profit' : 'Service Charges';
    return (
        <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
            <AppStatusBar />
            <View style={GlobalStyles.row}>

                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>

                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15, }}
                    text={`${loanLabel} Calculator`}></TextView>

            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                <Tabsitems
                    text={"Normal Calculator"}
                    active={index == 1 ? true : false}
                    onPress={() => { setIndex(1) }}

                />


                <Tabsitems
                    text={"AutoFinance Calculator"}
                    active={index == 2 ? true : false}
                    onPress={() => { setIndex(2) }}

                />






            </View>


            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ***************** TABS ********************** STARTS */}
                <View style={{}}>
                    {index == 1 &&
                        <View style={{ alignSelf: 'center', marginTop: 30, flex: 1 }}>
                            <View style={{ alignSelf: 'center' }}>
                                <FormInputs
                                    style={{ width: width / 1.2 }}
                                    keyboardtype={'number-pad'}
                                    text={`${loanLabel} Amount`}
                                    error={loanAmount.loanAmount.error}
                                    value={loanAmount.loanAmount.value}
                                    onChangeText={(value: string) => {

                                        let get = loanAmount;
                                        get.loanAmount.value = value;
                                        get.loanAmount.error = false;
                                        setLoanAmount({ ...get })

                                    }}></FormInputs>


                                {/* <FormInputs
                                    style={{ width: width / 1.2 }}
                                    keyboardtype={'number-pad'}
                                    text={'Donor'}
                                    editable={false}
                                    error={""}
                                    value={"SBP"}
                                    onChangeText={(value: string) => {

                                    }}></FormInputs>

                                <FormInputs
                                    keyboardtype={'number-pad'}
                                    text={'Project'}
                                    style={{ width: width / 1.2 }}
                                    editable={false}
                                    error={""}
                                    value={"State Bank - Line of Credit"}
                                    onChangeText={(value: string) => {

                                    }}></FormInputs> */}

                                <CustomDropdown
                                    style={{ width: width / 1.2 }}
                                    text={`${loanLabel} Product`}
                                    required={false}
                                    tempdata={loanProducts}
                                    label={
                                        loanAmount.loantype == "" ?
                                            `Select ${loanLabel} Product` : loanAmount.loantype
                                    }
                                    type={2}
                                    onSelect={async (value, underindex) => {
                                        let get = loanAmount;
                                        get.loantype = loanProducts[underindex].name;
                                        get.loanTypeObject = value;
                                        setLoanAmount({ ...get })
                                    }}
                                />

                                <FormInputs
                                    keyboardtype={'number-pad'}
                                    style={{ width: width / 1.2 }}
                                    text={'Client Savings'}
                                    error={salaryIncome.error}
                                    value={salaryIncome.value}
                                    onChangeText={(value: string) => {

                                        let get = salaryIncome;
                                        get.value = value;
                                        get.error = false;
                                        setSalaryIncome({ ...get })

                                    }}></FormInputs>

                                <DateSelector
                                    style={{ width: width / 1.2 }}
                                    title={
                                        loanAmount.startingDate == "" ?
                                            "Starting Date" : moment(loanAmount.startingDate).format('MMM Do YY')
                                    }
                                    setAlldataobj={setLoanAmount}
                                    allDataobj={loanAmount}
                                    setToast={setToast}
                                    fieldName={5}></DateSelector>

                                {/* {isLoader && <ActivityIndicator style={{ margin: 10 }} color={Colors.parrotGreenColor} />} */}
                                <TouchableOpacity
                                    onPress={_handleCalculate}
                                    style={styles.button}>
                                    <TextView style={{ color: '#FFF', alignSelf: 'center' }} text="Calculate"></TextView>

                                </TouchableOpacity>
                            </View>

                            {/* ***************** RESULTS ********************** STARTS */}
                            {index == 1 && resultShow &&

                                <View>
                                    <View style={styles.card}>
                                    <TextView style={{ fontSize: 20, marginTop: 10 }} text={`${loanLabel} Criteria`} />
                                        <View style={styles.underLine} />

                                        <RowView

                                            text={`${loanLabel} Amount `}
                                            value={"Rs. " + loanAmount.loanAmount.value}
                                        />
                                        <RowView

                                            text={"Loan Term "}
                                            value={"" + loanAmount.loanTypeObject?.LoanTerm}
                                        />
                                        <RowView

                                            text={"Financial Income Rate "}
                                            value={"" + loanAmount.loanTypeObject?.ServiceChargesRate + "%"}
                                        />
                                        <RowView

                                            text={"Repayment Frequency"}
                                            value={"" + aRepaymentFrequency[loanAmount.loanTypeObject?.RepaymentFrequency]}
                                        />

                                        <TextView style={{ fontSize: 20, marginTop: 30 }} text={`${loanLabel} Payments`} />
                                        <View style={styles.underLine} />

                                        <RowView

                                            text={"Repayment Amount"}
                                            value={"Rs. " + loanAmount?.RepaymentAmount}
                                        />
                                        <RowView

                                            text={"Financial Income"}
                                            value={"Rs." + loanAmount?.FinancialIncome}
                                        />
                                        <RowView

                                            text={"Total Repayment Amount"}
                                            value={"Rs." + loanAmount?.Balance}
                                        />
                                    </View>

                                    {/* ***************** REPAYMENTS   STARTS********************** */}

                                    <View style={{ margin: 5, width: width, padding: 10, alignSelf: 'center', }}>


                                        <ScrollView style={{}} horizontal={true}>
                                            <View>
                                            <TextView style={{ fontSize: 20, }} text={`${loanLabel} Repayment Schedule`} />

                                                <View style={styles.underLine} />
                                                <MultirowView
                                                    text1={"S#"}
                                                    text2={"Repayment Date"}
                                                    text3={"Principal Amount"}
                                                    text4={"Financial Income"}
                                                    text5={"Repayment Amount"}
                                                    text6={"Balance"}

                                                />

                                                {repaymets.length > 0 &&
                                                    <FlatList
                                                        data={repaymets}
                                                        renderItem={renderItem}
                                                        keyExtractor={(item,index) => index.toString()}
                                                    />

                                                }
                                            </View>
                                        </ScrollView>
                                    </View>

                                    {/* ***************** REPAYMENTS   STARTS********************** */}


                                </View>
                            }
                            {/* ***************** RESULTS ********************** STARTS */}

                        </View>}

                    {index == 2 &&
                        <View style={{ alignSelf: 'center', marginTop: 30, }}>
                            <View style={{ alignSelf: 'center' }}>
                                <CustomDropdown
                                    style={{ width: width / 1.2 }}
                                    text={"Products"}
                                    required={false}
                                    tempdata={autoFinanceloanProducts}
                                    label={loanAmount2.product.value == undefined ?
                                        'Select Product' : loanAmount2.product.value
                                    }
                                    type={2}
                                    onSelect={async (value, underindex) => {

                                        // console.log(value)
                                        let get = loanAmount2;
                                        get.product.value = autoFinanceloanProducts[underindex].name;
                                        get.product.object = value;

                                        setLoanAmount2({ ...get })
                                        if (value.Product_types?.length > 0) {
                                            // var parser=JSON.parse(value.Product_types);
                                            var parser = [];
                                            value.Product_types.map((item, index) => {
                                                parser.push({ ...item, name: item.LoanTypeName })
                                                if (index == value.Product_types.length - 1) {
                                                    setProductItems([...parser]);
                                                    //console.log(parser)
                                                }
                                            })



                                        }

                                        // setProductItems()

                                    }}
                                />

                                <CustomDropdown
                                    style={{ width: width / 1.2 }}
                                    text={"Product Item"}
                                    required={false}
                                    tempdata={productItems}
                                    label={loanAmount2.productItem.value == undefined ?
                                        'Select Item' : loanAmount2.productItem.value
                                    }
                                    type={2}
                                    onSelect={async (value, underindex) => {

                                        // console.log(value)
                                        let get = loanAmount2;
                                        get.productItem.value = productItems[underindex].name;
                                        get.productItem.object = value;
                                        setLoanAmount2({ ...get })
                                    }}
                                />

                                <CustomDropdown
                                    style={{ width: width / 1.2 }}
                                    text={`${loanLabel} Term`}
                                    required={false}
                                    tempdata={loanTermsArray}
                                    label={
                                        loanAmount2.loanTerm.value == undefined ?
                                            `Select ${loanLabel} Term` : loanAmount2.loanTerm.value
                                    }
                                    type={1}
                                    onSelect={async (value, underindex) => {

                                        //console.log(value)
                                        let get = loanAmount2;
                                        get.loanTerm.value = loanTermsArray[underindex];
                                        get.loanTerm.object = value;
                                        setLoanAmount2({ ...get })
                                    }}
                                />

                                <CustomDropdown
                                    style={{ width: width / 1.2 }}
                                    text={"Repayment Frequency"}
                                    required={false}
                                    tempdata={RepaymentFrequencys}
                                    label={loanAmount2.repaymetsFrequency.value == undefined ?
                                        'Select Frequency' : loanAmount2.repaymetsFrequency.value
                                    }
                                    type={2}
                                    onSelect={async (value, underindex) => {

                                        // console.log(value)
                                        let get = loanAmount2;
                                        get.repaymetsFrequency.value = RepaymentFrequencys[underindex].name;
                                        get.repaymetsFrequency.object = RepaymentFrequencys[underindex].value;
                                        setLoanAmount2({ ...get })
                                    }}
                                />
                                <FormInputs
                                    style={{ width: width / 1.2 }}
                                    keyboardtype={'number-pad'}
                                    text={'Down Payment Percentage'}
                                    error={loanAmount2.downPaymentPercentage.error}
                                    value={loanAmount2.downPaymentPercentage.value}
                                    onChangeText={(value: string) => {

                                        let get = loanAmount2;
                                        get.downPaymentPercentage.value = value;
                                        get.downPaymentPercentage.error = false;
                                        setLoanAmount2({ ...get })

                                    }}></FormInputs>
                                <View style={{ marginTop: 20 }} />

                                <DateSelector
                                    style={{ width: width / 1.2 }}
                                    title={
                                        loanAmount2.RepaymentStartDate == "" ?
                                            "Repayment Start Date" : moment(loanAmount2.RepaymentStartDate).format('MMM Do YY')
                                    }
                                    setAlldataobj={setLoanAmount2}
                                    allDataobj={loanAmount2}
                                    setToast={setToast}
                                    fieldName={9}></DateSelector>

                                {/* {loader2 && <ActivityIndicator style={{ margin: 10 }} color={Colors.parrotGreenColor} />} */}
                                <TouchableOpacity
                                    onPress={_handleAutoFinanceCalculate}
                                    style={styles.button}>
                                    <TextView style={{ color: '#FFF', alignSelf: 'center' }} text="Calculate"></TextView>

                                </TouchableOpacity>
                            </View>
                            {/* ***************** RESULTS ********************** STARTS */}
                            {index == 2 && resultShow2 &&

                                <View>
                                    <View style={styles.card}>
                                    <TextView style={{ fontSize: 20, marginTop: 10 }} text={`${loanLabel} Criteria`} />
                                        <View style={styles.underLine} />

                                        <RowView

                                            text={"Principal Amount "}
                                            value={"Rs. " + resultMaker.pricipalAmount + " (After Down Payment Deduction)"}
                                        />
                                        <RowView

                                            text={`${loanLabel} Term `}
                                            value={"" + resultMaker.loanTerms}
                                        />
                                        <RowView

                                            text={"Financial Income Rate "}
                                            value={"" + resultMaker.financialIncomeRate + "%"}
                                        />
                                        <RowView

                                            text={serviceChargesLabel}
                                            value={"" + resultMaker.serviesCharge + ""}
                                        />
                                        <RowView

                                            text={"Total ${loanLabel} Amont"}
                                            value={"" + resultMaker.totalLoanAmount}
                                        />
                                        <RowView

                                            text={"Repayment Frequency"}
                                            value={"" + resultMaker.repaymentFrequency}
                                        />
                                        <RowView

                                            text={"Down Payment Amount"}
                                            value={"" + resultMaker.downpayment}
                                        /><RowView

                                            text={"Product Registration Fees"}
                                            value={"" + resultMaker.productRegistrationFee}
                                        />

                                        <TextView style={{ fontSize: 20, marginTop: 30 }} text={`${loanLabel} Payments`} />
                                        <View style={styles.underLine} />

                                        <RowView

                                            text={"Repayment Amount"}
                                            value={"Rs. " + resultMaker.repaymentAmount}
                                        />
                                        <RowView

                                            text={"Financial Income"}
                                            value={"Rs." + resultMaker.financialIncome}
                                        />
                                        <RowView

                                            text={"Total Repayment Amount"}
                                            value={"Rs." + resultMaker.totalRepaymentAmount}
                                        />
                                    </View>

                                    {/* ***************** REPAYMENTS   STARTS********************** */}
                                    <View style={{ margin: 5, width: width, padding: 10, alignSelf: 'center' }}>
                                        <ScrollView horizontal={true}>
                                            <View>
                                            <TextView style={{ fontSize: 20, marginTop: 10, marginLeft: 20 }} text={`${loanLabel} Repayment Schedule`} />
                                                <View style={styles.underLine} />
                                                <MultirowView
                                                    text1={"S#"}
                                                    text2={"Repayment Date"}
                                                    text3={"Principal Amount"}
                                                    text4={"Financial Income"}
                                                    text5={"Repayment Amount"}
                                                    text6={"Balance"}

                                                />
                                                {repaymets2.length > 0 &&

                                                    <FlatList
                                                        data={repaymets2}
                                                        renderItem={renderItem}
                                                        keyExtractor={(item) => item.index}
                                                    />



                                                }

                                            </View>
                                        </ScrollView>
                                    </View>
                                    {/* ***************** REPAYMENTS   STARTS********************** */}


                                </View>
                            }
                            {/* ***************** RESULTS ********************** STARTS */}

                        </View>}

                </View>

                {/* ***************** TABS ********************** ENDS */}


            </ScrollView>
            <Toast {...toast} onDismiss={() => setToast({ message: "", type: "" })} />
        </SafeAreaView>

    )
}


export default LoanCalculator;
const styles = StyleSheet.create({
    row: { margin: 5, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' },
    button: {
        backgroundColor: Colors.parrotGreenColor,
        width: width / 2.5, height: 60, justifyContent: 'center',
        borderRadius: 10, elevation: 10, alignSelf: 'center'
    }, card: {
        borderRadius: 10, width: width / 1.1, alignSelf: 'center', elevation:
            10, margin: 20, padding: 10, backgroundColor: '#FFF'
    },
    txt11: { fontSize: 16, color: '#7d7d7d', fontWeight: 'bold', textAlign: 'center' },
    txt22: { fontSize: 16, color: '#000', fontWeight: 'bold', textAlign: 'center' },
    txt1: { fontSize: 12, color: '#7d7d7d', margin: 10, fontWeight: 'bold', textAlign: 'center' },
    txt2: { fontSize: 12, color: '#000', fontWeight: 'bold', margin: 10, textAlign: 'center' },
    underLine: {
        flexDirection: 'row', alignItems: 'center', height: 1,
        backgroundColor: Colors.parrotGreenColor, marginBottom: 20
    },
})