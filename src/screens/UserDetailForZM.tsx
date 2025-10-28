import React, { useState } from 'react';
import { SafeAreaView, View, Image, Dimensions, StyleSheet, Pressable, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextView } from '../components';
import { AppStatusBar, HeaderwithoutDialoge } from '../components';
import { GlobalStyles, Colors } from '../theme'
import UserDetailTable from '../components/UserDetailTable';
import { getUserDetailForZM } from '../apis_auth/apis';
import CustomerRiskProfileTabel from '../components/CustomerRiskProfileTable';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { getDownloadedDataforRegionalById } from '../sqlite/sqlitedb';
const { width, height } = Dimensions.get('window')
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define Redux state types
interface RootState {
    QuestionsReducer: {
        questionArray: any[];
    };
    // Add other reducers as needed
}
// Define a type for customerInfomation
interface CustomerInformation {
    ProfileImage?: string;
    FirstName?: string;
    LastName?: string;
    Guardian?: string;
    Gender?: string;
    DOB?: string;
    FamilyNumber?: string;
    MotherName?: string;
    CnicType?: string;
    NicNumber?: string;
    NICExpiry?: string;
    NICIssue?: string;
    IsDeceased?: string;
    IsDisabled?: string;
    Bisp?: string;
    StationName?: string;
    MaritalStatus?: string;
    Religion?: string;
    HouseStatus?: string;
    HouseType?: string;
    Address_Permanent_Country?: string;
    Address_Permanent_State?: string;
    Address_Permanent_District_Name?: string;
    Address_Permanent_Taluka_Name?: string;
    Address_Permanent_UC_Name?: string;
    Address_Permanent_Mohalla_Village?: string;
    Address_Permanent_City?: string;
    Address_Permanent_Address?: string;
    Address_Present_Country?: string;
    Address_Present_State?: string;
    Address_Present_District_Name?: string;
    Address_Present_Taluka_Name?: string;
    Address_Present_UC_Name?: string;
    Address_Present_Mohalla_Village?: string;
    Address_Present_City?: string;
    Address_Present_Address?: string;
    Address_Present_NumberOfYears?: string;
    PhoneNumber?: string;
    MobileNumber?: string;
    EmailAddress?: string;
    clientCurrentStatus?: string;
    ClientDisease?: string;
    clientHealthTests?: string;
    NextOfKinName?: string;
    NextOfKinCNIC?: string;
    NextOfKinRelation?: string;
    Answer1?: string;
    Answer2?: string;
    Answer3?: string;
    DebtRatio?: string;
    JobImagePath?: string;
    VerficationImagePath?: string;
    // Add other fields as needed
}
// Define a type for LoanInformation
interface LoanInformation {
    CustomerId?: string;
    IndividualLoans?: string;
    LoanId?: string;
    LoanStatus?: string;
    LoanTerm?: string;
    LoanSubType?: string;
    LoanApplicationDate?: string;
    RequestedLoanAmount?: string;
    PersonalCapitalInBusiness?: string;
    AmountRequiredForBusiness?: string;
    ApprovedLoanAmount?: string;
    TopUpLoan?: string;
    RepaymentFrequency?: string;
    TotalAssets?: string;
    ExpectedMonthlyIncomeFromBusiness?: string;
    IncomeFromSales?: string;
    AnyOtherRentalIncome?: string;
    MonthlyIncome?: string;
    RawMaterialPurchasing?: string;
    UtilityExpense?: string;
    SalariesAndLabourCharges?: string;
    AnyOtherExpense?: string;
    MonthlyExpense?: string;
    MonthlyInstallmentFromLender?: string;
    Liability?: string;
    BusinessAddress?: string;
    ExistingBusiness?: string;
    ExperienceInBusiness?: string;
    OtherFamilyIncome?: string;
    Household_MonthlyIncome?: string;
    HouseholdExpense?: string;
    ChildrenEducationExpense?: string;
    OtherUtilityExpense?: string;
    Household_onthlyExpense?: string;
    HouseholdLiability?: string;
    Household_Savings?: string;
    Savings?: string;
    GeographicRiskValue?: string;
    GeographicRisk?: number;
    GeographicRiskRemarks?: string;
    CustomerProductRiskValue?: string;
    CustomerProductRisk?: number;
    CustomerProductRiskRemarks?: string;
    PEPRiskValue?: string;
    PEPRisk?: number;
    PEPRiskRemarks?: string;
    LoanUtilizationRiskValue?: string;
    LoanUtilizationRisk?: number;
    LoanUtilizationRiskRemarks?: string;
}
const UserDetailForZM = (props) => {
    const { item } = props.route.params;



    const [customerInfomation, setCustomerInformation] = React.useState<CustomerInformation | null>(null);
    const [loanInformation, setLoanInformation] = React.useState<LoanInformation>({});
    const [povertyScoreCard, setPovertyScoreCard] = React.useState<any[]>([]);
    const [customerGurantees, setCustomerGurantees] = React.useState<any[]>([]);
    const [customerFamilyMember, setCustomerFamilyMember] = React.useState<any[]>([]);
    const [customerDocuments, setCustomerDocuments] = React.useState<any[]>([]);
    const [customerAssets, setCustomerAssets] = React.useState<any[]>([]);
    const [error, setError] = React.useState(false)
    const array_index = 0
    const [loader, setLoader] = useState(false)
    const GETQuestions = useSelector((state: RootState) => state.QuestionsReducer.questionArray);
    const [errorImages, setErrorImages] = useState<{ [key: number]: boolean }>({});
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
    const [modalImageSize, setModalImageSize] = useState<{width: number, height: number}>({width: width * 0.9, height: height * 0.7});

    const _onImageLoadError = (event) => {
        setError(true)
    }




    React.useEffect(() => {
        showUserData();

    }, [])

    const showUserData = async () => {
        setLoader(true)
        getDownloadedDataforRegionalById(item.CustomerGroupId)
            .then((datax: any) => {
                console.log('item:', item);
                console.log('datax:', datax);
                var parser = JSON.parse(datax[0]?.GroupData);
                console.log('parser:', parser);
                console.log('parser.Customers:', parser?.Customers);
                var indexer = parser?.Customers.findIndex(x => x.CustomerInformation?.NicNumber === item.NicNumber);
                console.log('indexer:', indexer);
                var data: any = parser?.Customers[indexer];
                if (!data) {
                    console.warn('Customer not found by NicNumber, using first customer as fallback');
                    data = parser?.Customers && parser.Customers.length > 0 ? parser.Customers[0] : undefined;
                }
                console.log('data:', data);
                setCustomerInformation(data?.CustomerInformation || null);
                setLoanInformation(data?.LoanInformation ? data.LoanInformation[0] : {});
                setPovertyScoreCard(data?.PovertyScoreCard || []);
                setCustomerGurantees(data?.CustomerGurantees || []);
                setCustomerFamilyMember(data.CustomerFamilyMember || [])
                setCustomerDocuments(
                    Array.isArray(data?.CustomerDocuments)
                        ? data.CustomerDocuments
                        : Object.values(data?.CustomerDocuments || {})
                );
                setCustomerAssets(data?.CustomerAssets || []);
                setLoader(false)
            }).catch((error) => {
                console.log(error)
                setLoader(false)
            })
    }
    const getUserDetailForZM_api = async (NicNumber: string) => {
        setLoader(true)
        getUserDetailForZM(NicNumber).then((data: any) => {

            console.log('==>>>',data.CustomerInformation)

            setCustomerInformation(data.CustomerInformation || null);
            setLoanInformation(data.LoanInformation[0])
            setPovertyScoreCard(data.PovertyScoreCard || []);
            setCustomerGurantees(data.CustomerGurantees || []);
            setCustomerFamilyMember(data.CustomerFamilyMember || [])
            setCustomerDocuments(
                Array.isArray(data?.CustomerDocuments)
                    ? data.CustomerDocuments
                    : Object.values(data?.CustomerDocuments || {})
            );
            setCustomerAssets(data.CustomerAssets || []);
            setLoader(false)
        }).catch((error) => {
            setLoader(false)
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

            <AppStatusBar></AppStatusBar>

            <View style={GlobalStyles.row}>

                <HeaderwithoutDialoge Theme={Colors} back={true}></HeaderwithoutDialoge>

                <TextView
                    type={'mini_heading22'}
                    style={{ paddingHorizontal: 30, marginTop: 55, fontSize: 15, }}
                    text="User Detail"
                    Icon={undefined}></TextView>

            </View>

            {/* <View style={{flex:1}}> */}

            {loader ?

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <LottieView
                        style={{ height: 120, width: 100, alignSelf: 'center' }}
                        source={require('../assests/anim/spinnerallcolor.json')}
                        // colorFilters={[{
                        //   keypath: "button",
                        //   color: "#F00000"
                        // },{
                        //   keypath: "Sending Loader",
                        //   color: "#F00000"
                        // }]}
                        autoPlay
                        loop
                    />
                </View>

                : <ScrollView
                    showsHorizontalScrollIndicator={false}

                //contentContainerStyle={{marginBottom:10}}
                >

                    <View style={styles.dataContainer}>

                        {/* Profile Image Section */}
                        <View style={styles.imageContainer}>
                            {error === false ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        if (customerInfomation?.ProfileImage) {
                                            Image.getSize(
                                                customerInfomation.ProfileImage,
                                                (w, h) => {
                                                    // scale to fit screen
                                                    let maxW = width * 0.95;
                                                    let maxH = height * 0.85;
                                                    let ratio = Math.min(maxW / w, maxH / h, 1);
                                                    setModalImageSize({ width: w * ratio, height: h * ratio });
                                                    setSelectedDocument(customerInfomation.ProfileImage || null);
                                                    setIsDocumentModalVisible(true);
                                                },
                                                () => {
                                                    setModalImageSize({ width: width * 0.9, height: height * 0.7 });
                                                    setSelectedDocument(customerInfomation.ProfileImage || null);
                                                    setIsDocumentModalVisible(true);
                                                }
                                            );
                                        }
                                    }}
                                >
                                    <Image
                                        onError={_onImageLoadError}
                                        source={
                                            !customerInfomation || !customerInfomation.ProfileImage
                                                ? require('../assests/images/placeholder.png')
                                                : { uri: customerInfomation.ProfileImage }
                                        }
                                        style={{ width: '100%', height: height / 3.5, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <Image
                                    source={require('../assests/images/placeholder.png')}
                                    style={{ width: '100%', height: height / 3.5, resizeMode: 'contain' }}
                                />
                            )}
                        </View>

                        <UserDetailTable
                            labelOne={'Firstname'}
                            valueOne={customerInfomation?.FirstName || ''}
                            labelTwo={'Lastname'}
                            valueTwo={customerInfomation?.LastName || ''}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Guradian/Father Name'}
                            valueOne={customerInfomation?.Guardian}
                            labelTwo={'Gender'}
                            valueTwo={customerInfomation?.Gender}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Date Of Birth'}
                            valueOne={customerInfomation?.DOB}
                            labelTwo={'Family Number'}
                            valueTwo={customerInfomation?.FamilyNumber}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true} 
                        />

                        <UserDetailTable
                            labelOne={'Mother Name'}
                            valueOne={customerInfomation?.MotherName}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Cnic Type'}
                            valueOne={customerInfomation?.CnicType}
                            labelTwo={'Cnic Number'}
                            valueTwo={customerInfomation?.NicNumber}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true} 
                        />

                        <UserDetailTable
                            labelOne={'Nic Expiry'}
                            valueOne={customerInfomation?.NICExpiry}
                            labelTwo={'Nic Issue'}
                            valueTwo={customerInfomation?.NICIssue}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Is Deceased'}
                            valueOne={customerInfomation?.IsDeceased}
                            labelTwo={'Is Disabled'}
                            valueTwo={customerInfomation?.IsDisabled}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Is BISP Beneficiary'}
                            valueOne={customerInfomation?.Bisp}
                            labelTwo={'Station'}
                            valueTwo={customerInfomation?.StationName}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Additional Information"} style={{ textDecorationLine: 'underline', }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'Marital Status'}
                            valueOne={customerInfomation?.MaritalStatus}
                            labelTwo={'Religion'}
                            valueTwo={customerInfomation?.Religion}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'House Status'}
                            valueOne={customerInfomation?.HouseStatus}
                            labelTwo={'House Type'}
                            valueTwo={customerInfomation?.HouseType}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Address"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Permanent Address"} style={{ textDecorationLine: 'underline', fontSize: 12 }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'Country'}
                            valueOne={customerInfomation?.Address_Permanent_Country}
                            labelTwo={'State/Provence'}
                            valueTwo={customerInfomation?.Address_Permanent_State}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'District'}
                            valueOne={customerInfomation?.Address_Permanent_District_Name}
                            labelTwo={'Taluka'}
                            valueTwo={customerInfomation?.Address_Permanent_Taluka_Name}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'UC'}
                            valueOne={customerInfomation?.Address_Permanent_UC_Name}
                            labelTwo={'Mohalla/Village'}
                            valueTwo={customerInfomation?.Address_Permanent_Mohalla_Village}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'City'}
                            valueOne={customerInfomation?.Address_Permanent_City}
                            labelTwo={'Address '}
                            valueTwo={customerInfomation?.Address_Permanent_Address}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Present Address"} style={{ textDecorationLine: 'underline', fontSize: 12 }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'Country '}
                            valueOne={customerInfomation?.Address_Present_Country}
                            labelTwo={'State/Provence'}
                            valueTwo={customerInfomation?.Address_Present_State}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'District'}
                            valueOne={customerInfomation?.Address_Present_District_Name}
                            labelTwo={'Taluka'}
                            valueTwo={customerInfomation?.Address_Present_Taluka_Name}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'UC'}
                            valueOne={customerInfomation?.Address_Present_UC_Name}
                            labelTwo={'Mohalla/Village'}
                            valueTwo={customerInfomation?.Address_Present_Mohalla_Village}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'City'}
                            valueOne={customerInfomation?.Address_Present_City}
                            labelTwo={'Address '}
                            valueTwo={customerInfomation?.Address_Present_Address}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Number of years at present address'}
                            valueOne={customerInfomation?.Address_Present_NumberOfYears}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Contact Information"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'Phone Number '}
                            valueOne={customerInfomation?.PhoneNumber}
                            labelTwo={'Mobile Number'}
                            valueTwo={customerInfomation?.MobileNumber}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Email Address'}
                            valueOne={customerInfomation?.EmailAddress}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Current Status'}
                            valueOne={customerInfomation?.clientCurrentStatus}
                            labelTwo={'Client Disease'}
                            valueTwo={customerInfomation?.ClientDisease}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Client Health Tests'}
                            valueOne={customerInfomation?.clientHealthTests}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Next Of Kin Name'}
                            valueOne={customerInfomation?.NextOfKinName}
                            labelTwo={'Next Of Kin NICNumber'}
                            valueTwo={customerInfomation?.NextOfKinCNIC}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Next Of Kin Relation'}
                            valueOne={customerInfomation?.NextOfKinRelation}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Is the borrower politically exposed Person?'}
                            valueOne={customerInfomation?.Answer1}
                            labelTwo={''}
                            valueTwo={''}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Is the borrower non-resident (oversees)?'}
                            valueOne={customerInfomation?.Answer2}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Is the borrower Beneficial owner?'}
                            valueOne={customerInfomation?.Answer3}
                            labelTwo={' '}
                            valueTwo={''}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />


                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Employment"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>


                        <UserDetailTable
                            labelOne={'Is Customer Employed?'}
                            valueOne={''}
                            labelTwo={''}
                            valueTwo={''}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Job Card / Salary Slip'}
                            valueOne={''}
                            valueTwo={''}
                            colOneImage={customerInfomation?.JobImagePath}
                            labelTwo={'E-Verisys Verfication'}
                            colTwoImage={customerInfomation?.VerficationImagePath}
                            //rowtwo={true}
                            imageRow={true}
                        />


                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Family Member Information"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>

                        {Array.isArray(customerFamilyMember) && customerFamilyMember.map((item, index) => {
                            return (
                                <React.Fragment key={`family-member-${index}-${item?.NICNumber || 'unknown'}`}>
                                    <UserDetailTable
                                        labelOne={'Full Name'}
                                        valueOne={item.FullName}
                                        labelTwo={'NIC Number'}
                                        valueTwo={item.NICNumber}
                                        rowtwo={true}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        labelOne={'Gender'}
                                        valueOne={item.Gender}
                                        labelTwo={'Education'}
                                        valueTwo={item.Education}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        labelOne={'Source Of Income'}
                                        valueOne={item.SourceOfIncome}
                                        labelTwo={'Relation'}
                                        valueTwo={item.RelationshipWithCustomer}
                                        rowtwo={true}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        labelOne={'Age'}
                                        valueOne={item.Age}
                                        labelTwo={'Monthly Earning'}
                                        valueTwo={item.MonthlyEarning}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        labelOne={'Business Address'}
                                        valueOne={item.BusinessAddress}
                                        labelTwo={''}
                                        valueTwo={''}
                                        rowtwo={true}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                </React.Fragment>
                            )
                        })}
                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Assets"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>

                        {Array.isArray(customerAssets) && customerAssets.length > 0 && customerAssets.map((item, index) => {
                            return (
                                <View key={`asset-${index}-${item?.asset?.AssetName || 'unknown'}`}>
                                    <UserDetailTable
                                        labelOne={'Asset Name'}
                                        valueOne={item?.asset?.AssetName}
                                        labelTwo={'Asset Quantity'}
                                        valueTwo={item?.asset?.AssetQuantity}
                                        rowtwo={true}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        labelOne={'Asset Value'}
                                        valueOne={item?.asset?.AssetValue}
                                        labelTwo={'Asset Owner'}
                                        valueTwo={item?.asset?.AssetOwner}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    {item?.images?.length > 0 && item?.images?.map((img, imgIdx) => {
                                        return (
                                            <View key={`asset-image-${index}-${imgIdx}-${img || 'unknown'}`}>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        Image.getSize(
                                                            img,
                                                            (w, h) => {
                                                                let maxW = width * 0.95;
                                                                let maxH = height * 0.85;
                                                                let ratio = Math.min(maxW / w, maxH / h, 1);
                                                                setModalImageSize({ width: w * ratio, height: h * ratio });
                                                                setSelectedDocument(img || null);
                                                                setIsDocumentModalVisible(true);
                                                            },
                                                            () => {
                                                                setModalImageSize({ width: width * 0.9, height: height * 0.7 });
                                                                setSelectedDocument(img || null);
                                                                setIsDocumentModalVisible(true);
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <Image
                                                        style={{ resizeMode: 'contain', height: height / 2, width: width / 1.1, alignSelf: 'center', margin: 10 }}
                                                        source={{ uri: img }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            )
                        })}

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Gurantees"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>

                        {Array.isArray(customerGurantees) && customerGurantees.length > 0 && customerGurantees.map((item, index) => {
                            return (
                                <View key={`guarantor-${index}-${item?.NICNumber || 'unknown'}`}>
                                    <UserDetailTable
                                        key={`guarantor-${index}-fullname-1`}
                                        labelOne={'Full Name'}
                                        valueOne={item?.FullName}
                                        labelTwo={'NIC Number'}
                                        valueTwo={item?.NICNumber}
                                        rowtwo={true}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        key={`guarantor-${index}-address-1`}
                                        labelOne={'Address '}
                                        valueOne={item?.Address}
                                        labelTwo={'Contact Number '}
                                        valueTwo={item?.ContactNumber}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        key={`guarantor-${index}-jobtype-1`}
                                        labelOne={'Job Type '}
                                        valueOne={item?.JobType}
                                        labelTwo={'Job Description'}
                                        valueTwo={item?.JobDescription}
                                        rowtwo={true}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                    <UserDetailTable
                                        key={`guarantor-${index}-business-1`}
                                        labelOne={'Business Address'}
                                        valueOne={item?.BusinessAddress}
                                        labelTwo={'Status'}
                                        valueTwo={item?.Status}
                                        colOneImage={undefined}
                                        colTwoImage={undefined}
                                    />
                                </View>
                            )
                        })}

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Customer Loan Information"} style={{ textDecorationLine: 'underline' }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'CustomerId'}
                            valueOne={loanInformation?.CustomerId}
                            labelTwo={'Is Individual'}
                            valueTwo={loanInformation?.IndividualLoans}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Loan Id'}
                            valueOne={loanInformation?.LoanId}
                            labelTwo={'Loan Status'}
                            valueTwo={loanInformation?.LoanStatus}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Loan Term'}
                            valueOne={loanInformation?.LoanTerm}
                            labelTwo={'Loan Type'}
                            valueTwo={loanInformation?.LoanSubType}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />


                        <UserDetailTable
                            labelOne={'Loan Sub Type'}
                            valueOne={loanInformation?.LoanSubType}
                            labelTwo={'Loan Application Date'}
                            valueTwo={loanInformation?.LoanApplicationDate}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Requested Loan Amount'}
                            valueOne={loanInformation?.RequestedLoanAmount}
                            labelTwo={'Personal Capital In Business'}
                            valueTwo={loanInformation?.PersonalCapitalInBusiness}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />
                        <UserDetailTable
                            labelOne={'Amount Required For Business'}
                            valueOne={loanInformation?.AmountRequiredForBusiness}
                            labelTwo={'Approved Loan Amount'}
                            valueTwo={loanInformation?.ApprovedLoanAmount}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <UserDetailTable
                            labelOne={'Top Up Loan'}
                            valueOne={loanInformation?.TopUpLoan}
                            labelTwo={'Debt Ratio'}
                            valueTwo={customerInfomation?.DebtRatio}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Repayment Frequency'}
                            valueOne={loanInformation?.RepaymentFrequency}
                            labelTwo={'Total Assets'}
                            valueTwo={loanInformation?.TotalAssets}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />

                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Additional Business Information"} style={{ textDecorationLine: 'underline', fontSize: 12 }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'Expected Monthly Income From Business'}
                            valueOne={loanInformation?.ExpectedMonthlyIncomeFromBusiness}
                            labelTwo={'Income From Sales\t'}
                            valueTwo={loanInformation?.IncomeFromSales}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />
                        <UserDetailTable
                            labelOne={'Rental Income / Any Other Income\t'}
                            valueOne={loanInformation?.AnyOtherRentalIncome}
                            labelTwo={'Monthly Income\t'}
                            valueTwo={loanInformation?.MonthlyIncome}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />
                        <UserDetailTable
                            labelOne={'Monthly Raw / Business Material Purchasing\t\t'}
                            valueOne={loanInformation?.RawMaterialPurchasing}
                            labelTwo={'Utility Expense'}
                            valueTwo={loanInformation?.UtilityExpense}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />
                        <UserDetailTable
                            labelOne={'Salaries Wages And Labour\t'}
                            valueOne={loanInformation?.SalariesAndLabourCharges}
                            labelTwo={'Other Expense'}
                            valueTwo={loanInformation?.AnyOtherExpense}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />
                        <UserDetailTable
                            labelOne={'Monthly Business Expense'}
                            valueOne={loanInformation?.MonthlyExpense}
                            labelTwo={'Any Other Monthly Liability'}
                            valueTwo={loanInformation?.AnyOtherExpense}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />
                        <UserDetailTable
                            labelOne={'Monthly Installment From Lender'}
                            valueOne={loanInformation?.MonthlyInstallmentFromLender}
                            labelTwo={'Monthly Business Liability\t'}
                            valueTwo={loanInformation?.Liability}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />
                        <UserDetailTable
                            labelOne={'Business Address'}
                            valueOne={loanInformation?.BusinessAddress}
                            labelTwo={'Existing Business'}
                            valueTwo={loanInformation?.ExistingBusiness}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />
                        <UserDetailTable
                            labelOne={'Experience In Business\t'}
                            valueOne={loanInformation?.ExperienceInBusiness}
                            labelTwo={''}
                            valueTwo={''}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />


                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"House Hold Cash Flow"} style={{ textDecorationLine: 'underline', fontSize: 12 }} type={"body"} Icon={undefined} />

                        </View>

                        <UserDetailTable
                            labelOne={'Income From Other Income\t'}
                            valueOne={'nhn mila'}
                            labelTwo={'Other Family Income'}
                            valueTwo={loanInformation?.OtherFamilyIncome}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Any Other Income/Rental Income (If Any)\t'}
                            valueOne={loanInformation?.AnyOtherRentalIncome}
                            labelTwo={'Household Monthly Income\t'}
                            valueTwo={loanInformation?.Household_MonthlyIncome}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />


                        <UserDetailTable
                            labelOne={'Kitchen / Household Expense\t'}
                            valueOne={loanInformation?.HouseholdExpense}
                            labelTwo={'Children Education Expense\t'}
                            valueTwo={loanInformation?.ChildrenEducationExpense}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Other Utility Expenses\t'}
                            valueOne={loanInformation?.OtherUtilityExpense}
                            labelTwo={'Any Other Expense\t'}
                            valueTwo={loanInformation?.AnyOtherExpense}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />


                        <UserDetailTable
                            labelOne={'Household Monthly Expense\t'}
                            valueOne={loanInformation?.Household_onthlyExpense}
                            labelTwo={'Monthly Household Liability\t'}
                            valueTwo={loanInformation?.HouseholdLiability}
                            rowtwo={true}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        />

                        <UserDetailTable
                            labelOne={'Net Household Income/Savings\t'}
                            valueOne={loanInformation?.Household_Savings}
                            labelTwo={'Business Savings'}
                            valueTwo={loanInformation?.Savings}
                            colOneImage={undefined}
                            colTwoImage={undefined}
                        //rowtwo={true}
                        />


                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"AML/CFT Customer Risk Profiling"} style={{ textDecorationLine: 'underline', }} type={"body"} Icon={undefined} />

                        </View>


                        <CustomerRiskProfileTabel
                            colOneMainHeading={'AML Risks to Microfinance Borrower'}
                            colTwoMainHeading={'AML/CFT Risks'}
                            colThreeMainHeading={'Risk Profiling'}
                            colFourMainHeading={'EDD Comments(For Medium And High Risk Only'}
                            rowOnesubHeading={'Geographic Risk'}
                            rowOneColOne={loanInformation?.GeographicRiskValue}
                            rowOneColTwo={loanInformation?.GeographicRisk == 0 ? "Low" : loanInformation?.GeographicRisk == 0.5 ? "Medium" : "High"}
                            rowOneColThree={loanInformation?.GeographicRiskRemarks}
                            rowTwosubHeading={'Customer & Product Risk'}
                            rowTwoColOne={loanInformation?.CustomerProductRiskValue}
                            rowTwoColTwo={loanInformation?.CustomerProductRisk == 0 ? "Low" : loanInformation?.CustomerProductRisk == 0.5 ? "Medium" : "High"}
                            rowTwoColThree={loanInformation?.CustomerProductRiskRemarks}
                            rowThreesubHeading={'PEP Risk'}
                            rowThreeColOne={loanInformation?.PEPRiskValue}
                            rowThreeColTwo={loanInformation?.PEPRisk == 0 ? "Low" : loanInformation?.PEPRisk == 0.5 ? "Medium" : "High"}
                            rowThreeColThree={loanInformation?.PEPRiskRemarks}
                            rowFoursubHeading={'Loan Utilization Risk (UBO of the loan)'}
                            rowFourColOne={loanInformation?.LoanUtilizationRiskValue}
                            rowFourColTwo={loanInformation?.LoanUtilizationRisk == 0 ? "Low" : loanInformation?.LoanUtilizationRisk == 0.5 ? "Medium" : "High"}
                            rowFourColThree={loanInformation?.LoanUtilizationRiskRemarks}
                        />


                        <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                            <TextView text={"Poverty Score Card"} style={{ textDecorationLine: 'underline', }} type={"body"} Icon={undefined} />


                        </View>


                        {Array.isArray(povertyScoreCard) && povertyScoreCard.length > 0 && (
                            <>
                                <UserDetailTable
                                    labelOne={"Question 1"}
                                    valueOne={GETQuestions[0]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[0]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 2"}
                                    valueOne={GETQuestions[1]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[1]}
                                    rowtwo={false}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 3"}
                                    valueOne={GETQuestions[2]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[2]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 4"}
                                    valueOne={GETQuestions[3]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[3]}
                                    rowtwo={false}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 5"}
                                    valueOne={GETQuestions[4]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[4]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 6"}
                                    valueOne={GETQuestions[5]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[5]}
                                    rowtwo={false}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 7"}
                                    valueOne={GETQuestions[6]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[6]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 8"}
                                    valueOne={GETQuestions[7]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[7]}
                                    rowtwo={false}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 9"}
                                    valueOne={GETQuestions[8]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[8]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 10"}
                                    valueOne={GETQuestions[9]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[9]}
                                    rowtwo={false}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 11"}
                                    valueOne={GETQuestions[10]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[10]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 12"}
                                    valueOne={GETQuestions[11]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[11]}
                                    rowtwo={false}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                                <UserDetailTable
                                    labelOne={"Question 13"}
                                    valueOne={GETQuestions[12]?.Question}
                                    labelTwo={"Answer"}
                                    valueTwo={povertyScoreCard[12]}
                                    rowtwo={true}
                                    colOneImage={undefined}
                                    colTwoImage={undefined}
                                />
                            </>
                        )}

                    </View>

                    <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>

                        <TextView text={"Customer Document"} style={{ textDecorationLine: 'underline', }} type={"body"} Icon={undefined} />

                    </View>

                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        {customerDocuments.length === 0 ? (
                            <TextView
                                text="No documents found."
                                style={{ textAlign: 'center', marginTop: 20 }}
                                type="body"
                                Icon={undefined}
                            />
                        ) : (
                            <>
                                {Array.from({ length: Math.ceil(customerDocuments.length / 2) }).map((_, rowIdx) => (
                                    <View key={rowIdx} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                                        {[0, 1].map(colIdx => {
                                            const idx = rowIdx * 2 + colIdx;
                                            if (idx >= customerDocuments.length) return null;
                                            const url = customerDocuments[idx];
                                            const key = typeof url === 'string' ? url : url?.url || idx;
                                            return errorImages[idx] ? (
                                                <Image
                                                    key={key}
                                                    source={require('../assests/images/placeholder.png')}
                                                    style={{ width: width / 2.3, height: 200, marginHorizontal: 5, resizeMode: 'contain' }}
                                                />
                                            ) : (
                                                <TouchableOpacity
                                                    key={key}
                                                    onPress={() => {
                                                        const docUrl = typeof url === 'string' ? url : url?.url;
                                                        Image.getSize(
                                                            docUrl,
                                                            (w, h) => {
                                                                let maxW = width * 0.95;
                                                                let maxH = height * 0.85;
                                                                let ratio = Math.min(maxW / w, maxH / h, 1);
                                                                setModalImageSize({ width: w * ratio, height: h * ratio });
                                                                setSelectedDocument(docUrl || null);
                                                                setIsDocumentModalVisible(true);
                                                            },
                                                            () => {
                                                                setModalImageSize({ width: width * 0.9, height: height * 0.7 });
                                                                setSelectedDocument(docUrl || null);
                                                                setIsDocumentModalVisible(true);
                                                            }
                                                        );
                                                    }}
                                                    activeOpacity={0.8}
                                                >
                                                    <Image
                                                        source={{ uri: typeof url === 'string' ? url : url?.url }}
                                                        style={{ width: width / 2.3, height: 200, marginHorizontal: 5, resizeMode: 'contain' }}
                                                        onError={() => setErrorImages(prev => ({ ...prev, [idx]: true }))}
                                                    />
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                ))}
                                {/* Modal for document preview */}
                                <Modal
                                    visible={isDocumentModalVisible}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setIsDocumentModalVisible(false)}
                                >
                                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{ position: 'absolute', top: 40, right: 20, zIndex: 2 }}
                                            onPress={() => setIsDocumentModalVisible(false)}
                                        >
                                            <Icon name="close" size={40} color="#fff" />
                                        </TouchableOpacity>
                                        {selectedDocument && (
                                            <Image
                                                source={{ uri: selectedDocument }}
                                                style={{ width: modalImageSize.width, height: modalImageSize.height, resizeMode: 'contain', borderRadius: 10 }}
                                            />
                                        )}
                                    </View>
                                </Modal>
                            </>
                        )}
                    </View>

                </ScrollView>}

            {/* </View> */}

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    dataContainer: {

        padding: 10
    },
    table: { marginTop: 10 },
    imageContainer: {
        marginTop: 10,elevation:20,borderRadius:10,backgroundColor:'#FFF',
marginBottom:10    },
    rowOne: { flexDirection: 'row', padding: 8 },
    rowTwo: { flexDirection: 'row', backgroundColor: '#D6EEEE', padding: 8, },
    value: { fontSize: 12, },
    columnOne: { flex: 1, },
    label: { fontSize: 12, color: '#000', fontWeight: 'bold' },
    columnTwo: { flex: 1, },
    addAssetBtn: {
        backgroundColor: Colors.green,
        padding: 10,
        borderRadius: 10,
        elevation: 10,
    },
    row: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-around' }
})

export default UserDetailForZM