import { EmployeeSurveys } from "../utilis/EmployeeSurveys";

let initialState={
    SurveyDatas:EmployeeSurveys,
}

export default function SurveyDatas(currentState=initialState,action){
switch (action.type) {
        case "SurveyDatas":
            return {
                SurveyDatas:action.payload,
                // ...currentState
            }
       
    default:return currentState;       
}
}