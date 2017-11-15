import * as actionTypes from '../../constants/userInfo'

function update(data) {
    return {
        type: actionTypes.USERINFO_UPDATE,
        data
    }
}

export default {
    update
}