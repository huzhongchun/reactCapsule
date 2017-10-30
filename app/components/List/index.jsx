import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'
import LoadMore from '../../components/LoadMore'
import Item from './Item'

import LazyLoad from '../../components/LazyLoad/index'
import './style.less'
import {getListData} from '../../fetch/Capsule/index'

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state ={
            initData: false,
            isLoadingMore: false,
            page: 0,
            item_list: [],
            last_item_id: null,
            hasMoreData: true,
            lazyLoadObj: null
        }
    }
    componentWillMount(){
        console.log('willMount');
    }
    componentDidMount(){
        setTimeout(()=> {
            this.loadFirstPageData();
        },1000);

        //图片懒加载
        let lazy = new LazyLoad({
            threshold: 400,
            selector: '.lazy-img'
        });
        this.setState({
            lazyLoadObj: lazy
        })
    }

    // 获取首页数据
    loadFirstPageData() {
        const result = getListData(0);
        this.resultHandle(result)
    }
    // 加载更多数据
    loadMoreData() {
        // 记录状态
        this.setState({
            isLoadingMore: true
        });

        const lastItemId = this.state.last_item_id;
        if(lastItemId) {
            const result = getListData(lastItemId);
            this.resultHandle(result);
        }else{

        }
    }
    // 处理数据
    resultHandle(result) {
        result.then(res => {
            return res.json()
        }).then(data => {
            const lastItemId = data.result.last_item_id;
            const itemList = data.result.item_list;

            this.setState({
                initData: true,
                last_item_id: lastItemId,
                hasMoreData: !!lastItemId,
                //拼接到原数据之后，使用 concat 函数
                item_list: this.state.item_list.concat(itemList),
                isLoadingMore: false
            });
            this.state.lazyLoadObj.refresh();
        }).catch(e => {
            console.log(e);
            if (__DEV__) {
                console.error('获取数据报错, ', e.message)
            }
        })
    }

    render() {
        return (
            <div className="block-area">
                {
                    this.props.title ?
                        <div className="block-title">
                            <span className="title-box">{this.props.title}</span>
                        </div>
                        : ''
                }
                <div className="book-list">
                    {
                        this.state.initData ?
                            (this.state.item_list && this.state.item_list.length >0 ?
                                this.state.item_list.map((item, index) => {
                                    return <Item key={index} data={item}/>
                                })
                                : <div className="no-data">列表暂无数据</div>)
                            : <div className="loading-data">数据加载中..</div>
                    }
                </div>
                {
                    this.state.last_item_id
                        ? <LoadMore isLoadingMore={this.state.isLoadingMore} loadMoreFn={this.loadMoreData.bind(this)}/>
                        : (this.state.hasMoreData ?  '' : <div className="no-more">我是有底线的~</div>)
                }
            </div>
        )
    }
}

export default List