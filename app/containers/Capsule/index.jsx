import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import List from '../../components/List'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import userInfoActions from '../../redux/actions/userInfo'
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
        //触发redux修改用户信息
        this.props.userInfoActions.update({
            nick:'huzhongchun',
            name: '胡仲春'
        });

        //设置title   ，以后封装统一方法
        document.title = '新世相读书会';
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


// -------------------redux react 绑定--------------------

function mapStateToProps(state){
    return {
        userInfo: state.userInfo
    }
}
function  mapDispatchToProps(dispatch) {
    return {
        userInfoActions: bindActionCreators(userInfoActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Capsule)

