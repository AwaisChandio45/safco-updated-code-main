let initialState={
    topupLoanArray:[],
}

export default function QuestionsReducer(currentState=initialState,action){
switch (action.type) {
    case "TOPUPLOAN":
        return {
            topupLoanArray:action.payload,
        }   
    default:return currentState;
        
}
}