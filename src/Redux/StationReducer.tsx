let initialState={
    station:undefined,
}

export default function FormsReducer(currentState=initialState,action){
switch (action.type) {
    case "STATION":
        return {
            station:action.payload,
        }   
    default:return currentState;
        
}
}