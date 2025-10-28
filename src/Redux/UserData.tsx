let initialState={
    UserData:undefined,
}

export default function UserData(currentState=initialState,action){
switch (action.type) {
        case "UserData":
            return {
                UserData:action.payload,
                // ...currentState
            }
       
    default:return currentState;
        
}
}