import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'
import ListItem from '../../components/ListItem'
import List from '../../components/List'
import './less/style.less'

class Category extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state ={
            data: null
        }
    }

    componentWillMount() {
        // console.log('willMount');
    }

    componentDidMount() {

    }


    render() {
        return (
            <div className="book-list">
                {
                    this.state.data?
                    this.state.data.map((item,index)=>{
                        return <ListItem data={item} />
                    })
                    : <div className="no-data">暂无数据</div>
                }
            </div>
        )
    }
}


    export default Category

