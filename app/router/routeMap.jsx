import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import Console from '../util/console'
import App from '../containers'
import Detail from '../containers/Detail'
import NotFound from '../containers/404'
import Capsule from '../containers/Capsule'
import Category from '../containers/Category'

class RouterMap extends React.Component {

    updateHandle(){
        Console.i('Route Changed.');
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
                    <IndexRoute component={Capsule} />
                    <Route path='chicken/page/item_detail/:item_id'  component={Detail}/>
                    <Route path='chicken/page/capsule_index_react' component={Capsule} />
                    <Route path='chicken/page/category' component={Category} />
                    <Route path='*' component={NotFound} />
                </Route>
            </Router>
        )
    }
}

export default RouterMap
