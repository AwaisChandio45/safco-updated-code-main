import { CustomGetDataModule } from "../utilis/RequiredArrays";

let initialState={
    CustomGetDataModule:CustomGetDataModule
}

export default function FormsReducer(currentState=initialState,action){
switch (action.type) {
    case "CustomGetDataModule":
        return {
            CustomGetDataModule:action.payload,
        }   
    default:return currentState;
        
}
}