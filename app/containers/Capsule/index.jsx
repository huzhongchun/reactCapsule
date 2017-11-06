import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import List from '../../components/List'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import './less/style.less'

class Capsule extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentWillMount(){
        // console.log('willMount');
    }
    componentDidMount(){

    }
    render() {
        return (
            <div>
                <div className="banner">
                    <a href="/chicken/page/pass_center">
                        <img src="//resource-thefair.oss-cn-qingdao.aliyuncs.com/_assets/touch/chicken/capsule/images/banner.png?v=2017102610" />
                    </a>
                </div>
                <List title={'最新上架'} />
            </div>
        )
    }

}

export default Capsule

