import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'
import ListItem from '../../components/ListItem'
import LazyLoad from '../../static/widget/lazyLoad'
import './less/style.less'
import Player from '../../components/Player'

import {getListData} from '../../fetch/Listen'

class Category extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state ={
            data: null,
            isFetching: true,
        }
    }

    componentWillMount() {
        // console.log('willMount');
    }

    componentDidMount() {

        //图片懒加载
        let lazy = new LazyLoad({
            threshold: 400,
            selector: '.lazy-img'
        });

        let result = getListData();
        result.then((res)=>{
            return res.json()
        }).then((data)=>{
            this.setState({
                data: data.result
            });
            lazy.refresh();
        });

    }


    render() {
        return (
        <div>
            <div className="book-list">
                {
                    this.state.data&&this.state.data.item_list?
                    this.state.data.item_list.map((item,index)=>{
                        return <ListItem key={index} data={item} />
                    })
                    : <div className="no-data">加载中...</div>
                }
            </div>
            <Player />
        </div>
        )
    }
}


    export default Category

