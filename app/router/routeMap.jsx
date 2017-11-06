import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import App from '../containers'
import Detail from '../containers/Detail'
import NotFound from '../containers/404'
import Capsule from '../containers/Capsule'
import Chicken from '../containers/Chicken'
import Page from '../containers/Chicken/Page'


// 如果是大型项目，router部分就需要做更加复杂的配置
// 参见 https://github.com/reactjs/react-router/tree/master/examples/huge-apps

class RouterMap extends React.Component {

    updateHandle(){
        console.log('每次router变化');
    }
    onEnter(component){
        // console.log(history.length);
    }
    onLeave(component){

    }
    render() {
        return (
            <Router history={this.props.history} onUpdate={this.updateHandle.bind(this)} >
                <Route path='/' component={App} >
                    <IndexRoute component={Capsule} onEnter={this.onEnter.bind(this,'capsule_index')} onLeave={this.onLeave}  />
                    <Route path='chicken/page/item_detail/:item_id'  component={Detail}/>
                    <Route path='chicken/page/capsule_index_react' component={Capsule} />
                    <Route path='*' component={NotFound} />
                </Route>
            </Router>
        )
    }
}

export default RouterMap
