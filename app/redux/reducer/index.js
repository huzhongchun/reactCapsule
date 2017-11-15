import { combineReducers } from 'redux'
import userInfo from './userInfo'
import passInfo from './passInfo'

export default combineReducers({
    userInfo,
    passInfo
});