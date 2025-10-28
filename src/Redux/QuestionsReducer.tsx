let initialState={
    questionArray:[],
}

export default function QuestionsReducer(currentState=initialState,action){
switch (action.type) {
    case "QUESTION":
        return {
            questionArray:action.payload,
        }   
    default:return currentState;
        
}
}