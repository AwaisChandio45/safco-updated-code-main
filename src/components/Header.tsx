import React, {memo, useEffect} from 'react';
import {Animated, View, Pressable, BackHandler} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useNavigation} from '@react-navigation/native';
import {Colors} from '../theme';
import {CustomGetDataModule} from '../utilis/RequiredArrays';
import AskingDialoge from './AskingDialoge';
import {ClientSurvey} from '../utilis/ClientSurvey';
import {DeleteCustomersFormsTemp} from '../sqlite/sqlitedb';
import {useSelector, useDispatch, connect} from 'react-redux';

// ScreenNo==1 ------Add Customer
// ScreeNO==2 =======Add Group
// ScreenNo=3========Client Survey form
const Header = ({Theme, back = false, screenNo, noBack = false}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const TempFormReducer = useSelector(state => state.TempFormReducer);
  var updateCheckTemp = TempFormReducer.tempForm.value;
  console.log('updateCheckTemp', updateCheckTemp);
  const StationReducer = useSelector(state => state.StationReducer);
  const getUserData = useSelector(state => state.UserData);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  useEffect(() => {
    if (back) {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      };
    }
  }, []);
  function handleBackButtonClick() {
    // alert('works')
    if (back) {
      setDialogVisible(true);
    } else {
      setDialogVisible(true);
    }
    return true;
    // navigation.goBack();
  }
  const _onYesPress = () => {
    if (screenNo == 1) {
      dispatch({
        type: 'CustomGetDataModule',
        payload: {
          customerInfo: [
            {
              resetId: undefined,
              //-------------------------------Customer immage
              customer_biomatric: undefined,
              customer_img: undefined,
              //-------------------------------Customer  info
              customer_name: {value: '', error: false},
              customer_surname: {value: '', error: false},
              customer_fatherName: {value: '', error: false},
              customer_dob: undefined,
              customer_gender: undefined,
              customer_location: undefined,

              //-------------------------------Customer personal info
              customer_mobileNumber: {value: '', error: false},
              customer_motherName: {value: '', error: false},
              customer_cnicNumber: {value: '', error: false},
              customer_region: undefined,
              customer_cnicissueDate: undefined,
              customer_cnicExpireDate: undefined,
              customer_maritialStatus: undefined,
              FamilyNumber: {value: '', error: false},

              //---------------------------------------Customer Additional info
              customer_religion: undefined,
              customer_houseStatus: undefined,
              customer_houseType: undefined,
              customer_bispBeneficary: undefined,
              customer_userType: undefined,
              customer_guardianceCnic: {value: '', error: false},
              customer_guardianceOf: undefined,
              customer_guardianceOfName: {value: '', error: false},
              customer_education: undefined,
              //-------------------------------------------Customer Kin
              customer_nextKinName: {value: '', error: false},
              customer_nextKinRelation: undefined,
              customer_nextKinCnic: {value: '', error: false},
              customer_nextKinOtherRelation: {value: '', error: false},

              //---------------------------------------------Customer Present
              customer_pre_country: {value: 'Pakistan', error: false},
              customer_pre_stateProvince: {value: '', index: ''},
              customer_pre_district: {value: '', index: ''},
              customer_pre_taluka: {value: '', index: ''},
              customer_pre_uc: {value: '', index: ''},
              customer_pre_mohalla: {value: '', index: ''},
              customer_pre_city: {value: '', error: false},
              customer_pre_address: {value: '', error: false},
              //-------------------------------Customer permenant
              customer_per_country: {value: 'Pakistan', error: false},
              customer_per_stateProvince: {value: '', index: ''},
              customer_per_district: {value: '', index: ''},
              customer_per_taluka: {value: '', index: ''},
              customer_per_uc: {value: '', index: ''},
              customer_per_mohalla: {value: '', index: ''},
              customer_per_city: {value: '', error: false},
              customer_per_address: {value: '', error: false},
              numberOfyear: {value: '', error: false},
              addressnotes: {value: '', error: false},
              customer_isEmployeed: false,
              customer_jobCard: undefined,
              // ********************************Evrisys
              evrisys_customerImage: undefined,
              //-------------------------------Supporting Person Undertaking
              customer_supportingPerson_name: {value: '', error: false},
              customer_supportingRequiredPerson_name: {value: '', error: false},
              customer_supportingRequiredPerson_fathername: {
                value: '',
                error: false,
              },
              customer_supportingPerson_cnic: {value: '', error: false},
              customer_supportingPerson_relation: {value: '', error: false},
              customer_supportingPerson_fingerprint: undefined,


              //--------------------------------Account DEtail
              transferType: 'COC',
              accountNumber: { value: '', error: false },
              accountType: { value: '', error: false },
              accountTitle: { value: '', error: false },
              bankName: { value: '', error: false },
              branchName: { value: '', error: false },
              bankCode: { value: '', error: false },
              //--------------------------------Customer Health
              customer_disable: false,
              customer_health: {value: '', error: false},
              customer_physicalHealth: undefined,
              customer_anyillness: undefined,
              customer_disease: undefined,
              customer_token: {value: '', error: false},
              customer_labourtytestintwoyear: undefined,
            },
          ],
          loanInfo: [
            {
              //-----------------------------------Loan info
              customerLoan_type: undefined,
              selectRepaymentFrequency: undefined,
              loanType: undefined,
              loanSubType: undefined,
              loanPercentage: {value: '0', error: false},
              calculatedPercentage: {value: '0', error: false},
              requestedLoan: {value: '0', error: false},
              approvedLoan: {value: '0', error: false},
              numericalValue: {value: '0', error: false}, //my  codde new
              loanTerm: {value: '', error: false},
              loanStatus: {value: 'Processed', index: 0},
              personalCapitalinBusiness: {value: '', error: false},
              amountRequiredforBusiness: {value: '', error: false},
              expectedMonthlyIncome: {value: '', error: false},
              incomeFromSales: {value: '', error: false},
              rentalIncome: {value: '', error: false},
              monthlyIncome: {value: '', error: false},
              businessAddress: {value: '', error: false},
              businessName: {value: '', error: false},
              experianceinBusiness: {value: '', error: false},
              loanDate: undefined,
              loanNote: {value: '', error: false},
              doyouwantTopupLoan: undefined,
              doyouwantSolarTopupLoan: 0,
              topupLoantype: undefined,
              topupLoanValue: 0,
              topupLoanQty: undefined,
              occupation: {value: '', error: false},
              occupationType: undefined,
              vendorCnic: {value: '', error: false},
              vendorName: {value: '', error: false},
              vendorShopName: {value: '', error: false},
              vendorMobileNumber: {value: '', error: false},
              vendorProductName: {value: '', error: false},
              vendorProductPrice: {value: '', error: false},
              ProductCompanyName: {value: '', error: false},
              vendorCnicImages: [
                {
                  cnicFront: {imgValue: ''},
                  cnicBack: {imgValue: ''},
                },
              ],
              no_of_emploee: {value: '', error: false},
              PersonalJobDepartment: undefined,
              PersonalJobDesignation: {value: '', error: false},
              PersonalLoanJobType: undefined,
              IsAutofinance: '0',
              AutofinanceDefaultPercentage: 0,
              AutofinanceProductPercentage: '0',
              AutofinanceProductPercentagevalue: {value: '0', error: false},
              AutofinanceProductPrice: '',
              IsEbanking: '0',

              //--------------------------------Monthly Expenses
              rawMaterialpurchase: {value: '', error: false},
              utilityExpense: {value: '', error: false},
              salariesandLabourCharges: {value: '', error: false},
              otherExpenses: {value: '', error: false},
              monthlyExpenses: {value: '', error: false},
              //-------------------------------------Libailty
              monthlyInstallment: {value: '', error: false},
              anyOtherMonthly: {value: '', error: false},
              liability: {value: '', error: false},
              businessSavings: {value: '', error: false},

              //------------------------------------MonthlyHouseHold Income
              incomefromOtherSource: {value: '', error: false},
              otherFamilyIncome: {value: '', error: false},
              anyOtherIncome: {value: '', error: false},
              monthlyHouseholdIncome: {value: '', error: false},
              //---------------------------------MonthlyHouseHold Expense
              kitchenExpense: {value: '', error: false},
              childrenExpense: {value: '', error: false},
              utilityExpenses: {value: '', error: false},
              anyOtherExpenses: {value: '', error: false},
              monthlyHouseholdExpense: {value: '', error: false},
              householdLiability: {value: '', error: false},
              householdSavings: {value: '', error: false},

              //---------------------------------------Customer RiskProfile RIsk

              geographicrisk: undefined,
              customerandproductrisk: undefined,
              peprisk: undefined,
              loanUtilizationrisk: undefined,
              loanUtilizationriskname: {value: '', error: false},
              loanUtilizationriskfatherHusbandName: {value: '', error: false},
              loanUtilizationriskcnic: {value: '', error: false},
              borrowerriskprofile: 1,

              geographicriskRemarks: {value: '', error: false},
              customerandProductriskRemarks: {value: '', error: false},
              pepriskRemakrs: {value: '', error: false},
              loanUtilizationriskRemarks: {value: '', error: false},
              loan_customerImage: [
                {
                  key: 1,
                  activeTab: false,
                  imgName: {value: '', error: false},
                  imgValue: undefined,
                  addedBy: '',
                },
              ],

              //---------------------------------------Customer ESM RiskProfile

              EsmProductRisk: undefined,
              EsmProductItemRisk: undefined,
              EsmProductRiskValue: undefined,

              //-------------------------------Poverty card
              questionsno1: undefined,
              questionsno2: undefined,
              questionsno3: undefined,
              questionsno4: undefined,
              questionsno5: undefined,
              questionsno6: undefined,
              questionsno7: undefined,
              questionsno8: undefined,
              questionsno9: undefined,
              questionsno10: undefined,
              questionsno11: undefined,
              questionsno12: undefined,
              questionsno13: undefined,
            },
          ],
          assestsInfo: [
            {
              key: 1,
              activeTab: false,
              assetName: {value: '', error: false},
              assetQuantity: {value: '1', error: false},
              assetValue: {value: '', error: false},
              assetOwner: {value: '', error: false},
              assetNote: {value: '', error: false},
              assetTagSize: {value: '', error: false},
              assetTagId: {value: '', error: false},
              assetTagName: {value: undefined, error: false},
              assets_Image: [
                {
                  key: 1,
                  activeTab: false,
                  imgName: {value: '', error: false},
                  imgValue: undefined,
                },
              ],
            },
          ],
          familyMemberInfo: [
            // {
            //     key: 1,
            //     activeTab: false,
            //     familyMember_fullname: { value: '', error: false },
            //     familyMember_cnic: { value: '', error: false },
            //     familyMember_relation: { value: '', error: false },
            //     familyMember_age: { value: '', error: false },
            //     familyMember_education: { value: '', error: false },
            //     familyMember_montlyEarning: { value: '', error: false },
            //     familyMember_sourceIncome: { value: '', error: false },
            //     familyMember_businessAddress: { value: '', error: false },
            //     familyMember_genderSelection: { value: '', error: false },
            // },
          ],
          guarantorInfo: [
            // {
            //     key: 1,
            //     activeTab: false,
            //     guarantor_fullname: { value: '', error: false },
            //     guarantor_cnic: { value: '', error: false },
            //     guarantor_address: { value: '', error: false },
            //     guarantor_contactno: { value: '', error: false },
            //     guarantor_jobDescription: { value: '', error: false },
            //     guarantor_businessAddress: { value: '', error: false },
            //     guarantor_jobType: undefined,
            //     guarantor_businessNote: { value: '', error: false },
            //     guarantor_businessStatus: false,
            //     isGroupMember: false
            // },
          ],
        },
      });
    } else if (screenNo == 2) {
      dispatch({
        type: 'GROUPARRAY',
        payload: {
          groupName: {value: '', error: false},
          groupStatus: {value: 'Processed', error: false},
          groupNote: {value: '', error: false},
          groupMembers: [],
          ///////////////////////////comment
          addedBy: {value: '', error: false},
          addedByDesignation: {value: 'Field Officer', error: false},
          commentOfAddedby: {value: '', error: false},
          verifiedBy: {value: '', error: false},
          verifiedByDesignation: {value: 'Field Officer', error: false},
          commentsofVerifiedby: {value: '', error: false},
          groupImage: undefined,
          groupLocation: undefined,
          //-------------------------------Verify Indicator
          counductPhysicalVisit: {value: 1, error: false},
          verifiedreApparisal: {value: 1, error: false},
          verifiedRepaymentHistory: {value: 1, error: false},
          criticalAssetsValuation: {value: 1, error: false},
          verifiedbyContactNumber: {value: 1, error: false},
          meetwithSocialResponsible: {value: 1, error: false},
          meetwithPersonalGuarantee: {value: 1, error: false},
          verifiedProvidedDoc: {value: 1, error: false},
          //----------------------------Compailance
          amlPolicyandProcedure: {value: 1, error: false},
          socialandManagmentPolicy: {value: 1, error: false},
          verifiedCIBPolicy: {value: 1, error: false},
          doesBorrowerEnivro: {value: 1, error: false},
          doesEnterprise: {value: 1, error: false},
          //////////////////////////////---S RISK--------
          riskAssementno1: {value: '', error: false},
          riskAssementno2: {value: '', error: false},
          riskAssementno3: {value: '', error: false},
          riskAssementTimelineone: {value: '', error: false},
          riskAssementTimelinetwo: {value: '', error: false},
          riskAssementTimelinethree: {value: '', error: false},
          visitedBorrower: {value: '', error: false},
          borrowerName: {value: '', error: false},
          borrowerAddress: {value: '', error: false},
          borrowerPhone: {value: '', error: false},
          borrowerStaification: {value: '', error: false},
          socialAppraisal: {value: '', error: false},
          borrowerApproval: {value: '', error: false},
          borrowerRemarks: {value: '', error: false},
        },
      });
    } else if (screenNo == 3) {
      dispatch({
        type: 'SurveyData',
        payload: {
          clientInfo: [
            {
              ///////// Contect Info ///////////////////////////
              customerCnicNumber: {value: '', error: false},
              customerId: {value: '', error: false},
              customerLoanId: {value: '', error: false},
              customerTypeOfLoan: {value: '', error: false},
              customerLoanCycle: {value: '', error: false},
              customerDateOfDisburse: {value: '', error: false},
              customerPhoneNumber: {value: '', error: false},
              customerLoanOfficer: {value: '', error: false},
              customerDateOfSurvey: {value: '', error: false},
              customerName: {value: '', error: false},

              ///// COVID 19 INFORMATION ///////////////////////
              impactBusiness: {
                value: 0,
                options: [
                  {id: 0, label: 'Positively', selected: true},
                  {id: 1, label: 'Negatively', selected: false},
                ],
              },
              planningReviveIncome: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label: 'Continue with same',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label: 'Take a loan again',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'Try a new business',
                    selected: false,
                    value: '',
                  },
                ],
              },
              safcoLoanProduct: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                ],
              },
              recomendProductDesign: {
                product: '',
                loanAmount: '',
                paymentTerms: '',
                error: false,
              },
              whoKeptUpdateInfo: {
                value: 0,
                options: [
                  {id: 0, label: 'Media', selected: true, value: ''},
                  {id: 1, label: 'Villagers', selected: false, value: ''},
                  {id: 2, label: 'Safco Team', selected: false, value: ''},
                  {id: 3, label: 'Others', selected: false, value: ''},
                ],
              },
              whoProvideSocDistance: {
                value: 0,
                options: [
                  {id: 0, label: 'Media', selected: true, value: ''},
                  {id: 1, label: 'Villagers', selected: false, value: ''},
                  {id: 2, label: 'Safco Team', selected: false, value: ''},
                  {id: 3, label: 'Others', selected: false, value: ''},
                ],
              },
              appliedForLoanResch: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                ],
              },
              applyForReschedule: {
                value: 0,
                options: [
                  {id: 0, label: 'Closed Business', selected: true, value: ''},
                  {
                    id: 1,
                    label: 'Poor supply side',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'Cash flow Disturbed',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'Benefit from Govt Scheme',
                    selected: false,
                    value: '',
                  },
                ],
              },
              /////////////////// CLIENT SATISFACTION /////////////////////////

              // Q 1. Did the employee MFO give you clear and sufficient information on
              // the process and the credit?
              employeeMfoInfo: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'MFO did not give me clear or sufficient information on the process and details on the credit',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'MFO gave me clear or sufficient information on the process but well detailed the credit',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'MFO gave me clear or sufficient information on the process but he did not detail the credit',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label:
                      'MFO gave me clear or sufficient information on the process and provide me with detailed information on the credit',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //////APPLICATION FORM CLEAR? TAKE TIME ///////////////////
              //Q2. When the filling application form, were the explanation clear? Did it take time to fill it?
              appExpClear: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      ' It was long and explanations were not clear/missing',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label: 'It was long but explanations were clear',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'It was quick but explanations were not clear',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'It was clear and explanations were clear',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //How did you find proceure of disbursementat the branch /////
              //Q3
              proceDisbuseAtBranch: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'It was inconvenient (loss of time, have to cloe shop, need to take time off from work)',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'It was convenient and easy OR the borrower is in different about it',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'It was nice and good to get introduced to the office and/or staff',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'N/A (Disburse did not take place at the branch)',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //How you find proceure of disbursementat the branch did it take time
              //Q4
              disburseTakeTime: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'It was long and explanations were not clear/missing',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label: 'It was long but explanations were not clear',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'It was Quick but explanations were not clear/missing',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'It was Quick and explanations were not clear',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 4,
                    label: '(Disburse did not take place at the branch)',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //How many minutes take to arrive at branch //////
              //Q5
              arriveTakeTime: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label: 'Less than 10 minutes',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label: 'Between 10 and 30 minutes',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'More than 30 minutes ONA (Client never visited the branch)',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //how was the reception when you entered to the branch ////
              //Q6
              branchReception: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'There was nobody OR the staff did not look at me or welcome me',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'The staff welcomed me but i did not like the way he/she did OR not really polite',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'He/She welcomed me kindly without telling me few words to wait',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label:
                      'He/She welcomed me kindly and kindly asked me to wait / get seated',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //how long did you wait before staff assisted you
              //Q7
              didYouWait: {
                value: 0,
                options: [
                  {id: 0, label: 'I did not wait', selected: true, value: ''},
                  {
                    id: 1,
                    label: 'Less than 10 minutes',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'Between 10 and 30',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'More than thirty',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 4,
                    label: 'NA (client never visited the branch)',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //where did you repay your loan
              //Q8
              repayLoan: {
                value: 0,
                options: [
                  {id: 0, label: 'In Branch', selected: true, value: ''},
                  {id: 1, label: 'Door-step', selected: false, value: ''},
                  {id: 2, label: 'In field area', selected: false, value: ''},
                  {
                    id: 3,
                    label: 'Branchless banking service',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 4,
                    label: 'Handed over to activist (third party)',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //repayment outlet provide convinent opening hours to you?
              //Q9
              provConvOpenHours: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                ],
              },
              //Q10.Did you wait? How long did you wait before someone/staff assisted you?///
              howLongYouWait: {
                value: 0,
                options: [
                  {id: 0, label: 'I did not wait', selected: true, value: ''},
                  {
                    id: 1,
                    label: 'Less than 10 minutes',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'Between 10 and 30 More than thirty',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 11.Was the repayment process quick except waiting time?e//
              processQuickExptWaitTime: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                ],
              },
              //Q 12.Did the SAFCO staff and ADC representative serve you well there?//
              staffServeYouWell: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                ],
              },
              //Q 13.How frequent does our employee (MFO) visit you?
              frequentEmpVisitYou: {
                value: 0,
                options: [
                  {id: 0, label: 'Once in a month', selected: true, value: ''},
                  {
                    id: 1,
                    label: 'Every 1-2 months',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'More than 2 months',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'Before I have to renew the loan',
                    selected: false,
                    value: '',
                  },
                  {id: 4, label: 'He never visits', selected: false, value: ''},
                ],
              },
              //Q 14.Do you face difficulty in contacting the employee (MFO) Unreachable?
              contactTheEmployee: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'Unreachable, I have messages and He/She never return my callsYes',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'He/She gives me a missed call for me to call him/her',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'He/She return my call but after a certain period of time (> 3 days)',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label: 'He/She return my calls in a good time (2-3 days)',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 4,
                    label:
                      'I reach him/her OR he/she return my calls quickly (less than 2 days)',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 15.Does employee (MFO) do an effort to respond to your needs and solve your problems?
              EmpDoesEffort: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'The MFO does not give me any information, or it is not clear, and does not provide enough information ',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'The MFO does the minimum but does not try to spend more time with me to give advice',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      'The MFO is willing to and committed to offering me better service, understands my problems and solve them',
                    selected: false,
                    value: '',
                  },
                  {id: 3, label: 'No', selected: false, value: ''},
                ],
              },
              //Q 16. To what extend are you satisfied with characteristics of your group loan?
              youSatisfiedWithLoan: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label: 'I was not satisfied and do not want any other loan',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label: 'I was not satisfied and would prefer to take IL',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label:
                      "I was satisfied but would prefer to take IL (however I don't qualify)",
                    selected: false,
                    value: '',
                  },
                  {
                    id: 3,
                    label:
                      'I was satisfied but would prefer to take IL (and I will apply to IL',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 4,
                    label: 'I am satisfied and still prefer GL',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 5,
                    label: "N/A (client's loan is not GL)",
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 17.For group loan only: what are the reasons of satisfaction and dissatisfaction?
              reasonsOfSatisfaction: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label: 'It provides me with the needed support',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label: 'It gives me idea to develop my business',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 18.To what extend are you satisfied with characteristics of your credit? Does it serve your needs?
              characOfCredit: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'Credit is not appropriate at all to my needs and to what i expected',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'Credit is ok but some improvements are still needed',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'Credit totally suit my needs ',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 19.Are you dealing with or thinking of dealing with another financial institution?
              dealingFinancialInstitute: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                  {
                    id: 2,
                    label: 'I am thinking about it',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //For What reason
              forWhatReason: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label: 'Suitablity of  ToRs',
                    selected: true,
                    value: '',
                  },
                  {id: 1, label: 'Loan Size', selected: false, value: ''},
                  {
                    id: 2,
                    label: 'Seasonal financial requirements',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 20.Do our existing loan products meets your need?
              productMeetYourNeed: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: true, value: ''},
                  {id: 1, label: 'No', selected: false, value: ''},
                ],
              },
              //If No then what reasons?
              ifNoReason: {
                value: 0,
                options: [
                  {id: 0, label: 'Loan Size', selected: false, value: ''},
                  {
                    id: 1,
                    label: 'Repayment Frequency',
                    selected: false,
                    value: '',
                  },
                  {
                    id: 2,
                    label: 'Loan Requirements',
                    selected: false,
                    value: '',
                  },
                ],
                anyOther: {value: '', error: false},
              },

              //Q 21Are you interested to borrow our House Finance Loan from Safco?
              houseFinanceLoan: {
                value: 0,
                options: [
                  {id: 1, label: 'Yes', selected: false, value: ''},
                  {id: 0, label: 'No', selected: true, value: ''},
                ],
              },
              //If Yes,then for what purpose?
              ifYesPurpose: {
                value: 0,
                options: [
                  {id: 0, label: 'Home Renovation', selected: true, value: ''},
                  {
                    id: 1,
                    label: 'New home construction of new house',
                    selected: false,
                    value: '',
                  },
                  {id: 2, label: 'Purchase of Plot', selected: true, value: ''},
                ],
              },
              //For Construction of new house,what would be your preference for loan from Safco?
              forConstructNewHouse: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'Safco provide the loan amount and I will construct myself',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'Safco provide construction facility rather than the loan amount ',
                    selected: false,
                    value: '',
                  },
                ],
              },
              //Q 22.Are you interested to borrow out Auto Finance Loan i,e. for Motor Cycle, Rickshaw, Qingqi or Loader?
              autoFinanceLoan: {
                value: 0,
                options: [
                  {id: 0, label: 'Yes', selected: false, value: ''},
                  {id: 1, label: 'No', selected: true, value: ''},
                ],
              },
              //If Yes,then which vehicle you want to purchase from Safco?
              whichVehcleWantPurchase: {
                value: 0,
                options: [
                  {id: 0, label: 'Motorcycle', selected: true, value: ''},
                  {id: 1, label: 'Rickshaw', selected: false, value: ''},
                  {id: 2, label: 'Qingqi', selected: false, value: ''},
                  {id: 3, label: 'Loader', selected: false, value: ''},
                ],
              },
              //Which mode of finance do you prefer?
              modeOfFinance: {
                value: 0,
                options: [
                  {
                    id: 0,
                    label:
                      'We market loan and you purchase the vehicle by yourself locally from market',
                    selected: true,
                    value: '',
                  },
                  {
                    id: 1,
                    label:
                      'We finance the vehicle at the market price your down payment contribution',
                    selected: false,
                    value: '',
                  },
                ],
              },
            },
          ],
        },
      });
    }else if (screenNo == 5) {
      dispatch({
        type: 'SurveyDatas',
        payload: {
          employeeInfo: [
            {
              ///////// Contect Info ///////////////////////////
              HRId: {value: '', error: false},
              employeeDesignation: {value: '', error: false},
              
              employeeDateOfSurvey: {value: '', error: false},
              employeeName: {value: '', error: false},

              ///// About Safco Microfinance Company ///////////////////////
              safcoMicrofinancePart: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              TopManagementpays: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
             
                
              /////////////////// AboutWork /////////////////////////

              // Q. 3. I can understand what is expected of(from) me in my work?
              
              AboutWork: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              
              //Q. 4. I am satisfied with my job and the kind of work I do?
              satisfiedJob: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q. 5. My job is challenging and interesting? /////
              
              challengingJob: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              //Overall, I am satisfied with my present job?
              //Q6
              presentJob: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              // C. Career and Development //////
              // Q. 7. I am satisfied with the opportunities for(Of) training? //////
              satisfiedOpportunities: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Safco makes every effort to fill vacancies from within before recruiting from outside? ////
              //Q8
              fillVacancies: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Promotion goes to those who most deserve it?
              //Q9
              Promotion: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              // My work at Safco is making me develop my skills & knowledge?
              //Q10
              developSkills: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              //I feel free to talk openly and honestly to my manager?
              //Q11
              talkOpenly: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q12. My manager praises me when I do a good job?///
              managerPraises: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q.13. My manager helps me to improve myself??//
              improveMyself: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              //Q. 14. My manager is an effective leader (i.e. shows behavior that is positive &
// motivating)? //
              effectiveLeader: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q 15. I feel free to talk openly and honestly with members of my office (Staff)?
              officeMember: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              // Q. 16. Employees are recognized for good work performance??
              workPerformance: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              // Q. 17. Performance is clearly linked to promotions/rewards?
              linkedPromotions: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q. 18. My last performance appraisal accurately reflected my performance?
              lastPerformance: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              // Q. 19. My office has good, neat, clean and pleasant environment?
              myOffice: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              // Q. 20. I believe my job is secure?
              jobSecure: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              //Q. 21. My workload is reasonable?
              reasonableWork: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                  {id:1,label:'Dissatisfied', selected:false, value:''},
                  {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                  {id:3,label:'Satisfied', selected:false, value:''},
                  {id:4,label:'Very Satisfied', selected:false, value:''},
  
                ],
                comment: {value: '', error: false},
              },
              //Q. 22. I can keep a reasonable balance between work and personal life?
              balanceWork: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q. 23. I am satisfied with pay, incentive and benefits package?
              satisfiedPay: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q. 24. I am satisfied with the Safco’s employee programs such as rewards, incentives,
// insurance and health care, etc?
              employeePrograms: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              //Q 25. I am satisfied with the recreational activities provided by the Safco, e.g. picnics,
// exposure, trainings etc?
              safcoActivities: {
                value: 0,
                options: [
                  {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},

                ],
                comment: {value: '', error: false},
              },
              // What you like the most in your job right now?
              jobRight: {
                value: 0,
                Answer: {value: '', error: false},
              },
              // What is it that you are not comfortable in your job right now?
              Comfortable: {
                value: 0,
                Answer: {value: '', error: false},
              },
              // How do you need to improve your performance and productivity?
              Productivity: {
                value: 0,
                Answer: {value: '', error: false},
              },

              // Give us at least three suggestions to improve the work environment in Safco?
              threeSuggestion: {
                value: 0,
                Answer1: {value: '', error: false},
                Answer2: {value: '', error: false},
                Answer3: {value: '', error: false},
              },
             
             
            },
          ],
        },
      });
    }
    
    
    
    else if (screenNo == 4) {
      dispatch({
        type: 'CIBReportObject',
        payload: {
          customerNicNumber: {value: '', error: ''},
          CustomerId: {value: '', error: ''},
          customerAddedBy: {value: '', index: 0, id: ''},
          customerRegion: {value: '', index: 0, id: ''},
          customerStation: {value: '', index: 0, id: ''},
          customerType: {value: 0, index: 0},
          customerFirstName: {value: '', error: ''},
          customerSonOf: {value: 1, text: '', error: ''},
          customerDateOfBirth: {value: '', error: ''},
          customerNicExpiryDate: {value: '', error: ''},
          customerAddress: {value: '', error: ''},
          customerDistrict: {value: '', index: 0, id: ''},
          customerSurname: {value: '', error: ''},
          customerGender: {value: 1, text: 'M', error: ''},
          customerFamilyNumber: {value: '', error: ''},
          customerCity: {value: '', error: ''},
          loanRequestedAmount: {value: '', error: ''},
          loanStatus: {value: 'Inquiry Processing', index: 1},
          loanAssociationType: {value: 'PRN', index: 0},
          loanApplicationDate: {value: '', error: ''},
          loanAccountType: {value: 'IN', index: 0},
          loanGroupId: {value: '', error: ''},
          KinFirstName: {value: '', error: ''}, //my code kin one
          KinMiddleName: {value: '', error: ''},
          KinLastName: {value: '', error: ''},
          KinNicNumber: {value: '', error: ''},
          KinsecondFirstName: {value: '', error: ''}, //my code kin one
          KinsecondMiddleName: {value: '', error: ''},
          KinsecondLastName: {value: '', error: ''},
          KinSecondNicNumber: {value: '', error: ''},
          KinThirdFirstName: {value: '', error: ''}, //my code kin one
          KinThirdMiddleName: {value: '', error: ''},
          KinThirdLastName: {value: '', error: ''},
          KinThirdNicNumber: {value: '', error: ''},
          KinFourFirstName: {value: '', error: ''}, //my code kin one
          KinFourMiddleName: {value: '', error: ''},
          KinFourLastName: {value: '', error: ''},
          KinFourNicNumber: {value: '', error: ''},
          customerPhoneNumber: {value: '', error: ''},
          customerEmail: {value: '', error: ''},
          customerMobileNumber: {value: '', error: ''},
          customerNotes: {value: '', error: ''},
          customerAddedOn: {value: '', error: ''},
        },
      });
    }
    dispatch({
      type: 'SET_UPDATECHECK',
      payload: {value: false, id: ''},
    });
    DeleteCustomersFormsTemp();
    dispatch({
      type: 'SET_TempFormReducer',
      payload: {value: false, id: null},
    });
    if (updateCheckTemp) {
      navigation.replace('Drawer', {
        userData: getUserData,
        station: StationReducer.station,
      });
    } else {
    
      navigation.goBack();
    }
  };
  const _onPress = () => {
    if (back) {
      setDialogVisible(true);
    } else {
      navigation.openDrawer();
    }
  };
  return (
    <Pressable onPressIn={_onPress}>
      <AskingDialoge
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        onPress={_onYesPress}
      />
      {back ? (
        <Ionicons
          name={'ios-caret-back'}
          size={28}
          color={Colors.parrotGreenColor}
          style={{paddingHorizontal: 30, marginTop: 58}}
        />
      ) : (
        <Feather
          name={'menu'}
          size={28}
          color={Colors.parrotGreenColor}
          style={{paddingHorizontal: 30, marginTop: 50}}
        />
      )}
    </Pressable>
  );
};

export default memo(Header);
