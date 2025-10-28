
let initialState={
    groupArray:{
        groupName:{value: '', error: false},
        groupStatus:{value: 'Processed', error: false},
        groupNote:{value: '', error: false},
        groupMembers:[],
        ///////////////////////////comment
        addedBy:{value: '', error: false},
        addedByDesignation:{value: '', error: false},
        commentOfAddedby:{value: '', error: false},
        verifiedBy:{value: '', error: false},
        verifiedByDesignation:{value: 'Branch Manager', error: false},
        commentsofVerifiedby:{value: '', error: false},
        groupImage:undefined,
        groupLocation:undefined,

        //-------------------------------Verify Indicator
        counductPhysicalVisit:{value: 1, error: false},
        verifiedreApparisal:{value: 1, error: false},
        verifiedRepaymentHistory:{value: 1, error: false},
        criticalAssetsValuation:{value: 1, error: false},
        verifiedbyContactNumber:{value: 1, error: false},
        meetwithSocialResponsible:{value: 1, error: false},
        meetwithPersonalGuarantee:{value: 1, error: false},
        verifiedProvidedDoc:{value: 1, error: false},
        borrowerCashFlow:{value: 1, error: false},
        supportingCnicForFemale:{value: 1, error: false},
        borrowerRepaymentCapacity:{value: 1, error: false},
        borrowerBusinessORHome:{value: 1, error: false},
        repaymentCapacityAnalysis:{value: 1, error: false},
        isTheLoanPricingIsClearlyDisclosed:{value: 1, error: false},
        isTheBorrowerInformedAboutTheGrievance:{value: 1, error: false},
        isTheBorrowerAwareAboutTheCollateral:{value: 1, error: false},
        anyMajorRisksInvolvedInBusiness:{value: 1, error: false, detail:null},             
        //----------------------------Compailance
        amlPolicyandProcedure:{value: 1, error: false},
        socialandManagmentPolicy:{value: 1, error: false},
        verifiedCIBPolicy:{value: 1, error: false},
        doesBorrowerEnivro:{value: 1, error: false},
        doesEnterprise:{value: 1, error: false},
        //////////////////////////////---S RISK--------
        riskAssementno1:{value: '', error: false},
        riskAssementno2:{value: '', error: false},
        riskAssementno3:{value: '', error: false},
        riskAssementTimelineone:{value: '', error: false},
        riskAssementTimelinetwo:{value: '', error: false},
        riskAssementTimelinethree:{value: '', error: false},
        visitedBorrower:{value: '', error: false},
        borrowerName:{value: '', error: false},
        borrowerAddress:{value: '', error: false},
        borrowerPhone:{value: '', error: false},
        borrowerStaification:{value: '', error: false},
        socialAppraisal:{value: '', error: false},
        borrowerApproval:{value: '', error: false},
        borrowerRemarks:{value: '', error: false},
         //-----------   Loan Verification 
         verificationofficerName: { value: '', error: false },
         verificationByDesignation: { value: 'Verification Officer', error: false },
         verificationComments: { value: '', error: false },
         visitType: { value: '', index: 0 },
         groupImagebyVerificationOff: undefined,
         verificationOffLoc: undefined,
}
}

export default function FormsReducer(currentState=initialState,action){
switch (action.type) {
    case "GROUPARRAY":
        return {
            groupArray:action.payload,
        }   
    default:return currentState;
        
}
}