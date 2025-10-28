let initialState={
    tempForm:{value:false, id: null},
}

export default function TempFormReducer(currentState=initialState,action){
switch (action.type) {
        case "SET_TempFormReducer":
            return {
                tempForm:action.payload,
                // ...currentState
            }
       
    default:return currentState;
        
}
}