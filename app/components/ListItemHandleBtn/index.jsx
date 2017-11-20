import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Payment from '../../static/js/payment'

class ListItemHandleBtn extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: null,
            loading: false
        }
    }
    componentWillMount(){

    }
    componentDidMount(){
        this.setState({
            data: this.props.data
        })
    }
    //点击事件
    handleClick(data) {
        let _this = this;
        if (!this.state.loading && ['direct_pay','free','pass'].includes(_this.state.data.status)){
            this.setState({
                loading: true
            });
            let source = $('.hidden-source-value').val();
            let method = $(this).attr('data-method');
            Payment.callPayment({
                displayCheckDialog: method !== 'direct',
                paymentInfo: {
                    params: {
                        item_id: data.item_id,
                        sku_no: data.sku_list[0].sku_no,
                        __s: source
                    },
                    success: function (res) {
                        $(this).addClass('payed');
                        _this.setState({
                            loading: false,
                            data: Object.assign(_this.state.data,{
                                status: _this.state.data.item_type === 'article_item'? 'read':'play'
                            })
                        });
                    },
                    fail: function (res) {

                    },
                    finish: function (res) {
                        _this.setState({
                            loading: false
                        });
                    }
                },
                cancelPayment: function () {
                    // $(_this).removeClass('loading');
                }
            });
        }else if(_this.state.data.status === 'read'){
            //阅读
            window.location.href = '/chicken/page/reader?item_id='+_this.state.data.item_id;
        }else if(_this.state.data.status === 'play'){
            //播放
        }
    }
    render() {
        let status = this.state.data.status, tpl = '',data = this.state.data;
        switch(status){
            case 'play':
                tpl = <div className={this.state.loading ? 'handle-btn handle-play-btn loading': 'handle-btn handle-play-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                        <span className="btn-text">播放</span>
                    </div>;
                break;
            case 'read':
                tpl = <div className={this.state.loading ? 'handle-btn handle-play-btn loading': 'handle-btn handle-play-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">开始阅读</span>
                </div>;
                break;
            case 'review':
                tpl = <div className={this.state.loading ? 'handle-btn handle-play-btn loading': 'handle-btn handle-play-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">复习</span>
                </div>;
                break;
            case 'direct_pay':
                tpl = <div className={this.state.loading ? 'handle-btn handle-buy-btn loading': 'handle-btn handle-buy-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">购买 ¥{data.price}</span>
                </div>;
                break;
            case 'free':
                tpl = <div className={this.state.loading ? 'handle-btn handle-buy-btn loading': 'handle-btn handle-buy-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">{data.item_type === 'audio_item'? '免费试听': '免费领取'}</span>
                </div>;
                break;
            case 'pass':
                tpl = <div className={this.state.loading ? 'handle-btn handle-buy-btn loading': 'handle-btn handle-buy-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">￥0.00领取</span>
                </div>;
                break;
            case 'offshelf':
                tpl = <div className="handle-btn handle-off-btn" onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">已下架</span>
                </div>;
                break;
            case 'wish':
                tpl = <div className={this.state.loading ? 'handle-btn handle-reserve-btn loading': 'handle-btn handle-reserve-btn'} onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">预约</span>
                </div>;
                break;
            case 'wished':
                tpl = <div className="handle-btn handle-reserve-btn reserved" onClick={this.handleClick.bind(this,this.state.data)} data-btn_status={this.state.data.status} data-url_scheme={this.state.data.action && this.state.data.action.url ? this.state.data.action.url : ''}>
                    <span className="btn-text">已预约</span>
                </div>;
                break;
        }
        return (
                tpl
        )
    }
}

export default ListItemHandleBtn;