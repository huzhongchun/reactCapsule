/**
 * Created by huzhongchun on 2016/9/27.
 */

    var _platform = Thefair.platform();

    /**
     * 所有预约活动的验证封装
     * @param mobile
     * @param code
     * @param reservationId  (预约项目Id)
     * @param contentObj
     * @param successCallback
     * @param failCallback
     */
    function reserveSubmit(mobile,code,reservationId,contentObj,successCallback,failCallback){
        if(!mobile || !checkMobileFormat(mobile) || !code || !reservationId){
            return false;
        }
        $.ajax({
            url:'/v1/user/add_reservation',
            type:'post',
            data: {
                mobile: mobile,
                code:code,
                reservation_id: reservationId,
                content: contentObj ? '' : JSON.stringify(contentObj)
            },
            dataType: 'json',
            success: function(data){
                if(successCallback)
                    successCallback(data);
            },
            error: function(e){
                handleAjaxError(e);
                if(failCallback)
                    failCallback(e);
            }
        })
    }


    /**
     * 手机号格式检查
     * @param mobile
     * @returns {boolean}
     */
    function checkMobileFormat(mobile) {
        var mobileRegExp = new RegExp(/^1[3|4|5|7|8]\d{9}$/);
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
        return typeof (v) === 'undefined' ? true : false;
    }

    /**
     * 判断是不是json对象
     * @param obj
     * @returns {boolean}
     */
    function isObject(obj){
        return obj && typeof(obj) == "object" && !(obj instanceof Array)
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
        var opt = $.extend({
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
        var lengths = str.replace(/[^\x00-\xff]/g, "**").length, i, charNum = 2, cutStr;
        if(lengths>setLength){
            for(i = 0; i<str.length; ){
                var strChar = str.charAt(i);
                var charLength = strChar.replace(/[^\x00-\xff]/g, "**").length;
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
     * body 纵向滚动条 动画滚动
     * @param length
     * @param duration
     */
    function bodyScrollYSmooth(length,duration){
        if(length >= 0){
            var transformLength =  $('body').scrollTop() -length;
            $('body').css({
                "-webkit-transition": "transform "+duration+"s ease 0s",
                "-moz-transition": "transform "+duration+"s ease 0s",
                "-ms-transition": "transform "+duration+"s ease 0s",
                "-o-transition": "transform "+duration+"s ease 0s",
                "transition": "transform "+duration+"s ease 0s",
                "-webkit-transform": "translate3d(0,"+transformLength+"px,0)",
                "-moz-transform": "translate3d(0,"+transformLength+"px,0)",
                "-ms-transform": "translate3d(0,"+transformLength+"px,0)",
                "-o-transform": "translate3d(0,"+transformLength+"px,0)",
                "transform": "translate3d(0,"+transformLength+"px,0)"
            });
            setTimeout(function(){
                $('body').css({
                    "-webkit-transition": "transform 0s ease 0s",
                    "-moz-transition": "transform 0s ease 0s",
                    "-ms-transition": "transform 0s ease 0s",
                    "-o-transition": "transform 0s ease 0s",
                    "transition": "transform 0s ease 0s",
                    "-webkit-transform": "translate3d(0,0,0)",
                    "-moz-transform": "translate3d(0,0,0)",
                    "-ms-transform": "translate3d(0,0,0)",
                    "-o-transform": "translate3d(0,0,0)",
                    "transform": "translate3d(0,0,0)"
                });
                $('body').scrollTop(length);
            },duration*1000);
        }
    }


    /**
     * 调起登录
     * @param options
     */
    function requireLogin(options){
        var loginMode = (options && options.loginMode) ? options.loginMode : 'weixin';
        if(loginMode == 'h5'){
            //@Todo  h5的登录
        }else if(loginMode == 'weixin' || loginMode == 'mobile') {
            if (_platform != 'browser') {
                var callback = function (flag) {
                    if (flag == 'success') {
                        if (_platform == 'appAndroid') {
                            var curDomain = location.hostname.match(/(\..+)/)[0];
                            var tk = $.getCookie('tk'),
                                account = $.getCookie('account'),
                                platform = $.getCookie('platform'),
                                expires = $.getCookie('expires') ? $.getCookie('expires') : 30,
                                domain = $.getCookie('domain') ? $.getCookie('domain') : curDomain;
                            tk && $.setCookie('tk', tk, expires, '/', domain);
                            account && $.setCookie('account', account, expires, '/', domain);
                            platform && $.setCookie('platform', platform, expires, '/', domain);
                            alert(document.cookie);
                        }
                        (options && options.successCallback) && options.successCallback.call(this);
                    }
                    else {
                        (options && options.errorCallback) && options.errorCallback.call(this);
                    }
                    window.location.href = 'taooweb://refreshWebView?url=' + encodeURIComponent(location.href);
                };

                window.location.href = 'taooweb://login?login_mode=' + loginMode + '&cancel=false&callback=' + encodeURIComponent(callback);
            }
        }else{
            console.log('需要登录');
        }
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
     * 图片的本地压缩和纠正
     * 在ios上竖着排的照片在h5上传的时候会显示成横向的
     * @param options
     *
     * maxFileSize 允许的最大的文件大小
     * beforeReaderStartCallback reader读取file信息前的回调函数
     * needCompressImage 是否需要压缩图片
     * needReadImageExif 是否需要读取图片的exif信息
     * getCorrectedImageBase64DataCallback 成功获取纠正压缩后的图片的base64数据后的回调函数
     *
     *
     */
    // function imageLocalCompressCorrect(options) {
    //     var orientation = 1,
    //         file = options.file,
    //         maxFileSize = options.maxFileSize ? options.maxFileSize : 15,
    //         beforeReaderStartCallback = options.beforeReaderStartCallback ? options.beforeReaderStartCallback : null,
    //         readerLoadedCallback = options.readerLoadedCallback ? options.readerLoadedCallback : null,
    //         needCompressImage = options.needCompressImage == undefined ? true : options.needCompressImage,
    //         needReadImageExif = options.needReadImageExif == undefined ? true : options.needReadImageExif,
    //         getCorrectedImageBase64DataCallback = options.getCorrectedImageBase64DataCallback ? options.getCorrectedImageBase64DataCallback : null;
    //
    //     if(file){
    //         if (file.size > maxFileSize * 1000 * 1000) {
    //             hackAlert('请上传小于'+maxFileSize+'M的图片文件');
    //             return false;
    //         }
    //         if (!file.type.toLowerCase().match(/png|jpg|jpeg/)) {
    //             hackAlert('请上传png,jpg,jpeg格式的图片文件');
    //             return false;
    //         }
    //         var reader = new FileReader();
    //         if(needCompressImage) {
    //             var scale = getImageScaleNumb(file.size);
    //         }else{
    //             var scale = 1;
    //         }
    //         beforeReaderStartCallback && beforeReaderStartCallback.call(this,file);
    //         reader.onload = function (data) {
    //             var readedBase64Data = data.target.result;
    //             if(!readedBase64Data  || readedBase64Data.length < 20){
    //                 hackAlert('图片读取失败,请换一张重试');
    //                 return false;
    //             }
    //             if(needReadImageExif){
    //                 var exif = require('widget/exif');
    //                 var image = new Image();
    //                 image.onload = function () {
    //                     exif.getData(image, function () {
    //                         var exifInfoStr = exif.pretty(this);
    //                         var exifInfo = parseImageExif(exifInfoStr);
    //                         orientation = parseInt(exifInfo.orientation);
    //                         orientation = isNaN(orientation) ? 1 : orientation;
    //                         getCorrectImageBase64Data(readedBase64Data, orientation, scale, function (data) {
    //                             if(data.length < 20){
    //                                 var data = readedBase64Data;
    //                             }
    //                             getCorrectedImageBase64DataCallback && getCorrectedImageBase64DataCallback.call(this,data);
    //                         });
    //                     });
    //                 };
    //                 image.src = readedBase64Data;
    //             }else{
    //                 getCorrectImageBase64Data(readedBase64Data, orientation, scale, function (data) {
    //                     if(data.length < 20){
    //                         var data = readedBase64Data;
    //                     }
    //                     getCorrectedImageBase64DataCallback && getCorrectedImageBase64DataCallback.call(this,data);
    //                 });
    //             }
    //
    //             readerLoadedCallback && readerLoadedCallback.call(this,data);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    //
    // }

    /**
     * 按照图片的大小计算缩放比例
     * @param fileSize  单位: B
     * @returns {number}
     */
    function getImageScaleNumb(fileSize) {
        var scale = 1 , fileSize = fileSize ? fileSize /1000 : fileSize;
        if(fileSize){
            switch(true){
                case (fileSize >0 && fileSize <= 1000 *  1.2):
                    scale = 1;
                    break;
                case (fileSize >1000 * 1.2 && fileSize < 1000 * 2.5):
                    scale = (0.9 - fileSize / (1000 * 6)) * (1 - (fileSize / (1000 * 6)));
                    break;
                case (fileSize >1000 * 2.5 && fileSize < 1000 * 5):
                    scale = (0.9 - fileSize / (1000 * 12)) * (1 - (fileSize / (1000 * 12)));
                    break;
                case (fileSize >= 1000 * 5 && fileSize < 1000 * 10):
                    scale = (0.8 - fileSize / (1000 * 24)) * (1 - (fileSize / (1000 * 24)));
                    break;
                case (fileSize >= 1000 * 10 && fileSize < 1000 * 16):
                    scale = (0.7 - fileSize / (1000 * 27)) * (1 - (fileSize / (1000 * 27)));
                    break;
                default:
                    scale = 0.1;
                    break;
            }
        }

        if(scale < 0){
            scale = 0.1;
        }

        return scale;
    }

    /**
     * 解析图片的exif信息
     * @param exifStr
     * @returns {{}}
     */
    function parseImageExif(exifStr) {
        var exifInfo = {};
        if(exifStr){
            var exifArray = exifStr.toLowerCase().split('\n');
            exifArray.pop();
            for(var i =0;i < exifArray.length;i++){
                var itemSplitArray = exifArray[i].split(':');
                exifInfo[itemSplitArray[0].trim()] = itemSplitArray[1].trim();
            }
        }

        return exifInfo;
    }

    /**
     * 图片压缩+方向矫正
     * @param {string} imgBase64 图片的base64
     * @param {string} orientation exif获取的方向信息
     * @param {number} scale 压缩比(0 - 1)
     * @param {function} callback 回调方法，返回校正方向和压缩后的base64
     */
    function getCorrectImageBase64Data(imgBase64,orientation,scale,callback){
        var image= new Image();
        var scale = scale ? scale : 0.92;
        image.onload = function(){
            var degree=0,drawWidth,drawHeight,width,height;
            drawWidth=this.naturalWidth;
            drawHeight=this.naturalHeight;
            //以下改变一下图片大小
            // var maxSide = Math.max(drawWidth, drawHeight);
            // if (maxSide > 1024) {
            //     var minSide = Math.min(drawWidth, drawHeight);
            //     minSide = minSide / maxSide * 1024;
            //     maxSide = 1024;
            //     if (drawWidth > drawHeight) {
            //         drawWidth = maxSide;
            //         drawHeight = minSide;
            //     } else {
            //         drawWidth = minSide;
            //         drawHeight = maxSide;
            //     }
            // }
            var canvas=document.createElement('canvas');
            canvas.width = width = drawWidth;
            canvas.height = height = drawHeight;
            var context=canvas.getContext('2d');
            //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
            switch(orientation){
                //iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree = 180;
                    drawWidth = -width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 90;
                    drawWidth = width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在上方
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 270;
                    drawWidth = -width;
                    drawHeight = height;
                    break;
            }
            //使用canvas旋转校正
            context.rotate(degree*Math.PI/180);
            context.drawImage(this,0,0,drawWidth,drawHeight);
            //返回校正图片
            callback && callback(canvas.toDataURL("image/jpeg",scale));
        };
        image.src = imgBase64;
    }

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
     * 获取元素触发事件的时偏移位置的百分比
     * @returns {boolean}
     */
    function getEventPositionPercent(el, event) {
        var position = {};
        var box = $(el).offset();
        var boxW = el.offsetWidth;
        var boxH = el.offsetHeight;

        var boxY = box.top;
        var boxX = box.left;
        var pageY = event.pageY / Thefair.scale;
        var pageX = event.pageX / Thefair.scale;

        if (event.changedTouches) {
            pageX = event.changedTouches[0].pageX / Thefair.scale;
            pageY = event.changedTouches[0].pageY / Thefair.scale;
        }

        position.y = Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH));
        position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

        return position;
    }


module.exports = {
    commonIsWechat:isWechat(),
    commonReserveSubmit: reserveSubmit,
    commonCheckMobileFormat:checkMobileFormat,
    commonHandleAjaxError: handleAjaxError,
    commonUpLoadImage: upLoadImage,
    commonHackAlert: hackAlert,
    commonSubStr: subStr,
    commonSubStrByChar: subStrByChar,
    commonBodyScrollYSmooth: bodyScrollYSmooth,
    commonCloseWechatWebview: closeWechatWebview,
    commonHideWechatOptionMenu: hideWechatOptionMenu,
    commonShowWechatOptionMenu:showWechatOptionMenu,
    commonIsObject:isObject,
    commonRequireLogin:requireLogin,
    commonGetXThefairUaApp:getXThefairUaApp,
    commonVarTypeStr: varTypeStr,
    commonEmpty:empty,
    commonInitGetVerifyCode: initGetVerifyCode,
    commonWechatImgDisplay: wechatImgDisplay,
    commonGetEventPositionPercent: getEventPositionPercent
}