import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import App from '../containers'
import Detail from '../containers/Detail'
import NotFound from '../containers/404'
import Capsule from '../containers/Capsule'

// 如果是大型项目，router部分就需要做更加复杂的配置
// 参见 https://github.com/reactjs/react-router/tree/master/examples/huge-apps

class RouterMap extends React.Component {
    render() {
        return (
            <Router history={this.props.history}>
                <Route path='/' component={App}>
                    <IndexRoute component={Capsule}/>
                    <Route path='/detail/:item_id' component={Detail}/>
                    <Route path='*' component={NotFound}/>
                </Route>
            </Router>
        )
    }
}

export default RouterMap
