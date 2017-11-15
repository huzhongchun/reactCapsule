import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import configureStore from './redux/store/configureStore'

import './static/css/common.less'

let initStore = {
    userInfo: {
        name: 'huzhongchun',
        avatar: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKo17faASULS5nxqibFs9AViaBTxetDxL0mB0btnN9I7LscgTQOBlxgQpuDicQQmSwDICXrdcS87gZCg/0?ts=1510391460?t=111'
    },
    passInfo:{
        alias: '年卡会员'
    }
};
// 创建 Redux 的 store 对象
const store = configureStore(initStore);
//订阅
// store.subscribe(()=>{
//     console.log(store.getState());
// });
import RouteMap from './router/routeMap'

render(
    <Provider store={store}>
        <RouteMap history={browserHistory}/>
    </Provider>,
    document.getElementById('scale-wrapper')
);
