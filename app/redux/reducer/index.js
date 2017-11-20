import { combineReducers } from 'redux'
import userInfo from './userInfo'
import wechatShare from './wechatShare'

export default combineReducers({
    userInfo,
    wechatShare
});