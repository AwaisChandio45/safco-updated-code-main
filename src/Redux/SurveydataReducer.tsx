import { ClientSurvey } from "../utilis/ClientSurvey";

let initialState={
    SurveyData:ClientSurvey,
}

export default function SurveyData(currentState=initialState,action){
switch (action.type) {
        case "SurveyData":
            return {
                SurveyData:action.payload,
                // ...currentState
            }
       
    default:return currentState;       
}
}