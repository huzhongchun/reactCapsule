/**
 * Created by huzhongchun on 2017/7/24.
 */
import '../css/payment.css';
import _common from './common.js';


    //是否显示pass
    var _isShowPass = $('.hidden-show_pass-value').val();


    //吊起微信支付
    function chooseWXPay(options) {
        if (typeof WeixinJSBridge === "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', function () {
                    getBrandWCPayRequest(options);
                }, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', function () {
                    getBrandWCPayRequest(options);
                });
                document.attachEvent('onWeixinJSBridgeReady', function () {
                    getBrandWCPayRequest(options);
                });
            }
        }else{
            getBrandWCPayRequest(options);
        }
    }

    //微信js api
    function getBrandWCPayRequest(options) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                appId: options.signInfo.appId,
                timeStamp: options.signInfo.timeStamp,
                nonceStr: options.signInfo.nonceStr,
                package: options.signInfo.package,
                signType: options.signInfo.signType,
                paySign: options.signInfo.paySign
            },
            function(res){
                var status = '';
                //res.err_msg == "get_brand_wcpay_request:ok" 支付成功
                //res.err_msg == "get_brand_wcpay_request:cancel" 支付过程中用户取消
                //res.err_msg == "get_brand_wcpay_request:fail" 支付失败
                //res.errMsg == "getBrandWCPayRequest:fail,没有此SDK或暂不支持此SDK模拟"

                //支付状态统计
                if(res.err_msg === "get_brand_wcpay_request:fail" || res.errMsg === "getBrandWCPayRequest:fail,没有此SDK或暂不支持此SDK模拟"){
                    status = 'fail';
                    if(options.outTradeNo)
                        analyticsCollect({
                            url: '/chicken/pay/update_payment_fail',
                            data: {
                                out_trade_no: options.outTradeNo,
                                ext_info: {
                                    'err_msg': res.err_msg || res.errMsg
                                }
                            }
                        });
                }else if(res.err_msg === "get_brand_wcpay_request:cancel" ){
                    status = 'cancel';
                    if(options.outTradeNo)
                        analyticsCollect({
                            url: '/chicken/pay/update_payment_cancel',
                            data: {
                                out_trade_no: options.outTradeNo,
                                ext_info: {
                                    'err_msg': res.err_msg
                                }
                            }
                        });
                }else if(res.err_msg === "get_brand_wcpay_request:ok"){
                    status = 'success';
                }
                options.callback && options.callback(status);
            }
        );
    }

    //统计信息
    function analyticsCollect(options) {
        if(options.url){
            $.ajax({
                url: options.url,
                type: options.type || 'post',
                data: options.data || '',
                dataType: 'json',
                success: function (data) {
                    console.log(['统计成功',data]);
                },
                error: function (e) {
                    console.log(['统计失败',e]);
                }
            })
        }
    }

    //调起支付
    let _paymentOptions = null;

    //弹框支付
    let publicDialogCheckPayTpl = '<div class="dialog-pay-check">'+
        '<div class="pay-check-box">'+
        '<div class="book-info">'+
        '<div class="info">'+
        '<div class="title-text"></div>'+
        '<div class="price">' +
        '<span class="text"></span>'+
        '</div>'+
        '</div>'+
        '<div class="book-img">'+
        '<img>'+
        '</div>'+
        '</div>'+
        '<div class="handle-btn">'+
        '<div class="btn sure-btn"><span class="btn-text">确定支付</span></div>'+
        '<div class="btn pass-btn">成为会员，免费畅听￥0.00</div>'+
        '<div class="btn cancel-btn">取&nbsp;消</div>'+
        '</div>'+
        '</div>'+
        '</div>';

    //弹框支付
    function dialogCheckPay() {
        _paymentOptions = $.extend({
            autoHide: true,
            autoPass: !!_isShowPass,
            cancelBtn: false
        },_paymentOptions,true);
        if($('.dialog-pay-check').length === 0){
            $('#scale-wrapper').append(publicDialogCheckPayTpl);
            $('.dialog-pay-check .sure-btn').click(function (e) {
                if(!$(this).hasClass('loading')) {
                    _paymentOptions.beforePayment && _paymentOptions.beforePayment();
                    directPay(_paymentOptions.paymentInfo);
                    _paymentOptions.autoHide && $('.dialog-pay-check').removeClass('show');
                }
            });
            $('.dialog-pay-check .cancel-btn').click(function (e) {
                _paymentOptions.cancelPayment && _paymentOptions.cancelPayment();
                $('.dialog-pay-check').removeClass('show');
            });
            $('.dialog-pay-check .pass-btn').click(function (e) {
                _paymentOptions.passBtnClick && _paymentOptions.passBtnClick();
                Thefair.addEventGa('dialog_pay','click','become_vip_trigger_of_'+location.pathname);
                pageJump('/chicken/page/pass_center');
                $('.dialog-pay-check').removeClass('show');
            });
            $('.dialog-pay-check').click(function (e) {
                if($(e.target).hasClass('dialog-pay-check')){
                    _paymentOptions.cancelPayment && _paymentOptions.cancelPayment();
                    $(this).removeClass('show');
                }
            });
        }

        _paymentOptions.item_info && _paymentOptions.item_info.item_name && $('.dialog-pay-check .title-text').text('确定购买'+_paymentOptions.item_info.item_name+'？');
        _paymentOptions.item_info && _paymentOptions.item_info.cover_img && $('.dialog-pay-check .book-img img').attr('src',_paymentOptions.item_info.cover_img);
        _paymentOptions.item_info && _paymentOptions.item_info.price && $('.dialog-pay-check .price .text').text(_paymentOptions.item_info.price);
        _paymentOptions.passBtnText && $('.dialog-pay-check .pass-btn').text(_paymentOptions.passBtnText);

        if(!_paymentOptions.autoPass){
            $('.dialog-pay-check .pass-btn').hide();
        }else{
            $('.dialog-pay-check .pass-btn').show();
        }
        if(!_paymentOptions.cancelBtn){
            $('.dialog-pay-check .cancel-btn').hide();
        }else{
            $('.dialog-pay-check .cancel-btn').show();
        }


        $('.dialog-pay-check').addClass('show');

    }
    //支付请求
    function directPay(options) {
        $.ajax({
            url: options.url || '/chicken/pay/direct_pay',
            type: 'post',
            data: options.params,
            dataType: 'json',
            success: function (data) {
                if(parseInt(data.code) === 0) {
                    var signInfo = data.result.sign;
                    if(data.result.need_pay) {
                        chooseWXPay({
                            signInfo: signInfo,
                            callback: function (status) {
                                switch(status){
                                    //支付成功
                                    case 'success':
                                        showToast('success', '支付成功');
                                        options.success && options.success(status);
                                        break;
                                    //支付失败
                                    case 'fail':
                                        showToast('fail', '支付失败');
                                        options.fail && options.fail(status);
                                        break;
                                    //支付取消
                                    case 'cancel':
                                        showToast('fail', '支付取消');
                                        options.fail && options.fail(status);
                                        break;
                                }
                            },
                            outTradeNo:data.result.out_trade_no
                        });
                    }else{
                        options.success && options.success('not_need_pay');
                    }
                }else{
                    options.fail && options.fail(data);
                    options.errRemind && _common.commonHackAlert(data.message.text);
                }
                options.finish && options.finish(data);
                $('.dialog-pay-check .sure-btn').removeClass('loading');
            },
            error: function (e) {
                options.errRemind && _common.commonHandleAjaxError(e);
                options.finish && options.finish(e);
                $('.dialog-pay-check .sure-btn').removeClass('loading');
            }
        })
    }


    function callPayment(options) {
    _paymentOptions = $.extend({
        displayCheckDialog: true
    },options);
    $.ajax({
        url: '/chicken/pay/order_confirmation',
        type: 'post',
        data: options.paymentInfo.params,
        dataType: 'json',
        success: function (data) {
            if(parseInt(data.code) === 0) {
                let result = data.result;
                if(result.need_pay) {
                    if(_paymentOptions.displayCheckDialog){
                        _paymentOptions.item_info = {
                            item_name:  result.confirmation.item_list[0].item_name,
                            cover_img: result.confirmation.item_list[0].cover_img.url,
                            price: '￥'+(result.confirmation.pay_amount ? result.confirmation.pay_amount : result.confirmation.total_amount)
                        };
                        dialogCheckPay();
                    }else{
                        directPay(_paymentOptions.paymentInfo)
                    }
                }else{
                    directPay(options.paymentInfo)
                }
            }
        },
        error: function (e) {
            _common.commonHandleAjaxError(e);
        }
    });
}

export default {
    callPayment
};

