import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import configureStore from './redux/store/configureStore'

import './static/css/common.less'

let initStore = {
    userInfo: {
        nick: $('.hidden-nick-value').val()
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
