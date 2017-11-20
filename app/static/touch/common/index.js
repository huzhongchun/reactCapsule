/**
 * Created by huzhongchun on 2016/9/27.
 */

import wxJsbridge from '../../widget/wxJsbridge'



    let _platform = Thefair.platform();


    /**
     * 手机号格式检查
     * @param mobile
     * @returns {boolean}
     */
    function checkMobileFormat(mobile) {
        let mobileRegExp = new RegExp(/^1[3|4|5|7|8]\d{9}$/);
        return mobileRegExp.test(mobile);
    }

    /**
     * 统一封装ajax的error返回
     * @param e
     * @param loginMode (登录模式)
     * @param isNeedAlert (是否需要alert提示,Boolean值)
     */
    function handleAjaxError(e,loginMode,isNeedAlert){
        var isNeedAlert = isUndefined(isNeedAlert) ? true : isNeedAlert;
        try {
            var errorJson = JSON.parse(e.responseText);
            var loginMode = loginMode ? loginMode : 'weixin';
            if(errorJson.code == 40000){
                requireLogin({
                    successCallback: function () {
                        hackAlert("登录成功");
                    },
                    errorCallback: function () {
                        hackAlert("登录失败");
                    },
                    loginMode: loginMode
                });
            }
            isNeedAlert ? hackAlert(errorJson.message.text) : '';
        } catch (er) {
            if(e && e.responseText)
                isNeedAlert ? hackAlert(e.responseText) : '';
            else{
                isNeedAlert ? hackAlert('网络超时,请重试!') : '';
                console.log(e);
            }

        }
    }

    /**
     * 检测是否undefined
     * @param v
     * @returns {boolean}
     */
    function isUndefined(v) {
        return typeof (v) === 'undefined';
    }

    /**
     * 判断是不是json对象
     * @param obj
     * @returns {boolean}
     */
    function isObject(obj){
        return obj && typeof(obj) === "object" && !(obj instanceof Array)
    }

    /**
     * 兼容性的alert
     * 处理在某些app的webView中的alert之后弹窗无法关闭,导致app假死
     * 主要是: 微信,微博
     * @param value
     */
    function hackAlert(value){
        setTimeout(function () {
            alert(value);
        },5)
    }

    /**
     * 单个图片上传
     * @param file
     * @param options
     * @returns {boolean}
     */
    function upLoadImage(file,options){
        let opt = $.extend({
            path:'activity',
            size: 8,//单位M
            uploadUrl: "/v1/upload/image",
            successCallback: null,  //回调函数
            errorCallback: null,
            beforeUploadCallback: null,
            needReadImageExif: true,
            needCompressCorrectImage: false
        },options);
        if(file && file.size > opt.size * 1024 * 1024){
            hackAlert('请上传小于'+opt.size+'M的图片文件');
            return false;
        }
        if(!file.type.match(/png|jpg|jpeg|gif/)){
            hackAlert('请上传png,jpg,jpeg,gif格式图片文件');
            return false;
        }
        opt.beforeUploadCallback && opt.beforeUploadCallback.call(this,opt);
        if(opt.needCompressCorrectImage) {

        }else {
            var reader = new FileReader();
            reader.onload = function (evt) {
                var resultString = evt.target.result;
                if (!resultString) {
                    hackAlert('图片读取失败，请重试~');
                    return false;
                }
                $.ajax({
                    type: "POST",
                    url: opt.uploadUrl,
                    data: {image: resultString, path: opt.path},
                    dataType: "json",
                    success: function (data) {
                        if (data.code != 0) {
                            hackAlert(data.message.text);
                        }
                        opt.successCallback && opt.successCallback.call(this, data, resultString);
                    },
                    error: function (e) {
                        handleAjaxError(e);
                        opt.errorCallback && opt.errorCallback.call(this, e);
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    }


    /**
     * 字符串裁剪,最后增加'...',  按照字符长度计算
     *
     * @param str
     * @param setLength
     * @returns {*}
     *
     *  /[^\x00-\xff]/g  匹配全角的中文   一个中文按照2个字符计算,英文一个字母算1个字符
     */
    function subStrByChar(str,setLength) {
        let lengths = str.replace(/[^\x00-\xff]/g, "**").length, i, charNum = 2, cutStr;
        if(lengths>setLength){
            for(i = 0; i<str.length; ){
                let strChar = str.charAt(i);
                let charLength = strChar.replace(/[^\x00-\xff]/g, "**").length;
                charNum += charLength;
                if(charNum<=setLength){
                    i++;
                }else{
                    cutStr = str.slice(0, i);
                    cutStr = cutStr+'...';
                    break
                }
            }
            return cutStr;
        }else{
            return str;
        }
    }


    /**
     * 字符串裁剪,最后增加'...' ,  按照字符串的长度计算
     * @param str
     * @param setLength
     * @param setting
     * @returns {*}
     *
     * 中文,英文字母,均按照一个长度 1 计算
     */
    function subStr(str,setLength,setting) {
        var originStr = str,
            resultStr = str,
            spaceAndNewlineCount = 0,
            maxLength = parseInt(setLength);
        /** 是否只计算纯字符, 替换掉 空格,换行符 **/
        if(varTypeStr(setting) == 'object' && setting.pureStr){
            spaceAndNewlineCount = originStr.match(/[\s|\n]/g) ? originStr.match(/[\s|\n]/g).length : 0;
        }
        maxLength  += spaceAndNewlineCount;
        var lengths = originStr.length, charNum = 0, cutStr = '';
        if(lengths > maxLength){
            for(var i = 0; i< originStr.length; i++){
                charNum++ ;
                if(charNum > maxLength){
                    cutStr = originStr.slice(0, i);
                    cutStr = cutStr+'...';
                    break
                }
            }

            resultStr = cutStr;
        }

        if( varTypeStr(setting) == 'object' && setting.replaceNewline){
            resultStr = resultStr.replace(/\n/g,'<br />');
        }

        return resultStr;
    }


    /**
     * 微信 关闭当前网页窗口
     */
    function closeWechatWebview(){
        wx.closeWindow();
    }

    /**
     * 微信 隐藏右上角菜单接口
     */
    function hideWechatOptionMenu(){
        wx.ready(function(){
            wx.hideOptionMenu();
        });
    }

    /**
     * 微信 显示右上角菜单接口
     */
    function showWechatOptionMenu(){
        wx.ready(function(){
            wx.showOptionMenu();
        });
    }




    /**
     * 获取APP客户端的X_THEFAIR_UA请求头数据
     * 成功之后 客户端会把数据赋给全局的window._X_THEFAIR_UA_APP变量下.
     */
    function getXThefairUaApp() {
        if(_platform != 'browser'){
            var callback = function (ua) {
                window._X_THEFAIR_UA_APP = ua;
            };
            window.location.href = 'taooweb://getXThefairUa?callback='+encodeURIComponent(callback);
        }
    }

    /**
     * 默认获取H5服务器给出的X_THEFAIR_UA;
     * @private
     */
    var _XThefairUa = $('.hidden-x_thefair_ua-value').val();
    _XThefairUa = _XThefairUa ? _XThefairUa : '';

    //hack在安卓客户端二条页面无法传入x_thefair_ua的问题，默认在安卓客户端上不传入x_thefair_ua
    if(_platform === 'appAndroid'){
        _XThefairUa = '';
        getXThefairUaApp();
        setTimeout(function () {
            _XThefairUa = window._X_THEFAIR_UA_APP;
        },100);
    }

    /**
     * 重写$.ajax
     *
     * ajax带上X_THEFAIR_UA请求头参数
     * url增加_ajax_stamp_字段带上时间戳防止,客户端app或者微信里对ajax请求的缓存
     * @param options
     */
    var mockConfig = {
        'h5.st.thefair.net.cn': true,
        'h5.lo.thefair.net.cn': true
    };
    var host = location.host, requestMockApi = false;
    if(mockConfig[host] && $.getQueryString(location.href,'__mock_') === 'mm'){  //是否开启mock数据
        requestMockApi = true;
    }
    var zeptoAjax = $.ajax;
    $.ajax = function (options) {
        var xThefairUa = _XThefairUa;
        var url = options.url;
        if(url.match(/\?/)){
            url += '&_ajax_stamp_='+(new Date()).getTime();
        }else{
            url += '?_ajax_stamp_='+(new Date()).getTime();
        }

        if(requestMockApi && !url.match(/^http/)){
            url = 'http://local.mock.api:3000/api'+url;
        }
        var opt = {
            url: url,
            type: 'post',
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {

                }else if(data.code == 40000){
                    requireLogin({
                        successCallback: function () {
                            hackAlert("登录成功");
                        },
                        errorCallback: function () {
                            hackAlert("登录失败");
                        },
                        loginMode: options.loginMode ? options.loginMode : 'weixin'
                    });
                }
                else {
                    hackAlert(data.message.text);
                }
            },
            error: function (e) {
                handleAjaxError(e);
            }
        };

        if(xThefairUa){
            var headers ={
                "X_THEFAIR_UA": xThefairUa,
            };
            opt['headers'] = headers;
        }
        if(options.type){
            opt['type'] = options.type;
        }
        if(options.dataType){
            opt['dataType'] = options.dataType;
        }
        if(options.data){
            opt['data'] = options.data;
        }
        if(options.success && typeof  options.success == 'function'){
            opt['success'] = function (data) {
                if(data.code == 40000){
                    requireLogin({
                        successCallback: function () {
                            hackAlert("登录成功");
                        },
                        errorCallback: function () {
                            hackAlert("登录失败");
                        },
                        loginMode: options.loginMode ? options.loginMode : 'weixin'
                    });
                }else{
                    options.success(data);
                }
            }
        }
        if(options.error && typeof  options.error == 'function'){
            opt['error'] = options.error;
        }

        zeptoAjax(opt);
    };




    /**
     * 变量基本类型判断
     * @param arg
     * @returns {string}
     */
    function varTypeStr(arg) {
        var typeofResult = typeof arg, result = '';
        switch(typeofResult){
            case 'undefined':
                result = 'undefined';
                break;
            case 'string':
                result = 'string';
                break;
            case 'number':
                if(isNaN(arg)){
                    result = 'NaN';
                }else{
                    result = 'number';
                }
                break;
            case 'object':
                if(arg === null){
                    result = 'null';
                }else if(arg instanceof Array){
                    result = 'array';
                }else{
                    result = 'object';
                }
                break;
            case 'boolean':
                result = 'boolean';
                break;
        }
        return result;
    }

    /**
     * 是否为空判断, 模拟PHP的empty方法
     * @param arg
     * @returns {boolean}
     */
    function empty(arg) {
        var typeStr = varTypeStr(arg), result = false;
        switch (typeStr){
            case 'string':
                if(arg === ''){
                    result = true;
                }
                break;
            case 'number':
                if(arg === 0){
                    result = true;
                }
                break;
            case 'NaN':
                result = true;
                break;
            case 'null':
                result = true;
                break;
            case 'undefined':
                result = true;
                break;
            case 'array':
                if(arg.length === 0){
                    result = true;
                }
                break;
            case 'object':
                var length = 0;
                for(var key in arg){
                    ++length;
                }
                if(length === 0){
                    result = true;
                }
                break;
            case 'boolean':
                if(arg === false)
                    result = true;
                break;
        }
        return result;
    }


    /**
     * 初始化获取验证码
     */
    function initGetVerifyCode(cookieName,requestUrl,verifyType,extParams,successCallback,errorCallback){
        var reuestUrl = requestUrl ? requestUrl : '/v1/sms/get_verify_code';
        var cookieName = cookieName ? cookieName : 'verifyCode';
        /**
         * 获取验证码
         */
        var cookieVerify = $.getCookie(cookieName), _verifyCode = 0;
        if(cookieVerify && parseInt(cookieVerify) > 0){
            $('.get-verify-code').addClass('active');
            _verifyCode = cookieVerify;
            _loop = setInterval(function(){
                _verifyCode--;
                if (_verifyCode > 0) {
                    var exprireTime = _verifyCode / 60 / 60 / 24;
                    $('.get-verify-code').text('验证码(' + _verifyCode + ')');
                    $.setCookie(cookieName, _verifyCode, exprireTime, '/');
                }
                else {
                    clearInterval(_loop);
                    $('.get-verify-code').removeClass('active');
                    $('.get-verify-code').text('获取验证码');
                }
                console.log(_verifyCode);
            },1000)
        }
        $('.get-verify-code').on('click',function(){
            if(!$(this).hasClass('active')) {
                var mobile = $('input[name="mobile"]').val().trim();
                if (!checkMobileFormat(mobile)) {
                    hackAlert("请输入正确的11位手机号");
                    return false;
                }
                $(this).addClass('active');
                _verifyCode = cookieVerify > 0 ? cookieVerify : 60;
                _loop = setInterval(function () {
                    _verifyCode--;
                    if (_verifyCode > 0) {
                        var exprireTime = _verifyCode / 60 / 60 / 24;
                        $('.get-verify-code').text('验证码(' + _verifyCode + ')');
                        $.setCookie(cookieName, _verifyCode, exprireTime, '/');
                    }
                    else {
                        clearInterval(_loop);
                        $('.get-verify-code').removeClass('active');
                        $('.get-verify-code').text('获取验证码');
                    }
                    console.log(_verifyCode);
                }, 1000);


                var sendVerifyCodeParams = $.extend( {
                    mobile: mobile
                },extParams);
                if(verifyType){
                    sendVerifyCodeParams['verify_type'] = verifyType;
                }
                $.ajax({
                    url: reuestUrl,
                    type: 'post',
                    data: sendVerifyCodeParams,
                    success: function (data) {
                        if (data.code == 0) {

                        } else {
                            clearInterval(_loop);
                            $('.get-verify-code').removeClass('active');
                            $('.get-verify-code').text('获取验证码');
                            hackAlert(data.message.text);
                        }

                        successCallback && successCallback.call(this,data);
                    },
                    error: function (e) {
                        clearInterval(_loop);
                        $('.get-verify-code').removeClass('active');
                        $('.get-verify-code').text('获取验证码');
                        handleAjaxError(e);

                        errorCallback && errorCallback.call(this,data);
                    }
                })
            }
        });
    }


    /**
     * 微信图片预览
     * @param currentImgUrl
     * @param imgUrls
     */
    function wechatImgDisplay(currentImgUrl,imgUrls) {
        if(wx && currentImgUrl && varTypeStr(imgUrls) == 'array') {
            wx.previewImage({
                current: currentImgUrl, // 当前显示图片的http链接
                urls: imgUrls // 需要预览的图片http链接列表
            });
        }
    }

    /**
     * 是否是在微信环境
     * @returns {boolean}
     */
    function isWechat(){
        var userAgent = navigator.userAgent.toLowerCase().match(/micromessenger/);
        return userAgent ? true: false;
    }


    /**
     * 设置微信的分享内容,为空则为默认内容
     * @param options
     * @returns {wxShareObject}
     */
    function setWxShareContent(options){
        let shareSetting = Object.assign({},{
            title: '新世相',
            desc: '我们终将改变潮流的方向',
            shareTimelineDesc: options.shareTimelineDesc ? options.shareTimelineDesc : options.desc,
            image: 'http://resource.bj.taooo.cc/_assets/thefair/library/images/share_icon_2.png',
            link: location.href,
            shareAppMessageSuccessCallback: null,
            shareAppMessageCancelCallback: null,
            shareTimelineSuccessCallback: null,
            shareTimelineCancelCallback: null
        },options);
        return new wxJsbridge({
            //分享给朋友
            shareAppMessageTitle: shareSetting.title,
            shareAppMessageDesc: shareSetting.desc,
            shareAppMessageLink: shareSetting.link,
            shareAppMessageImgUrl: shareSetting.image,
            shareAppMessageType: shareSetting.type,
            shareAppMessageDataUrl: shareSetting.dataUrl,
            shareAppMessageSuccessCallback: shareSetting.shareAppMessageSuccessCallback,
            shareAppMessageCancelCallback: shareSetting.shareAppMessageCancelCallback,
            // 分享到朋友圈
            shareTimelineTitle: shareSetting.shareTimelineDesc ? shareSetting.shareTimelineDesc : shareSetting.desc,
            shareTimelineLink: shareSetting.link,
            shareTimelineImgUrl: shareSetting.image,
            shareTimelineSuccessCallback: shareSetting.shareTimelineSuccessCallback,
            shareTimelineCancelCallback: shareSetting.shareTimelineCancelCallback
        });
    }


module.exports = {
    isWechat:isWechat(),
    checkMobileFormat,
    handleAjaxError,
    upLoadImage,
    hackAlert,
    subStr,
    subStrByChar,
    closeWechatWebview,
    hideWechatOptionMenu,
    showWechatOptionMenu,
    isObject,
    getXThefairUaApp,
    varTypeStr,
    empty,
    initGetVerifyCode,
    wechatImgDisplay,
    setWxShareContent
}