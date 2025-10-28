let initialState={
    syncDown:"",
}

export default function FormsReducer(currentState=initialState,action){
switch (action.type) {
    case "SYNCDOWN":
        return {
            syncDown:action.payload,
        }   
    default:return currentState;
        
}
}