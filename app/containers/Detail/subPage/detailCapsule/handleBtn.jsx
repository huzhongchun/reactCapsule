import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Payment from '../../../../static/js/payment'

class handleBtn extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: null,
            loading: false
        }
    }
    componentWillMount(){
        this.setState({
            data: this.props.data
        })
    }
    componentDidMount(){

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
                tpl = '';
                break;
            case 'read':
                tpl = <div className="btn-group group-read">
                    <span className="handle-btn handle-play-btn" onClick={this.handleClick.bind(this,this.state.data)}>
                        <span className="btn-text">立即阅读</span>
                    </span>
                </div>;
                break;
            case 'review':
                tpl = '';
                break;
            case 'direct_pay':
                tpl = <div className="btn-group group-no-pass">
                    <div className={this.state.loading ? 'handle-btn handle-buy-btn loading': 'handle-btn handle-buy-btn'} data-btn_status={this.state.data.status} onClick={this.handleClick.bind(this,this.state.data)} data-method="direct">
                        <span className="btn-text">立即购买 ¥{data.price}</span>
                    </div>
                </div>;
                break;
            case 'free':
                tpl = <div className="btn-group group-free">
                    <div className={this.state.loading ? 'handle-btn handle-buy-btn loading': 'handle-btn handle-buy-btn'} data-btn_status={this.state.data.status} onClick={this.handleClick.bind(this,this.state.data)} data-method="direct">
                        <span className="btn-text">今日限免，免费领取</span>
                    </div>
                </div>;
                break;
            case 'pass':
                tpl =  <div className="btn-group group-pass">
                    <div className={this.state.loading ? 'handle-btn handle-buy-btn loading': 'handle-btn handle-buy-btn'} data-btn_status={this.state.data.status} onClick={this.handleClick.bind(this,this.state.data)} data-method="direct">
                        <span className="btn-text">￥0.00领取</span>
                    </div>
                </div>;
                break;
            case 'offshelf':
                tpl = <div className="btn-group group-pass">
                        <span className="handle-btn handle-off-btn" >
                            <span className="btn-text">已下架</span>
                        </span>
                    </div>;
                break;
            case 'wish':
                tpl = '';
                break;
            case 'wished':
                tpl = '';
                break;
        }
        return (
                tpl
        )
    }
}

export default handleBtn;