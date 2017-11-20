import * as actionTypes from '../../constants/wechatShareInfo'

const initialState = {};

export default function wechatShare (state = initialState, action) {
    switch (action.type) {
        case actionTypes.WECAHT_SHARE_SETTING_UPDATE:
            return Object.assign({},state,action.data);
        default:
            return state
    }
}