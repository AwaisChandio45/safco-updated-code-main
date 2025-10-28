let initialState={
    regions:[],
}

export default function EmpRegionsReducer(currentState=initialState,action){
switch (action.type) {
    case "REGIONS":
        return {
            regions:action.payload,
        }   
    default:return currentState;
        
}
}