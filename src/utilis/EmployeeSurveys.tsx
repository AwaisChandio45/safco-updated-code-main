export const EmployeeSurveys = {
  employeeInfo:[
      {
          ///////// Contect Info ///////////////////////////
          HRId:{value:'', error:false },
          StationId:{value:'', error:false },
          employeeDesignation: {value:'', error:false },
          
          employeeDateOfSurvey:{value:'', error:false },
          employeeName:{value:'', error:false },

          ///// About Safco Microfinance Company ///////////////////////
          safcoMicrofinancePart:{
              value:0,
              options:[
                {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},


              ],
              comment: {value: '', error: false},
          },
          TopManagementpays:{
              value:0,
              options:[
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
          
          AboutWork:{
              value:0,
              options:[
                {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},
              ],
              comment: {value: '', error: false},
          },
          
          //Q. 4. I am satisfied with my job and the kind of work I do?
          satisfiedJob:{
              value:0,
              options:[
                {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},
              ],
              comment: {value: '', error: false},
          },
          //Q. 5. My job is challenging and interesting? /////
          
          challengingJob:{
              value:0,
              options:[
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
          presentJob:{
              value:0,
              options:[
                {id:0,label:'Very Dissatisfied',selected:true, value:''},
                {id:1,label:'Dissatisfied', selected:false, value:''},
                {id:2,label:'Neither Satisfied nor Dissatisfied',selected:false, value:''},
                {id:3,label:'Satisfied', selected:false, value:''},
                {id:4,label:'Very Satisfied', selected:false, value:''},
              ],
              comment: {value: '', error: false},
          },
           /////////////////// AboutWork /////////////////////////
          
          //I am satisfied with the opportunities for(Of) training?
          //Q7
          satisfiedOpportunities:{
            value:0,
            options:[
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
          fillVacancies:{
            value:0,
            options:[
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
         
      }   
  ]
}