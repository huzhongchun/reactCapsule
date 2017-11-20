import * as actionTypes from '../../constants/wechatShareInfo'

function update(data) {
    return {
        type: actionTypes.WECAHT_SHARE_SETTING_UPDATE,
        data
    }
}

export default {
    update
}