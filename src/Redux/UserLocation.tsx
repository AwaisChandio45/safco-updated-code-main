let initialState={
    UserLocation:undefined,
}

export default function UserLocation(currentState=initialState,action){
switch (action.type) {
        case "UserLocation":
            return {
                UserLocation:action.payload,
                // ...currentState
            }
       
    default:return currentState;
        
}
}