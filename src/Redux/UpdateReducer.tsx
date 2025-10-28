let initialState={
    updateCheck:{value:false, id: null},
}

export default function UpdateReducer(currentState=initialState,action){
switch (action.type) {
        case "SET_UPDATECHECK":
            return {
                updateCheck:action.payload,
                // ...currentState
            }
       
    default:return currentState;
        
}
}