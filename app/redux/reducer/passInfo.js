import * as actionTypes from '../../constants/passInfo'

const initialState = {};

export default function passInfo (state = initialState, action) {
    switch (action.type) {
        case actionTypes.PASSINFO_UPDATE:
            return action.data;
        default:
            return state
    }
}