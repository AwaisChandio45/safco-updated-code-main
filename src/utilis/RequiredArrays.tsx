export const Regions = [
  'Hyderabad',
  'Qasimabad',
  'Karachi',
  'Khairpur',
];
export const Priority = [
  'Low',
  'Medium',
  'High',
];
export const Officers = [
  'Field Officer',
  'Branch Manager',
  'Area Manager',
  'Verification Officer',
];
export const ComplaintTo = [
  'verge system',
  'safco',
  
];
export const ComplaintBy = [
  'Amrat kumar',
  'Faaiz',
  
];

export const imageNames=[
  'Client Profile Picture',
  'Client CNIC Front Side',
  'Client CNIC Back Side',
  'Supporting / Next of Kin / Head of Family CNIC Front Side',
  'Supporting / Next of Kin / Head of Family CNIC Back Side',
  'Business Profile Picture',
  'Gurantor CNIC Front Side',
  'Gurantor CNIC Back Side',
  'Bank Statement',
  'Loan Clearance',
  'Departmental Clearance',
  'School Improvement Loan Application',
  'School Registration Form',
  'Promissory Note',
  'Rent Agreement',
  '7th Form/Undertaking',
  'Job Card/Certificate',
  'Other'];
export const Religion = [
  'Muslim',
  'Non-Muslim',
  'Christan',
  'Hindi',
  'Sikh',
  'Parsi',
  'Buddhist',
  'Jewish',
  'Others',
];
export const Complains_status = [
  'Open',
  'Close',
];
export const HouseStatus = [
  'Own',
  'Rented',
  'Temporay',
  'Shared',
];
export const ClientDisease = [
  'None',
  'Hepatitis A/B',
  'TB',
  'Diabetes',
  'Blood Pressure',
  'Cancer',
  'Heart Disease',
];
export const Departments = [
  'Education',
  'Agriculture',
  'Finance',
  'HR',
  'Irrigation',
  'Other',
  'Banker',
  'Pakistan Railways',
  'Population Welfare Department',
  'Town Committee',
  'Revenue Department',
  'Health Department',
  'Pakistan Post Office',
  'Wapda Department',
  'Semi Government',
  'Works & Service Department',
];
export const HouseType = ['Paka', 'Kacha', 'Medium'];
export const Benificary = ['Yes', 'No'];
export const UserType = ['Urban', 'Rural'];
export const KinArray = [
  'Husband',
  'Son',
  'Brother in Law',
  'Father',
  'Mother',
  'Wife',
  'Brother',
];
export const PhysicalHealth = [
  'Good',
  'Bad',
  'Normal',
];
export const FoundIllness = ['Yes', 'No'];
export const LabourtyTest = ['Yes', 'No'];
export const EducationList = [
  'Uneducated',
  'Primary',
  'Middle',
  'Matric',
  'Intermediate',
  'Graduate',
  'Master',
  'Above',
];

export const SelectJobs = [
  'Select Job Type',
  'Private',
  'Goverment',
  'Business',
];
export const JOBTypes = ['Private', 'Goverment', 'Business'];
export const Remarks = ['Satisfactory', 'UnSatisfactory'];
export const Decision = ['Approval', 'Rejection', 'Pending'];
export const VisitedList = ['Residence', 'Business', 'Other Place'];

export const Geographicrisk = [
  { name: 'None', risk: 1, index: 0 },
  { name: 'Non Resident Pakistani.', risk: 3, index: 1 },
  { name: 'Area near to Border(Poras Border).', risk: 3, index: 2 },
  {
    name: 'High Risk Areas for Money Laundering and Terrorism Activities.',
    risk: 2, index: 3
  },
];

export const EsmProductWiseRisk = [
  "Retailing",
  "LiveStock",
  "Agricultire",
  "Handicraft",
  "School Improvement",
  "Autofinance",
  "Houseginance",
]

export const EsmProductWiseRiskList = [
  [
    { name: "None", risk: 1, index: 0, checked:false },
    { name: 'Wastewater/ liquids are being released dischagred to water', risk: 2, index: 0, checked:false },
    { name: 'No Safegaurd are available and/or used when necessary', risk: 2, index: 0, checked:false },
    { name: ' Equipment is stored in an unsafe way considering fire risk', risk: 2, index: 0, checked:false },
    { name: ' Electricity wires are loose or damaged', risk: 3, index: 0, checked:false },
    { name: ' Machine looks unsafe are ill maintained or have dengrous parts', risk: 3, index: 0, checked:false },
    { name: ' No Safeguards are available and/or Used when necessary (mask, goggles, gloves, helmet, proper working clothes', risk: 2, index: 0, checked:false },
    { name: ' No saftey precautions seem available', risk: 3, index: 0, checked:false },
    { name: 'Water is not disposed or disposed incorrectly leakages, disposals, liquid waste', risk: 3, index: 0, checked:false },
    { name: 'No relevant chemical fact sheets are available', risk: 3, index: 0, checked:false },
    { name: 'Storage is unsafe, unlocked or located near sleeping/eating place', risk: 2, index: 0, checked:false },
    { name: 'No Sufficient light is in place', risk: 2, index: 0, checked:false },
    { name: 'the noice level is too high and no ear defenders are available', risk: 3, index: 0, checked:false },
    { name: ' The ventilation is bad or non-existent', risk: 2, index: 0, checked:false },
    { name: 'Children are being employed', risk: 3, index: 0, checked:false },
    { name: 'Children are working during school hours', risk: 2, index: 0 , checked:false},
    { name: 'Children are negatively affected by the work either physical, mentallay, spiritual morally or Socially', risk: 2, index: 0, checked:false },
    { name: 'Machines look unsafe are all maintained or have dangerous parts', risk: 2, index: 0, checked:false },
    { name: 'Usage of Banned Chemical & dyes( mercury, biomedical heavy metals)', risk: 2, index: 0, checked:false },
    { name: 'Waste Material deposit in fresh water', risk: 3, index: 0, checked:false },
  ],
  [
    { name: "None", risk: 1, index: 0, checked:false },  
    { name:"Forest is managed unsustainable (Illegal and/or without reforestation plant)", risk: 3, index: 0, checked:false },
    { name:  "No Safeguards are available and/or Used when necessary (mask, goggles, gloves, overal)", risk: 3, index: 0, checked:false },       
    { name:  "No relevant chemical fact sheets are available", risk: 3, index: 0, checked:false },               
    { name: "Usage of Banned pesticides and fertilizers", risk: 2, index: 0 , checked:false},        
    { name:  "Storage is unsafe, unlocked or located near sleeping/eating place", risk: 2, index: 0 , checked:false},        
    { name:  "Animals are kept near eating / Sleeping place", risk: 3, index: 0, checked:false },
    { name:  "Aminals are foraging nearby waste disposal site", risk: 2, index: 0 , checked:false},       
    { name:  "Children are being employed", risk: 3, index: 0 , checked:false},       
    { name:  "Children are working during school hours", risk: 2 , index: 0 , checked:false},
    { name:  "Children are negatively affected by the work either physical, mentallay, spiritual morally or Socially", risk: 2, index: 0 , checked:false},       
    { name: "There are no clear agreements with employees, they cannot claim their rights", risk: 2, index: 0 , checked:false},
    { name:  "There is an unsafe working enviroment potentially leading to stress (aggression, discrimination, sexual violance", risk: 3, index: 0 , checked:false},       
    { name:  "Tasks and/or working hours negatively influences the employe", risk: 2, index: 0 , checked:false},
    { name:  "Live Stock Food stored in clean and protected Area", risk: 2, index: 0 , checked:false},       
    { name:   "when harmful substances,often chemicals or microorganisms contaminate a stream, river, lake", risk: 3, index: 0 , checked:false},
    { name:"Live stock waste collection area located to freshwater sourace",  risk: 3, index: 0 , checked:false},      
    { name:"Illegal fishing methods are practiced overfishing,Unsustainable finshsing methonds removing more fish than production", risk: 3, index: 0 , checked:false},
    { name:  "Indroduction of Exotic fish speices in Open water", risk: 3, index: 0 , checked:false},
  ],
  [
    
    { name: "None", risk: 1, index: 0 },  
    { name: "Forest is managed unsustainable (Illegal and/or without reforestation plant)", risk: 3, index: 0 , checked:false},
    { name:  "No Safeguards are available and/or Used when necessary (mask, goggles, gloves, overal)", risk: 3, index: 0 , checked:false},
    { name: "No relevant chemical fact sheets are available", risk: 3, index: 0 , checked:false},
    { name: "Usage of Banned pesticides and fertilizers", risk: 2, index: 0 , checked:false},
    { name:  "Storage is unsafe, unlocked or located near sleeping/eating place", risk: 2, index: 0 , checked:false},
    { name: "Machines look unsafe are all maintained or have dangerous parts", risk: 2, index: 0 , checked:false},
    { name: "No Safeguards are available and/or Used when necessary (mask, goggles, gloves, helmet, proper working clothes)", risk: 2, index: 0 , checked:false},
    { name:  "No saftey precautions seem available", risk: 3, index: 0 , checked:false},
    { name:  "Children are being employed", risk: 3, index: 0 , checked:false},
    { name:  "Children are working during school hours", risk: 2, index: 0 , checked:false},
    { name:  "Children are negatively affected by the work either physical, mentallay, spiritual morally or Socially", risk: 2, index: 0 , checked:false},
    { name:  "Cultivation of Poppy and illegal Crops", risk: 3, index: 0 , checked:false},
    { name:  "Agricultue in notified forest and protected area", risk: 3, index: 0 , checked:false},
    { name:  "Cultivation near a site of historical or cultural importance for the local community", risk: 3, index: 0 , checked:false},
    { name:  "There are no clear agreements with employees, they cannot claim their rights", risk: 2, index: 0, checked:false },
    { name:  "There is an unsafe working enviroment potentially leading to stress (aggression, discrimination, sexual violance", risk: 3, index: 0, checked:false },
    { name:  "Tasks and/or working hours negatively influences the employe", risk: 2, index: 0 , checked:false},
    { name:   "The Activity cause erosion and/or land degradtion", risk: 3, index: 0 , checked:false},
    
  ],
  [
    { name:   'None',risk: 1, index: 0 },
    { name:   'The noice level is too high and no ear defenders are available',risk: 3, index: 0 , checked:false},                       
    { name:   'The ventilation is bad or non-existent',risk: 2, index: 0 , checked:false},
    { name:   "Children are being employed",risk: 3, index: 0 , checked:false},
    { name:   "Children are working during school hours",risk: 2, index: 0 , checked:false},
    { name:   "Children are negatively affected by the work either physical, mentallay, spiritual morally or Socially",risk: 2, index: 0 , checked:false},
    { name:   "Usage of Banned Chemical & dyes( mercury, biomedical heavy metals)", risk: 2, index: 0 , checked:false},
    { name:   "Waste Material deposit in fresh water", risk: 3, index: 0 , checked:false},
  ],
  [
    []
  ],
  [
    []
  ],
  [
    []
  ]
]
export const CustomerandProductRisk = [
  { name: 'None', risk: 1, index: 0 },
  { name: 'Indroduced Customer.', risk: 2, index: 1 },
  { name: 'Customer is not resident of Operational Area.', risk: 2, index: 2 },
  {
    name: 'Customer involved in a business that Handles large amounts of Cash.',
    risk: 2, index: 3
  },
  { name: 'Business with a complicated Ownership Structure.', risk: 3, index: 4 },
  {
    name: 'Customer who makes regular transcations with Same Individual or Group Individual.',
    risk: 2, index: 5
  },
  {
    name: 'Customer is not a familiar by With local persons area Culture and Customs.',
    risk: 2, index: 6
  },
  { name: 'Customer Household members social and religious contacts.', risk: 2, index: 7 },
  { name: 'Customer acting on behalf of the real beneficial owner.', risk: 3, index: 8 },
  { name: 'Customer with unknown Souce of funds.', risk: 3, index: 9 },
  {
    name: 'Customer are not wanting to provide documentation or providing documents that is not satisfactory.',
    risk: 3, index: 10
  },
  { name: 'Not wanting to reveal the name of a person they represent.', risk: 3, index: 11 },
  {
    name: 'Agreeing to bear very high or non commercial penalties or changes',
    risk: 3, index: 12
  },
  {
    name: 'Entering into transcations that do not make commercial sense',
    risk: 3, index: 13
  },
  {
    name: 'Real estate dealers',
    risk: 3, index: 14
  },
  {
    name: 'Dealers in precious metal and stones',
    risk: 3, index: 15
  },
  {
    name: 'Accountants and lawyers/ notaries',
    risk: 3, index: 16
  },
];

export const PEPRisk = [
  { name: 'None', risk: 1, index: 0 },
  {
    name: 'Customer involved in any family or social relationships with any Political Person',
    risk: 3, index: 1
  },
  {
    name: 'Customer has any type of professional and social relationships with any higher grade government offical.',
    risk: 3, index: 2
  },
  {
    name: 'Customer Family members have any type of relationship with any Political Exposed Person.',
    risk: 3, index: 3
  },
  {
    name: 'Customer of his her family have any type of linkages with the Active Parliamentarians Law enforcement higher grade officals.',
    risk: 3, index: 4
  },
];

export const LoanUBO = [
  { name: 'Self', risk: 1, index: 0 },
  { name: 'Husband(For married Female only)', risk: 2, index: 1 },
  { name: 'Father(For unmarried Female only)', risk: 2, index: 2 },
  { name: 'Brother(For unmarried Female only)', risk: 2, index: 3 },
  { name: 'Wife(For married male only)', risk: 2, index: 4 },
  { name: 'Sister(For unmarried male only)', risk: 2, index: 5 },
  { name: 'Mother(For male only)', risk: 2, index: 6 },
  { name: 'Son(Unmarried)', risk: 2, index: 7 },
];
export const CustomerLoantypes = [
  'Normal',
  'Individual',
  'Personal',
  'Islamic Finance'
  
];

export const EsmRiskValue = {value:"", index:""}
export const EsmItemRiskValue = {value:"", index:""}

export const TopUpLOAN = ['No', 'Yes'];
export const SolarLOAN = ['No', 'Yes'];
export const topUpLoantype = [
  { name: 'Solar System', value: 1200 },
  { name: 'L-1', value: 1200 },
  { name: 'SR07', value: 800 },
  { name: 'D.Light S-3', value: 1200 },
  { name: 'Sun Ace II', value: 4000 },
  { name: 'Bijli Box-10', value: 8500 },
  { name: 'D-330', value: 6900 },
  { name: 'Bijli Box-50', value: 22000 },
  { name: 'Bijli Box-80', value: 26000 },
  { name: 'S-500', value: 4300 },
  { name: 'SK40Z', value: 6500 },
  { name: 'Sh-Lemi', value: 31500 },
  { name: 'S-H 120', value: 10500 },
  { name: 'Pico Plus', value: 1250 },
  { name: 'Pro 200', value: 4360 },
  { name: 'Pro400', value: 4950 },
  { name: 'Boom', value: 6880 },
  { name: 'Home 60', value: 11850 },
  { name: 'A2', value: 800 },
  { name: 'SR 07', value: 800 },
  { name: 'SHS Harness 80Wt', value: 18500 },
  { name: 'SHS Zeus 60Wt', value: 18500 },
  { name: 'SHS Zeus 100–30Wt', value: 32000 },
  { name: 'SHS Zeus 100–48Wt', value: 47000 },
  { name: 'SHS Allied 80Wt', value: 18500 },
];
export const quantity = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
];
export const questionsno1 = ["1.1", "2.2", "3.3", "4.4", "5.5", "6.6", "7.7", "8.8", "9.9", "10.10", "11.11", "12.12", "13.13", "14.14", "15.15", "16.16", "17.17", "18.18", "19.19", "20.20"]
export const questionsno2 = ["1. 0-2", "2. 3-4", "3. 5-6", "4. 7 or more"];
export const questionsno3 = ["1. Never attended school", "2. Less than class 1 to class 5 included", "3. Class 6 to class 10 included", "4. Class 11,college or beyond"];
export const questionsno4 = ["1. There are no children between 5 and 16 years old in the household", "2. All the children between 5 and 16 years old aree attending school", "3. Only some of the childern between 5 and 16 years old are attending school", "4.None of the childern between 5 and 16 years old are attending school"];
export const questionsno5 = ["1. >=0-<=0.2", "2. >0.2-<=0.3", "3. >0.3-<=0.4", "4. >0.4"];
export const questionsno6 = ["1. Flush connected to a public sewerage,to a pit or to an open drain", "2. Dry raised latrine or dry pit latrine", "3. There is no toilet in the household"];
export const questionsno7 = ["Yes", "No"];
export const questionsno8 = ["Yes", "No"];
export const questionsno9 = ["Yes", "No"];
export const questionsno10 = ["1. At Least one car/tractor and at least one motorcycle/scooter", "2. At Least one car/tractor but no motorcycle/scooter", "3. No car/tractor but at least one motorcycle/scooter", "4. Neither car/tractor NOR motorcycle/scooter"];
export const questionsno11 = ["Yes", "No"];
export const questionsno12 = ["1. At least one buffalo/bullock AND at least one cow/goat/sheep", "2. At least one buffalo/bullock BUT NO cow/goat/sheep", "3. No buffalo/bullock BUT at least one cow/goat/sheep", "4. Neither buffalo/bullock NOR cow/goat/sheep"];
export const questionsno13 = ["1. 0", "2. >0-<=12.5", "3. >12.5"];








export const CustomGetDataModule = {
  customerInfo: [
    {
      resetId:undefined,
      //-------------------------------Customer immage
      customer_biomatric: undefined,
      customer_img: undefined,
      //-------------------------------Customer  info
      customer_name: { value: '', error: false },
      customer_surname: { value: '', error: false },
      customer_fatherName: { value: '', error: false },
      customer_dob: undefined,
      customer_gender: undefined,
      customer_location: undefined,
      //-------------------------------Customer personal info
      customer_mobileNumber: { value: '', error: false },
      customer_motherName: { value: '', error: false },
      customer_cnicNumber: { value: '', error: false },
      customer_region: undefined,
      customer_cnicissueDate: undefined,
      customer_cnicExpireDate: undefined,
      customer_maritialStatus: undefined,
      FamilyNumber: { value: '', error: false },
      //---------------------------------------Customer Additional info
      customer_religion: undefined,
      customer_houseStatus: undefined,
      customer_houseType: undefined,
      customer_bispBeneficary: undefined,
      customer_userType: undefined,
      customer_guardianceCnic: { value: '', error: false },
      customer_guardianceOf: undefined,
      customer_guardianceOfName: { value: '', error: false },
      customer_education: undefined,
      //-------------------------------------------Customer Kin
      customer_nextKinName: { value: '', error: false },
      customer_nextKinRelation: undefined,
      customer_nextKinCnic: { value: '', error: false },
      customer_nextKinOtherRelation: { value: '', error: false },

      //---------------------------------------------Customer Present
      customer_pre_country: { value: 'Pakistan', error: false },
      customer_pre_stateProvince: {value:'',index:''},
      customer_pre_district: {value:'',index:''},
      customer_pre_taluka: {value:'',index:''},
      customer_pre_uc: {value:'',index:''},
      customer_pre_mohalla: { value: '', index:'' },
      customer_pre_city: { value: '', error: false },
      customer_pre_address: { value: '', error: false },
      //-------------------------------Customer permenant
      customer_per_country: { value: 'Pakistan', error: false },
      customer_per_stateProvince: {value:'',index:''},
      customer_per_district:{value:'',index:''},
      customer_per_taluka: {value:'',index:''},
      customer_per_uc: {value:'',index:''},
      customer_per_mohalla: { value: '', index: ''},
      customer_per_city: { value: '', error: false },
      customer_per_address: { value: '', error: false },
      numberOfyear: { value: '', error: false },
      addressnotes: { value: '', error: false },
      customer_isEmployeed: false,
      customer_jobCard: undefined,
      // ********************************Evrisys
      evrisys_customerImage: undefined,


      //-------------------------------Supporting Person Undertaking
      customer_supportingPerson_name: { value: '', error: false },
      customer_supportingRequiredPerson_name: { value: '', error: false },
      customer_supportingRequiredPerson_fathername: { value: '', error: false },
      customer_supportingPerson_cnic: { value: '', error: false },
      customer_supportingPerson_relation: { value: '', error: false },
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
      customer_health: { value: '', error: false },
      customer_physicalHealth: undefined,
      customer_anyillness: undefined,
      customer_disease: undefined,
      customer_token: { value: '', error: false },
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
      loanPercentage: { value: '0', error: false },
      calculatedPercentage: { value: '0', error: false },
      requestedLoan: { value: '0', error: false },
      approvedLoan: { value: '0', error: false },
       numericalValue: { value: '0', error: false }, //my code
      DealerBusinessName: { value: '', error: false },
      DealerName: { value: '', error: false },
      DealerCnic : { value: '', error: false },
      loanTerm: { value: '', error: false },
      loanStatus: { value: 'Processed', index: 0 },
      personalCapitalinBusiness: { value: '', error: false },
      amountRequiredforBusiness: { value: '', error: false },
      expectedMonthlyIncome: { value: '', error: false },
      incomeFromSales: { value: '', error: false },
      rentalIncome: { value: '', error: false },
      monthlyIncome: { value: '', error: false },
      businessAddress: { value: '', error: false },
      businessName: { value: '', error: false },
      experianceinBusiness: { value: '', error: false },
      loanDate: undefined,
      loanNote: { value: '', error: false },
      doyouwantTopupLoan: undefined,
      doyouwantSolarTopupLoan: 0,
      topupLoantype: undefined,
      topupLoanValue: 0,
      topupLoanQty: undefined,
      occupation: { value: '', error: false },
      occupationType: undefined,
      vendorCnic: { value: '', error: false },
      vendorName: { value: '', error: false },
      vendorShopName: { value: '', error: false },
      vendorMobileNumber: { value: '', error: false },
      vendorProductName: { value: '', error: false },
      vendorProductPrice: { value: '', error: false },
      ProductCompanyName: { value: '', error: false },
      vendorCnicImages:[{
        cnicFront:{imgValue:undefined},
        cnicBack:{imgValue:undefined},
      }],
      no_of_emploee: { value: '', error: false },
      PersonalJobDepartment: undefined,
      PersonalJobDesignation: { value: '', error: false },
      PersonalLoanJobType: undefined,
      IsAutofinance: "0",
      AutofinanceDefaultPercentage: 0,
      AutofinanceProductPercentage: "0",
      AutofinanceProductPercentagevalue: { value: '0', error: false },
      IsEbanking:"0",


      //--------------------------------Monthly Expenses
      rawMaterialpurchase: { value: '', error: false },
      utilityExpense: { value: '', error: false },
      salariesandLabourCharges: { value: '', error: false },
      otherExpenses: { value: '', error: false },
      monthlyExpenses: { value: '', error: false },
      //-------------------------------------Libailty
      monthlyInstallment: { value: '', error: false },
      anyOtherMonthly: { value: '', error: false },
      liability: { value: '', error: false },
      businessSavings: { value: '', error: false },

      //------------------------------------MonthlyHouseHold Income
      incomefromOtherSource: { value: '', error: false },
      otherFamilyIncome: { value: '', error: false },
      anyOtherIncome: { value: '', error: false },
      monthlyHouseholdIncome: { value: '', error: false },
      //---------------------------------MonthlyHouseHold Expense
      kitchenExpense: { value: '', error: false },
      childrenExpense: { value: '', error: false },
      utilityExpenses: { value: '', error: false },
      anyOtherExpenses: { value: '', error: false },
      monthlyHouseholdExpense: { value: '', error: false },
      householdLiability: { value: '', error: false },
      householdSavings: { value: '', error: false },

      //---------------------------------------Customer RiskProfile RIsk

      geographicrisk: undefined,
      customerandproductrisk: undefined,
      peprisk: undefined,
      loanUtilizationrisk: undefined,
      loanUtilizationriskname: { value: '', error: false },
      loanUtilizationriskfatherHusbandName: { value: '', error: false },
      loanUtilizationriskcnic: { value: '', error: false },
      borrowerriskprofile: 1,

      geographicriskRemarks: { value: '', error: false },
      customerandProductriskRemarks: { value: '', error: false },
      pepriskRemakrs: { value: '', error: false },
      loanUtilizationriskRemarks: { value: '', error: false },
      loan_customerImage: [{
        key: 1,
        activeTab: false,
        imgName: { value: '', error: false },
        imgValue: undefined,
        addedBy: '',
      }],

      //---------------------------------------Customer RiskProfile ECM RIsk

      EsmProductRisk: undefined,
      EsmProductItemRisk: [],
      EsmProductRiskValue:undefined,


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
      eCreditCutomer:false



    },
  ],
  assestsInfo: [
    {
      key: 1,
      activeTab: false,
      assetName: { value: '', error: false },
      assetQuantity: { value: '1', error: false },
      assetValue: { value: '', error: false },
      assetOwner: { value: '', error: false },
      assetNote: { value: '', error: false },
      assetTagSize: { value: '', error: false },
      assetTagId: { value: '', error: false },
      assetTagName: { value: undefined, error: false },
      assets_Image: [{
        key: 1,
        activeTab: false,
        imgName: { value: '', error: false },
        imgValue: undefined,
      }],
    },
  ],
  familyMemberInfo: [
    // {
    //   key: 1,
    //   activeTab: false,
    //   familyMember_fullname: { value: '', error: false },
    //   familyMember_cnic: { value: '', error: false },
    //   familyMember_relation: { value: '', error: false },
    //   familyMember_age: { value: '', error: false },
    //   familyMember_education: { value: '', error: false },
    //   familyMember_montlyEarning: { value: '', error: false },
    //   familyMember_sourceIncome: { value: '', error: false },
    //   familyMember_businessAddress: { value: '', error: false },
    //   familyMember_genderSelection: { value: '', error: false },
    // },
  ],
  guarantorInfo: [
    // {
    //   key: 1,
    //   activeTab: false,
    //   guarantor_fullname: { value: '', error: false },
    //   guarantor_cnic: { value: '', error: false },
    //   guarantor_address: { value: '', error: false },
    //   guarantor_contactno: { value: '', error: false },
    //   guarantor_jobDescription: { value: '', error: false },
    //   guarantor_businessAddress: { value: '', error: false },
    //   guarantor_jobType: undefined,
    //   guarantor_businessNote: { value: '', error: false },
    //   guarantor_businessStatus: false,
    //   isGroupMember: false
    // },
  ],

};
export const CibReportsArray = 
{
    customerNicNumber: {value:"", error:""},
    CustomerId: {value:"", error:""},
    customerAddedBy: {value:"", index:0,id:""},
    customerRegion: {value:"", index:0,id:""},
    customerStation: {value:"", index:0,id:""},
    customerType: {value:0, index:0},
    customerFirstName: {value:"", error:""},
    customerSonOf:{value:1, text:'', error:""},
    customerDateOfBirth: {value:"", error:""},
    customerNicExpiryDate:{value:"", error:""},
    customerAddress:{value:"", error:""},
    customerDistrict:{value:"", index:0,id:""},
    customerSurname:{value:"", error:""},
    customerGender:{value:1, text:'M', error:""},
    customerFamilyNumber:{value:"", error:""},
    customerCity:{value:"", error:""},
    loanRequestedAmount:{value:"", error:""},
    loanStatus:{value:"Inquiry Processing", index:1},
    loanAssociationType:{value:"PRN", index:0},
    loanApplicationDate:{value:"", error:""},
    loanAccountType:{value:"IN", index:0},
    loanGroupId:{value:"", error:""},
    KinFirstName:{value:"", error:""},   //my code kin one
    KinMiddleName:{value:"", error:""},
    KinLastName:{value:"", error:""},
    KinNicNumber:{value:"", error:""},
    KinsecondFirstName:{value:"", error:""},    //my code kin two
    KinsecondMiddleName:{value:"", error:""},
    KinsecondLastName:{value:"", error:""},
    KinSecondNicNumber:{value:"", error:""}, 
    KinThirdFirstName:{value:"", error:""},    //my code kin one
    KinThirdMiddleName:{value:"", error:""},
    KinThirdLastName:{value:"", error:""},
    KinThirdNicNumber:{value:"", error:""},
    KinFourFirstName:{value:"", error:""},    //my code kin one
    KinFourMiddleName:{value:"", error:""},
    KinFourLastName:{value:"", error:""},
    KinFourNicNumber:{value:"", error:""},
    customerPhoneNumber:{value:"", error:""},
    customerEmail:{value:"", error:""},
    customerMobileNumber:{value:"", error:""},
    customerNotes:{value:"", error:""},
    customerAddedOn:{value:"", error:""},
 
  }
export const CIBTEMP ={
  
    Return: true,
    Message: "Customer Found In microfinance_customers",
    AppData: {
        Return: true,
        sAction2: "addnew",
        iCustomerId: "327544",
        iRegionId: "1002",
        sRegionName: "Bilawal Hingorjo",
        iCustomerType: "1",
        sCustomerType: null,
        sFirstName: "Amto",
        sLastName: "",
        sGuardianType: null,
        sGuardian: "Fayaz Ali",
        sGender: "Female",
        cGender: "F",
        dDateOfBirth: "1999-01-01",
        sDateOfBirth: "January 1, 1999",
        sNICNumber: "44202-0928729-8",
        sFamilyNumber: "K243L4",
        dNICExpiryDate: "2028-11-30",
        sNICExpiryDate: "November 30, 2028",
        sAddress: "Village ghanjhor rainik po khipro taluka khipro district sanghar",
        sCity: "Ghajoor Hapiz Paro",
        iDistrictId: "0",
        sDistrictName: null,
        sPhoneNumber: "",
        sMobileNumber: "03473543903",
        sEmailAddress: "mathoon.chanio@safcosupport.org",
        iStationId: "37",
        sStationCode: "MC",
        sStationName: "MATHOON CHANIO",
        iStatus: null,
        sStatus: null,
        sNotes: null,
        dApplicationDate: null,
        dRequestedAmount: null,
        iStationId_Prev: null,
        iselRegion_Prev: null,
        iselEmployee: null,
        selEmployee_Prev: null,
        itxtNICNumber1: null,
        itxtNICNumber2: null,
        itxtNICNumber3: null,
        selCustomerType_Prev: null,
        itxtNICNumber_Check1: null,
        itxtNICNumber_Check2: null,
        itxtNICNumber_Check3: null
    
}
}

