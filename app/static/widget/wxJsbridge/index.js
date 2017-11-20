/*
 * @file: 微信分享
 * @Date: 2015-12-11
 *
 * config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
 * 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
 * 则可以直接调用，不需要放在ready函数中。
 */

(function(window){
    var wxJsbridge = function(options){
        this.settings = $.extend({
            //分享给朋友
            shareAppMessageTitle: '',
            shareAppMessageDesc: '',
            shareAppMessageLink: '',
            shareAppMessageImgUrl: '',
            shareAppMessageSuccessCallback: null,
            shareAppMessageCancelCallback: null,
            // 分享到朋友圈
            shareTimelineTitle: '',
            shareTimelineLink: '',
            shareTimelineImgUrl: '',
            shareTimelineSuccessCallback: null,
            shareTimelineCancelCallback: null,
            //分享QQ好友
            shareQQTitle: '',
            shareQQDesc: '',
            shareQQLink: '',
            shareQQImgUrl: '',
            shareQQSuccessCallback: null,
            shareQQCancelCallback: null,
            //分享QQ空间
            shareQZoneTitle: '',
            shareQZoneDesc: '',
            shareQZoneLink: '',
            shareQZoneImgUrl: '',
            shareQZoneSuccessCallback: null,
            shareQZoneCancelCallback: null,
            jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice","startRecord","stopRecord","onVoiceRecordEnd","playVoice","pauseVoice","stopVoice","onVoicePlayEnd","uploadVoice","downloadVoice","getNetworkType","hideOptionMenu","showOptionMenu","closeWindow","chooseImage","previewImage","uploadImage","downloadImage","chooseWXPay"]
        },options)
        this.init();
    }

    wxJsbridge.prototype = {
        constructor: 'wxJsbridge',
        init: function(){
            var self = this,opt = this.settings;
            if( typeof wx != 'undefined') {
                wx.ready(function () {
                    self.checkJsApiFunc(opt);
                    self.setShareAppMessageFunc(opt);
                    self.setShareTimeLineFunc(opt);
                    //self.setShareQQFunc(opt);
                    //self.setShareQZoneFunc(opt);
                });
            }
        },
        checkJsApiFunc: function(){
            var self = this,opt = this.settings;
            wx.checkJsApi({
                jsApiList: opt.jsApiList, // 需要检测的JS接口列表
                success: function(res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                }
            })
        },
        //分享好友
        setShareAppMessageFunc: function(opt){
            wx.onMenuShareAppMessage({
                title: opt.shareAppMessageTitle, 			// 分享好友标题
                desc:  opt.shareAppMessageDesc, 				// 分享好友描述
                link:  opt.shareAppMessageLink, 				// 分享好友链接
                imgUrl:opt.shareAppMessageImgUrl, 			// 分享好友图标
                type: opt.shareAppMessageType, // 分享类型,music、video或link，不填默认为link
                dataUrl: opt.shareAppMessageDataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    opt.shareAppMessageSuccessCallback && opt.shareAppMessageSuccessCallback.call(this);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    opt.shareAppMessageCancelCallback && opt.shareAppMessageCancelCallback.call(this);

                }
            })
        },
        //分享朋友圈
        setShareTimeLineFunc: function(opt){
            var self = this;
            wx.onMenuShareTimeline({
                title: opt.shareTimelineTitle, 				// 分享标题
                link: opt.shareTimelineLink, 				// 分享链接
                imgUrl: opt.shareTimelineImgUrl, 			// 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    opt.shareTimelineSuccessCallback && opt.shareTimelineSuccessCallback.call(this);

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    opt.shareTimelineCancelCallback && opt.shareTimelineCancelCallback.call(this);
                }
            })
        },
        //分享到QQ好友
        setShareQQFunc: function(opt){
            wx.onMenuShareQQ({
                title:  opt.shareQQTitle,
                desc:   opt.shareQQDesc,
                link:   opt.shareQQLink,
                imgUrl: opt.shareQQImgUrl,
                success: function () {
                    opt.shareQQSuccessCallback && opt.shareQQSuccessCallback.call(this);
                },
                cancel: function () {
                    opt.shareQQCancelCallback && opt.shareQQCancelCallback.call(this);
                }
            })
        },
        //分享QQ空间
        setShareQZoneFunc: function(opt){
            wx.onMenuShareQZone({
                title:  opt.shareQZoneTitle,
                desc:   opt.shareQZoneDesc,
                link:   opt.shareQZoneLink,
                imgUrl: opt.shareQZoneImgUrl,
                success: function () {
                    opt.shareQZoneSuccessCallback && opt.shareQZoneSuccessCallback.call(this);
                },
                cancel: function () {
                    opt.shareQZoneCancelCallback && opt.shareQZoneCancelCallback.call(this);
                }
            })
        }

    };


    if (typeof exports === "object") {
        module.exports = wxJsbridge;
    } else if (typeof define === "function" && define.amd) {
        define([], function () {
            return wxJsbridge
        })
    } else {
        window.wxJsbridge = wxJsbridge;
    }

})(window);