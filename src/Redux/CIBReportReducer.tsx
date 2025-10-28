import { CibReportsArray } from "../utilis/RequiredArrays";

let initialState={
    CIBReportObject:CibReportsArray
}

export default function FormsReducer(currentState=initialState,action){
switch (action.type) {
    case "CIBReportObject":
        return {
            CIBReportObject:action.payload,
        }   
    default:return currentState;
        
}
}