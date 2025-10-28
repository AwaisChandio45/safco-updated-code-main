export const ClientSurvey = {
    clientInfo:[
        {
            ///////// Contect Info ///////////////////////////
            customerCnicNumber: {value:'', error:false },
            customerId:{value:'', error:false },
            customerLoanId:{value:'', error:false },
            customerTypeOfLoan:{value:'', error:false },
            customerLoanCycle:{value:'', error:false },
            customerDateOfDisburse:{value:'', error:false },
            customerPhoneNumber:{value:'', error:false },
            customerLoanOfficer:{value:'', error:false },
            customerDateOfSurvey:{value:'', error:false },
            customerName:{value:'', error:false },

            ///// COVID 19 INFORMATION ///////////////////////
            impactBusiness:{
                value:0,
                options:[
                    {id:0,label:'Positively',selected:true},
                    {id:1,label:'Negatively', selected:false}
                ]
            },
            planningReviveIncome:{
                value:0,
                options:[
                    {id:0,label:'Continue with same',selected:true, value:''},
                    {id:1,label:'Take a loan again', selected:false, value:''},
                    {id:2,label:'Try a new business', selected:false, value:''}]
                },
            safcoLoanProduct:{
                value:0,
                options:[
                {id:0,label:'Yes',selected:true, value:''},
                {id:1,label:'No', selected:false, value:''}
            ]},
            recomendProductDesign:{
                product:'', 
                loanAmount:'', 
                paymentTerms:'', 
                error:false
            },
            whoKeptUpdateInfo:{
                value:0,
                options:[
                {id:0,label:'Media',selected:true, value:''},
                {id:1,label:'Villagers', selected:false, value:''},
                {id:2,label:'Safco Team', selected:false, value:''},
                {id:3,label:'Others', selected:false, value:''},
            ]},
            whoProvideSocDistance:{
                value:0,
                options:[
                    {id:0,label:'Media',selected:true, value:''},
                    {id:1,label:'Villagers', selected:false, value:''},
                    {id:2,label:'Safco Team', selected:false, value:''},
                    {id:3,label:'Others', selected:false, value:''}
                ],
            },
            appliedForLoanResch:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:true, value:''},
                    {id:1,label:'No', selected:false, value:''}]
            },
            applyForReschedule:{
                value:0,
                options:[
                    {id:0,label:'Closed Business',selected:true, value:''},
                    {id:1,label:'Poor supply side', selected:false, value:''},
                    {id:2,label:'Cash flow Disturbed', selected:false, value:''},
                    {id:3,label:'Benefit from Govt Scheme', selected:false, value:''}
                ]
                    
            },
            /////////////////// CLIENT SATISFACTION /////////////////////////
            
            // Q 1. Did the employee MFO give you clear and sufficient information on
            // the process and the credit?
            employeeMfoInfo:{
                value:0,
                options:[
                    {id:0,label:'MFO did not give me clear or sufficient information on the process and details on the credit',selected:true, value:''},
                    {id:1,label:'MFO gave me clear or sufficient information on the process but well detailed the credit', selected:false, value:''},
                    {id:2,label:'MFO gave me clear or sufficient information on the process but he did not detail the credit', selected:false, value:''},
                    {id:3,label:'MFO gave me clear or sufficient information on the process and provide me with detailed information on the credit', selected:false, value:''},
                ]
            },
            //////APPLICATION FORM CLEAR? TAKE TIME ///////////////////
            //Q2. When the filling application form, were the explanation clear? Did it take time to fill it?
            appExpClear:{
                value:0,
                options:[
                    {id:0,label:' It was long and explanations were not clear/missing',selected:true, value:''},
                    {id:1,label:'It was long but explanations were clear', selected:false, value:''},
                    {id:2,label:'It was quick but explanations were not clear', selected:false, value:''},
                    {id:3,label:'It was clear and explanations were clear', selected:false, value:''},
                ]
            },
            //How did you find proceure of disbursementat the branch /////
            //Q3
            proceDisbuseAtBranch:{
                value:0,
                options:[
                    {id:0,label:'It was inconvenient (loss of time, have to close shop, need to take time off from work)',selected:true, value:''},
                    {id:1,label:'It was convenient and easy OR the borrower is in different about it', selected:false, value:''},
                    {id:2,label:'It was nice and good to get introduced to the office and/or staff', selected:false, value:''},
                    {id:3,label:'N/A (Disburse did not take place at the branch)', selected:false, value:''},
                ]
            },
            //How you find proceure of disbursementat the branch did it take time
            //Q4
            disburseTakeTime:{
                value:0,
                options:[
                    {id:0,label:'It was long and explanations were not clear/missing',selected:true, value:''},
                    {id:1,label:'It was long but explanations were not clear', selected:false, value:''},
                    {id:2,label:'It was Quick but explanations were not clear/missing', selected:false, value:''},
                    {id:3,label:'It was Quick and explanations were not clear', selected:false, value:''},
                    {id:4,label:'(Disburse did not take place at the branch)', selected:false, value:''},
                ]
            },
            //How many minutes take to arrive at branch //////
            //Q5
            arriveTakeTime:{
                value:0,
                options:[
                    {id:0,label:'Less than 10 minutes',selected:true, value:''},
                    {id:1,label:'Between 10 and 30 minutes', selected:false, value:''},
                    {id:2,label:'More than 30 minutes ONA (Client never visited the branch)', selected:false, value:''},
                ]
            },
            //how was the reception when you entered to the branch ////
            //Q6
            branchReception:{
                value:0,
                options:[
                    {id:0,label:'There was nobody OR the staff did not look at me or welcome me',selected:true, value:''},
                    {id:1,label:'The staff welcomed me but i did not like the way he/she did OR not really polite', selected:false, value:''},
                    {id:2,label:'He/She welcomed me kindly without telling me few words to wait', selected:false, value:''},
                    {id:3,label:'He/She welcomed me kindly and kindly asked me to wait / get seated',selected:false, value:''},
                ]
            },
            //how long did you wait before staff assisted you
            //Q7
            didYouWait:{
                value:0,
                options:[
                    {id:0,label:'I did not wait',selected:true, value:''},
                    {id:1,label:'Less than 10 minutes', selected:false, value:''},
                    {id:2,label:'Between 10 and 30', selected:false, value:''},
                    {id:3,label:'More than thirty', selected:false, value:''},
                    {id:4,label:'NA (client never visited the branch)', selected:false, value:''}
                ]
            },
            //where did you repay your loan
            //Q8
            repayLoan:{
                value:0,
                options:[
                    {id:0,label:'In Branch',selected:true, value:''},
                    {id:1,label:'Door-step',selected:false, value:''},
                    {id:2,label:'In field area', selected:false, value:''},
                    {id:3,label:'Branchless banking service', selected:false, value:''},
                    {id:4,label:'Handed over to activist (third party)', selected:false, value:''},
                ]
            },
            //repayment outlet provide convinent opening hours to you?
            //Q9
            provConvOpenHours:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:true, value:''},
                    {id:1,label:'No', selected:false, value:''}
                ]
            },
            //Q10.Did you wait? How long did you wait before someone/staff assisted you?///
            howLongYouWait:{
                value:0,
                options:[
                    {id:0,label:'I did not wait',selected:true, value:''},
                    {id:1,label:'Less than 10 minutes', selected:false, value:''},
                    {id:2,label:'Between 10 and 30 More than thirty', selected:false, value:''}
                ]
            },
            //Q 11.Was the repayment process quick except waiting time?e//
            processQuickExptWaitTime:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:true, value:''},
                    {id:1,label:'No', selected:false, value:''}
                ]
            },
            //Q 12.Did the SAFCO staff and ADC representative serve you well there?//
            staffServeYouWell:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:true, value:''},
                    {id:1,label:'No', selected:false, value:''}
                ]
            },
            //Q 13.How frequent does our employee (MFO) visit you?
            frequentEmpVisitYou:{
                value:0,
                options:[
                    {id:0,label:'Once in a month',selected:true, value:''},
                    {id:1,label:'Every 1-2 months', selected:false, value:''},
                    {id:2,label:'More than 2 months', selected:false, value:''},
                    {id:3,label:'Before I have to renew the loan', selected:false, value:''},
                    {id:4,label:'He never visits', selected:false, value:''}
                ]
            },
            //Q 14.Do you face difficulty in contacting the employee (MFO) Unreachable?
            contactTheEmployee:{
                value:0,
                options:[
                    {id:0,label:'Unreachable, I have messages and He/She never return my calls',selected:true, value:''},
                    {id:1,label:'He/She gives me a missed call for me to call him/her', selected:false, value:''},
                    {id:2,label:'He/She return my call but after a certain period of time (> 3 days)', selected:false, value:''},
                    {id:3,label:'He/She return my calls in a good time (2-3 days)', selected:false, value:''},
                    {id:4,label:'I reach him/her OR he/she return my calls quickly (less than 2 days)', selected:false, value:''}
                ]
            },
            //Q 15.Does employee (MFO) do an effort to respond to your needs and solve your problems?
            EmpDoesEffort:{
                value:0,
                options:[
                    {id:0,label:'The MFO does not give me any information, or it is not clear, and does not provide enough information ',selected:true, value:''},
                    {id:1,label:'The MFO does the minimum but does not try to spend more time with me to give advice', selected:false, value:''},
                    {id:2,label:'The MFO is willing to and committed to offering me better service, understands my problems and solve them', selected:false, value:''},
                    {id:3,label:'No', selected:false, value:''}
                ]
            },
            //Q 16. To what extend are you satisfied with characteristics of your group loan?
            youSatisfiedWithLoan:{
                value:0,
                options:[
                    {id:0,label:'I was not satisfied and do not want any other loan',selected:true, value:''},
                    {id:1,label:'I was not satisfied and would prefer to take IL', selected:false, value:''},
                    {id:2,label:"I was satisfied but would prefer to take IL (however I don't qualify)", selected:false, value:''},
                    {id:3,label:'I was satisfied but would prefer to take IL (and I will apply to IL)', selected:false, value:''},
                    {id:4,label:'I am satisfied and still prefer GL', selected:false, value:''},
                    {id:5,label:"N/A (client's loan is not GL)", selected:false, value:''},
                ]
            },
            //Q 17.For group loan only: what are the reasons of satisfaction and dissatisfaction?
            reasonsOfSatisfaction:{
                value:0,
                options:[
                    {id:0,label:'It provides me with the needed support',selected:true, value:''},
                    {id:1,label:'It gives me idea to develop my business', selected:false, value:''}
                ]
            },
            //Q 18.To what extend are you satisfied with characteristics of your credit? Does it serve your needs?
            characOfCredit:{
                value:0,
                options:[
                    {id:0,label:'Credit is not appropriate at all to my needs and to what i expected',selected:true, value:''},
                    {id:1,label:'Credit is ok but some improvements are still needed', selected:false, value:''},
                    {id:2,label:'Credit totally suit my needs ', selected:false, value:''}
                ]
            },
            //Q 19.Are you dealing with or thinking of dealing with another financial institution?
            dealingFinancialInstitute:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:true, value:''},
                    {id:1,label:'No', selected:false, value:''},
                    {id:2,label:'I am thinking about it', selected:false, value:''}
                ]
            },
            //For What reason
            forWhatReason:{
                value:0,
                options:[
                    {id:0,label:'Suitability of ToRs',selected:true, value:''},
                    {id:1,label:'Loan Size', selected:false, value:''},
                    {id:2,label:'Seasonal financial requirements', selected:false, value:''}
                ]
            },
            //Q 20.Do our existing loan products meets your need? 
            productMeetYourNeed:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:true, value:''},
                    {id:1,label:'No', selected:false, value:''},
                ]
            },
            //If No then what reasons?
            ifNoReason:{
                value:0,
                options:[
                    {id:0,label:'Loan Size',selected:false, value:''},
                    {id:1,label:'Repayment Frequency', selected:false, value:''},
                    {id:2,label:'Loan Requirements', selected:false, value:''},
                ],
                anyOther:{value:'', error:false},
            },

            //Q 21Are you interested to borrow our House Finance Loan from Safco?
            houseFinanceLoan:{
                value:0,
                options:[
                    {id:1,label:'Yes',selected:true, value:''},
                    {id:0,label:'No', selected:false, value:''},
                ]
            },
            //If Yes,then for what purpose?
            ifYesPurpose:{
                value:0,
                options:[
                    {id:0,label:'Home Renovation',selected:true, value:''},
                    {id:1,label:'New home construction of new house', selected:false, value:''},
                    {id:2,label:'Purchase of Plot',selected:false, value:''},
                ]
            },
            //For Construction of new house,what would be your preference for loan from Safco?
            forConstructNewHouse:{
                value:0,
                options:[
                    {id:0,label:'Safco provide the loan amount and I will construct myself',selected:true, value:''},
                    {id:1,label:'Safco provide construction facility rather than the loan amount ', selected:false, value:''},
                ]
            },
            //Q 22.Are you interested to borrow out Auto Finance Loan i,e. for Motor Cycle, Rickshaw, Qingqi or Loader?
            autoFinanceLoan:{
                value:0,
                options:[
                    {id:0,label:'Yes',selected:false, value:''},
                    {id:1,label:'No', selected:true, value:''},
                ]
            },
            //If Yes,then which vehicle you want to purchase from Safco?
            whichVehcleWantPurchase:{
                value:0,
                options:[
                    {id:0,label:'Motorcycle',selected:true, value:''},
                    {id:1,label:'Rickshaw', selected:false, value:''},
                    {id:2,label:'Qingqi', selected:false, value:''},
                    {id:3,label:'Loader', selected:false, value:''},
                ]
            },
            //Which mode of finance do you prefer? 
            modeOfFinance:{
                value:0,
                options:[
                    {id:0,label:'We market loan and you purchase the vehicle by yourself locally from market',selected:true, value:''},
                    {id:1,label:'We finance the vehicle at the market price your down payment contribution', selected:false, value:''},
                ]
            },
        }   
    ]
}