/**
 * Created by huzhongchun on 2017/10/29.
 */

/**
 * @date 2016-02-22
 * @author huzhongchun
 * @name 图片延迟加载
 * @desc 所有在可视区域之上(包括可视区域)的图片都将被加载
 */

(function(window){
    let lazyLoadImg = function(options){
        this.settings = $.extend({
            threshold: 0,
            urlName: 'data-url',
            imgSelector: 'img'
        },options);

        this.init();
    };
    lazyLoadImg.prototype = {
        constructor:lazyLoadImg,
        init: function(){
            this.initEvent();
            //初始化加载一次
            this.lazyLoadPic();
        },
        loadLoop: null,
        initEvent: function() {
            let _this = this,opt = this.settings;
            $(window).on('scroll',function(){
                clearTimeout(_this.loadLoop);
                _this.loadLoop = setTimeout(function(){
                    _this.lazyLoadPic();
                },100);
            });
        },
        lazyLoadPic: function (){
            let opts = this.settings,_offsetTop;
            let _winHeight = $(window).height();
            let winScrollTop = $(window).scrollTop();
            let _winScrollBottom =  winScrollTop + _winHeight+(opts.threshold ? (opts.threshold / Thefair.scale) : 0);
            let list = $(opts.imgSelector+'['+opts.urlName+']');
            for (var i = 0; i < list.length; i++) {
                var $item = $(list[i]);
                //图片顶部
                _offsetTop = $item.offset().top / Thefair.scale ;

                if(_offsetTop  <= _winScrollBottom){
                    if ($item.attr('data-background'))
                        $item.css('background-image', 'url(' + $item.attr('data-url') + ')');
                    else
                        $item.attr('src', $item.attr('data-url'));
                    $item.removeAttr('data-url');
                }else{
                    //如果遇到第一个不在范围内的，则接来下的肯定不在加载范围内，不需要继续计算
                    break;
                }
            }
        },
        refresh: function(){
            this.lazyLoadPic();
        }
    };

    if (typeof exports === "object") {
        module.exports = lazyLoadImg;
    } else if (typeof define === "function" && define.amd) {
        define([], function () {
            return lazyLoadImg
        })
    } else {
        window.lazyLoadImg = lazyLoadImg;
    }

})(window);