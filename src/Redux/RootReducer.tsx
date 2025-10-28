import { combineReducers } from 'redux';

import UpdateReducer from './UpdateReducer'
import FormsReducer from './FormsReducer'
import UserData from './UserData'
import QuestionsReducer from './QuestionsReducer'
import StationReducer from './StationReducer'
import RequiredReducer from './RequiredReducer'
import GroupArrayReducer from './GroupArrayReducer'
import TopupLoanReducer from './TopupLoanReducer'
import SurveyData from './SurveydataReducer';
import SurveyDatas from './SurveyDatasReducer';
import CommentsReducer from './CommentsReducer';
import CustomerAnsReducer from './CustomerAnsReducer';
import EmpRegionsReducer from './EmpRegionsReducer';
import UserLocation from  './UserLocation';
import TempFormReducer from  './TempFormReducer';
import SyncdownReducer from  './SyncdownReducer';
import CIBReportReducer from  './CIBReportReducer';












export default combineReducers({
    UpdateReducer: UpdateReducer,
    FormsReducer: FormsReducer,
    UserData: UserData,
    QuestionsReducer:QuestionsReducer,
    StationReducer:StationReducer,
    RequiredReducer:RequiredReducer,
    GroupArrayReducer:GroupArrayReducer,
    TopupLoanReducer:TopupLoanReducer,
    SurveyData: SurveyData,
    SurveyDatas: SurveyDatas,
    CommentsReducer: CommentsReducer,
    CustomerAnsReducer:CustomerAnsReducer,
    EmpRegionsReducer:EmpRegionsReducer,
    UserLocation:UserLocation,
    TempFormReducer:TempFormReducer,
    SyncdownReducer:SyncdownReducer,
    CIBReportReducer:CIBReportReducer,


})