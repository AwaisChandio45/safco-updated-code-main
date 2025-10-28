let initialState={
    forms:[],
}

export default function FormsReducer(currentState=initialState,action){
switch (action.type) {
    case "FORM":
        return {
            forms:action.payload,
        }   
    default:return currentState;
        
}
}