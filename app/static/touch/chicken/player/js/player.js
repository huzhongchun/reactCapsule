/**
 * Created by huzhongchun on 2017/7/21.
 */

(function(window,undefined) {
    let ua = navigator.userAgent.toLowerCase();
    let isIos = /(iphone|ipad|ipod)/g.test(ua);
    let source = document.querySelector('.hidden-source-value').value;
    let passStatus = document.querySelector('.hidden-pass_status-value').value;
    source = source ? source : '';
    let playerObj = function (options) {
        this.isIos = false;  //暂时关闭videoJs对m3u8的支持，模拟器无法播放，默认使用原生支持
        this.options= Object.assign({},{
            container: $('#player-container'),
            audioSet: {
                autoplay: false,
            },
            autoLoop: false, //循环播放
            autoSwitch: true, //播放完成之后自动切换最后一首歌曲
            continuePlay: false, //页面跳转续播
            startPlayWidthLastProgress: true, //是否按照音频上次记录位置播放
            maxPlaybackRate: 1.75,
            playbackRateGap: 0.25,
            autoShow: false, //是否默认展示
            displayViewType: 'normal', //初始化展示的类型：normal（完整播放界面），mini（迷你播放界面）
            miniViewBottom: 0,
            //播放列表, 初始化一个可播放的src用于hack自动播放的问题
            sourcesList:[
                {
                    item_id: 0,
                    item_name: '',
                    cover_img: {
                        url: ''
                    },
                    attachment: {
                        duration: {
                            value: '',
                            text: ''
                        },
                        last_progress: 0,
                        progress_rate: 0,
                        resource_type:"mp3",
                        url: 'http://video-thefair-bj.oss-cn-beijing.aliyuncs.com/activity/chicken/can_not_delete_2/can_not_delete_2.mp3',
                    },
                    detail_data:{
                        analyser_info: null,
                        analyser_content: '',
                        reader_info: null,
                        reader_content: ''
                    },
                    favorite_info: {
                        note_id:  0,
                        favorite:  0,  //点赞数
                        be_favorite: false
                    }
                }
            ],
            currentSourceIndex: 0,
            submitProgressInterval: 5, // 更新进度的频率
            pauseCallback: null,
            playCallback: null,
            timeUpdateCallback: null,
            endedCallback: null,
            btnBack15ClickCallback: null,
            btnForward15ClickCallback: null,
            miniCloseCallback: null,
            playerViewTypeChangeCallback: null,
            switchCurSourceCallback: null
        },options);
        this.submitProgressInterval = this.options.submitProgressInterval || 5;
        this.init();
    };
    playerObj.prototype = {
        displayViewType: '',
        constructor: playerObj,
        sendItemLastProgressLoop: null,
        init: function () {
            let _this = this, opt = this.options;
            if(!$(_this.container).hasClass('has-inited')) {

                _this.container = _this.options.container;
                //替换默认的设置，以sourcesList播放列表为准
                _this.currentSource = _this.options.sourcesList[this.options.currentSourceIndex];
                _this.currentSourceIndex = _this.options.currentSourceIndex;
                // _this.displayLastPlayPostion();
                _this.renderSourceList(_this.options.sourcesList);


                _this.audioPlayer = $(_this.container).find('.player-audio')[0];
                _this.audioPlayer.src = _this.currentSource.attachment.url;
                _this.audioPlayer.autoplay = opt.audioSet.autoplay;

                //自动播放
                if (_this.audioPlayer && opt.audioSet.autoplay && _this.currentSource) {
                    _this.play();
                    _this.sendItemLastProgressLoop = setInterval(function () {
                        _this.sendItemLastProgress();
                    }, _this.submitProgressInterval * 1000);
                }

                //直接设置currentTime会：Failed to set the 'currentTime' property on 'HTMLMediaElement': The element's readyState is HAVE_NOTHING.
                //That error is thrown any time you try to set the currentTime before the browser knows the duration of the video.
                //_this.updateCurrentSourceRelateInfo();
                _this._updatePreNextBtnStatus();
                _this.addEventListener();
                _this.addPlayerCallback();
                _this.updateBookInfo();
                // _this.updataNoteInfo();
                $(_this.container).addClass('has-inited');
                if(opt.autoShow){
                    _this.showPlayerView(opt.displayViewType);
                }

                //微信置顶提示,只在ios里展示
                if(_this.platform() === 'android'){
                    $('.player-container').addClass('player-platform-android');
                }

                //客户端隐藏请好友读按钮
                if(Thefair.platform() !== 'browser'){
                    $('.bottom-handle-share').hide();
                }

                //页面跳转续播
                if(opt.continuePlay){
                    _this.continuePlay();
                }
            }
        },
        platform :function (){
            let ua = window.navigator.userAgent.toLowerCase(), platform = '';
            if(ua.match(/(android)/g)){
                platform = 'android';
            }else if(ua.match(/(iphone|ipad|ipod)/g)){
                platform = 'ios';
            }

            return platform;
        },
        //获取或者设置当前播放的时间
        currentTime: function (time) {
            let _this = this, opt = this.options;
            if (!isNaN(parseFloat(time))) {
                _this.audioPlayer.currentTime = parseFloat(time);
            } else {
                return _this.audioPlayer.currentTime;
            }
        },
        //获取总时长
        duration: function () {
            let _this = this, opt = this.options;
            return _this.audioPlayer.duration;
        },
        //获取或设置当前播放的src
        src: function (source) {
            let _this = this, opt = this.options;
            if (source) {
                _this.audioPlayer.src = source.attachment.url;
            } else {
                return _this.audioPlayer.src;
            }
        },
        play: function () {
            let _this = this, opt = this.options, audioPlayer = _this.audioPlayer;
            clearTimeout(_this.autoPlayTriggerFirstLoop);

            audioPlayer.play();

            $(_this.container).find('.btn-play').addClass('pause');
            $(_this.container).find('.mini-play-btn').addClass('pause');

            clearInterval(_this.sendItemLastProgressLoop);
            _this.sendItemLastProgressLoop = setInterval(function () {
                _this.sendItemLastProgress();
            },_this.submitProgressInterval* 1000);

            opt.playCallback && opt.playCallback.call(_this);

            //存储当前播放音乐的信息
            if(_this.currentSource.item_id){
                _this.storagePlayingItemInfo('play');
            }
        },
        pause: function () {
            let _this = this, opt = this.options, audioPlayer = _this.audioPlayer;

            audioPlayer.pause();
            $(_this.container).find('.btn-play').removeClass('pause');
            $(_this.container).find('.mini-play-btn').removeClass('pause');
            clearInterval(_this.sendItemLastProgressLoop);

            //存储当前播放音乐的信息
            if(_this.currentSource.item_id){
                _this.storagePlayingItemInfo('pause');
            }
        },
        //更新当前播放资源变化后的相关数据信息
        updateCurrentSourceRelateInfo: function () {
            let _this = this, opt = this.options;
            _this.currentTime(_this.currentSource.attachment.last_progress || 0);
        },
        //书籍信息
        updateBookInfo: function () {
            let _this = this, source = this.currentSource;
            source && source.item_name && $(_this.container).find('.player-view-normal .book-name').html(source.item_name);
            source && source.item_name && $(_this.container).find('.mini-info-box .book-name').html(source.item_name);
            source && source.cover_img && $(_this.container).find('.player-view-normal .book-img img').attr('src', source.cover_img.url);
            source && source.detail_data.analyser_info && $(_this.container).find('.player-view-normal .book-handler').html(source.detail_data.analyser_info.nick+'解读');
            //文稿
            source && source.detail_data.analyser_content && $(_this.container).find('.doc-view-content').html(source.detail_data.analyser_content);

        },
        //笔记信息
        // updataNoteInfo: function () {
        //     let _this = this, noteInfo = _this.currentSource && _this.currentSource.note_info;
        //     //点赞数
        //     if(noteInfo) {
        //         let favorite = noteInfo.favorite || 0;
        //         $(_this.container).find('.bottom-handle-favorite .item-text').html(favorite);
        //         if(noteInfo.be_favorite)
        //             $(_this.container).find('.bottom-handle-favorite').addClass('active');
        //     }
        // },
        //更换当前播放的资源
        updateCurrentPlaySource : function (index,play) {
            let _this = this ,opt = this.options, source = null;
            let setIndex = isNaN(parseInt(index)) ? this.currentSourceIndex : parseInt(index);
            if(opt.sourcesList[setIndex]){
                this.currentSourceIndex = setIndex;
                source = opt.sourcesList[setIndex];
                _this.currentSource = source;
                _this.updateCurrentSourceRelateInfo();
                // _this.displayLastPlayPostion();
                if(source instanceof Object) {
                    _this.src(source);
                    if(play)
                        _this.play();
                }
                _this._updatePreNextBtnStatus();
                _this.updateBookInfo();
                // _this.updataNoteInfo();
                _this.updateSourceListItemStatus();
            }
        },
        //更新播放列表
        updateSourcesList: function (sourcesList,play,playIndex) {
            let _this = this, opt = this.options;
            if(sourcesList && (sourcesList instanceof Array)) {
                opt.sourcesList = sourcesList;
                _this.renderSourceList(sourcesList);
            }
            _this.updateCurrentPlaySource(playIndex,play);
            _this.updateSourceListItemStatus();

        },
        //渲染播放列表
        renderSourceList: function (sourcesList) {
            let _this = this, opt = this.options;
            if(sourcesList && (sourcesList instanceof Array)) {
                opt.sourcesList = sourcesList;
                $(_this.container).find('.list-wrapper').html('');
                for(let i=0;i<sourcesList.length;i++){
                    let tpl = '<li class="source-item" data-item_id="'+sourcesList[i].item_id+'">'+
                        '<div class="book-img">'+
                        '<img src="'+sourcesList[i].cover_img.url+'">'+
                        '</div>'+
                        '<div class="book-info">'+
                        '<span class="book-title">'+sourcesList[i].item_name+'</span>'+
                        '<span class="duration-text">'+(sourcesList[i].attachment?sourcesList[i].attachment.duration.text: '')+'</span>'+
                        '</div>'+
                        '</li>';
                    $(_this.container).find('.list-wrapper').append(tpl);
                }
                if(sourcesList.length >1){
                    $(_this.container).find('.bottom-handle-list').show();
                }else{
                    $(_this.container).find('.bottom-handle-list').hide();
                }
            }
            _this.updateSourceListItemStatus();
        },
        //更新渲染列表里的播放状态
        updateSourceListItemStatus: function () {
            let _this = this, opt = this.options;
            let curItemId = _this.currentSource.item_id;
            $(_this.container).find('.list-wrapper .source-item.active').removeClass('active');
            $(_this.container).find('.list-wrapper .source-item[data-item_id="'+curItemId+'"]').addClass('active');
        },
        //更新上下首按钮状态
        _updatePreNextBtnStatus: function(){
            let _this = this, opt = this.options;
            if(opt.sourcesList.length <= 1){
                $(_this.container).find('.btn-prev-item').addClass('not');
                $(_this.container).find('.btn-next-item').addClass('not');
            }else {
                if (this.currentSourceIndex == 0) {
                    $(_this.container).find('.btn-prev-item').addClass('not');
                    $(_this.container).find('.btn-next-item').removeClass('not');
                } else if (this.currentSourceIndex == opt.sourcesList.length - 1) {
                    $(_this.container).find('.btn-prev-item').removeClass('not');
                    $(_this.container).find('.btn-next-item').addClass('not');
                }
                else {
                    $(_this.container).find('.btn-prev-item').removeClass('not');
                    $(_this.container).find('.btn-next-item').removeClass('not');
                }
            }
        },
        playBtnClickHandle: function () {
            let _this = this,audioPlayer = _this.audioPlayer;
            if (audioPlayer.paused) {
                _this.play();
            } else {
                _this.pause();
            }
        },
        addEventListener: function () {
            let _this = this, opt = this.options,audioPlayer = _this.audioPlayer;
            //播放，暂停
            $(_this.container).find(".btn-play").click(function () {
                if (!$(this).hasClass('loading')) {
                    _this.playBtnClickHandle();
                }
            });

            //播放速率
            $(_this.container).find(".bottom-handle-rate").on('click',function () {
                let rate = $(this).data().rate || 1.0;
                rate += opt.playbackRateGap;
                if(rate > opt.maxPlaybackRate){
                    rate = 0.75;
                }
                $(_this.container).find('.rate-numb').html((rate === 1 ? (rate + '.0') : rate)+'<small>x</small>');
                $(this).data({rate: rate});

                 //audioPlayer
                audioPlayer.playbackRate = rate;
                audioPlayer.defaultPlaybackRate = rate;
            });

            //快进15s
            $(_this.container).find(".btn-forward-15").on('click',function () {
                let curTime = _this.currentTime();
                _this.currentTime(curTime+15);
                _this.play();
                _this.sendItemLastProgress();
            });

            //后进15s
            $(_this.container).find(".btn-back-15").on('click',function () {
                let curTime = _this.currentTime();
                _this.currentTime(curTime - 15);
                _this.play();
                _this.sendItemLastProgress();
            });

            //点击改变播放位置
            $(_this.container).find('.play-process').on('click',function (e) {
                _this.updatePlayProgress(this,e);
                _this.sendItemLastProgress();
            });

            //滑动改变播放位置
            $(_this.container).find('.play-process').on('touchstart',function (e) {
                if($(e.target).hasClass('play-pointer')){
                    $(e.target).addClass('touching');
                }
            });
            $(_this.container).find('.play-process').on('touchmove',function (e) {
                $(this).find('.play-pointer').addClass('touching');
                _this.updatePlayProgress(this,e);
            });
            $(_this.container).find('.play-process').on('touchend touchcancel',function (e) {
                $(this).find('.play-pointer').removeClass('touching');
                _this.sendItemLastProgress();
            });

            //后台播放按钮，提示使用微信的置顶功能
            $(_this.container).find('.bottom-handle-mini').on('click',function(){
                if($.getCookie('player_handle_mini_btn_clicked')){
                    _this.setTopTips();
                }else{
                    _this.setWechatTopDialogTips();
                }
                $(this).addClass('clicked');
                $.setCookie('player_handle_mini_btn_clicked',1,30,'/');
            });

            //播放列表
            $(_this.container).find('.bottom-handle-list').on('click',function(){
                _this.showSourceListView();
            });

            //分享给好友提示
            $(_this.container).find('.bottom-handle-share').on('click',function(){
                if($.getCookie('player_handle_share_btn_clicked')){
                    _this.setTopTips();
                }else{
                    _this.setShareTipsDialogTips();
                }
                $(this).addClass('clicked');
                $.setCookie('player_handle_share_btn_clicked',1,30,'/');
                _this.setShareTips();
            });

            //收起按钮
            $(_this.container).find('.top-handle-mini').on('click',function() {
                _this.showPlayerView('mini');
            });

            //点击mini播放器展示完整播放界面
            $(_this.container).find('.player-view-mini').on('click',function(e){
                if(!($(e.target).hasClass('mini-play-btn') || $(e.target).hasClass('close-btn'))){
                    _this.showPlayerView('normal');
                }
            });

            //mini播放界面上的关闭按钮，停止播放
            $(_this.container).find('.player-view-mini .close-btn').on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                _this.hidePlayerView();
                opt.miniCloseCallback && opt.miniCloseCallback.call(_this);

                //存储当然播放音乐的信息
                if(_this.currentSource.item_id){
                    _this.storagePlayingItemInfo('close');
                }
            });

            //mini界面的播放按钮
            $(_this.container).find('.mini-play-btn').on('click',function () {
                if (!$(this).hasClass('loading')) {
                    _this.playBtnClickHandle();
                }
            });

            //下一首
            $(_this.container).find('.btn-next-item').on('click',function () {
                let listLength = opt.sourcesList  && opt.sourcesList.length || 0;
                let curIndex = _this.currentSourceIndex;
                if(listLength >= 2 && curIndex < listLength - 1 && !$(this).hasClass('not')){
                    _this.currentSourceIndex++;
                    // _this.updateCurrentPlaySource(_this.currentSourceIndex,true);
                    _this.switchCurSource(opt.sourcesList[_this.currentSourceIndex].item_id);
                }
            });

            //上一首
            $(_this.container).find('.btn-prev-item').on('click',function () {
                let listLength = opt.sourcesList  && opt.sourcesList.length || 0;
                let curIndex = _this.currentSourceIndex;
                if(listLength >= 2 && curIndex > 0 && !$(this).hasClass('not')){
                    _this.currentSourceIndex--;
                    // _this.updateCurrentPlaySource(_this.currentSourceIndex,true);
                    _this.switchCurSource(opt.sourcesList[_this.currentSourceIndex].item_id);
                }
            });

            //展示文档
            $(_this.container).find('.bottom-handle-doc').on('click',function(){
                let h = $(_this.container).find('.doc-view').height() - 30;
                $(_this.container).find('.doc-view-content').height(h);
                $(_this.container).find('.doc-view').addClass('show');
            });

            //隐藏文档
            $(_this.container).find('.doc-view .close-btn').on('click',function(){
                $(_this.container).find('.doc-view').removeClass('show');
            });

            //文档图片预览
            $(_this.container).find('.doc-view').on('click','img',function () {
                let src = $(this).attr('src');
                wx && wx.previewImage({
                    current: src,
                    urls: [src]
                })
            });

            //关闭播放列表
            $(_this.container).find('.source-list-area').on('click',function (e) {
                if($(e.target).hasClass('source-list-area')){
                    _this.hideSourceListView();
                }
            });

            //播放列表歌曲点击
            $(_this.container).find('.list-wrapper').on('click','.source-item',function (e) {
                if(!$(this).hasClass('active')){
                    $(_this.container).find('.list-wrapper .source-item.loading').removeClass('loading');
                    $(this).addClass('loading');
                    let itemId = $(this).attr('data-item_id');
                    _this.switchCurSource(itemId);
                }

            });

            //置顶弹窗
            $(_this.container).find('.set-wechat-top-dialog').on('click',function (e) {
                if($(e.target).hasClass('set-wechat-top-dialog') || $(e.target).hasClass('close-btn')){
                    $(_this.container).find('.set-wechat-top-dialog').hide();
                }
            })

            //分享弹窗
            $(_this.container).find('.set-share-tips-dialog').on('click',function (e) {
                if($(e.target).hasClass('set-share-tips-dialog') || $(e.target).hasClass('close-btn')){
                    $(_this.container).find('.set-share-tips-dialog').hide();
                }
            })
        },
        addPlayerCallback: function(){
            let _this = this, opt = this.options , audioPlayer = _this.audioPlayer;

            //播放时间更新回调
            $(audioPlayer).on('timeupdate', function (e) {
                let currentTime = _this.currentTime();
                let duration = _this.currentSource.duration;
                let percent = _this.percentify(currentTime, duration);
                $(_this.container).find('.current-time').html(_this.timeFormat(currentTime).m + ':' + _this.timeFormat(currentTime).s);
                _this.setPlayProgress(percent);
                opt.timeUpdateCallback && opt.timeUpdateCallback.call(_this,currentTime);
            });

            //获取总时长
            $(audioPlayer).on('durationchange', function (e) {

            });

            //资源下载进度事件
            $(audioPlayer).on('progress', function (e) {
                // console.log(e);
                //
                // let percent = _this.percentify(bufferedEnd,duration);
                //
                // $(_this.container).find('.loaded-line').css({
                //     width: percent+'%'
                // });
            });

            //正在播放，但是内容正在下载，展示loading
            $(audioPlayer).on('waiting', function (e) {
                $(_this.container).find('.btn-play').addClass('loading');
                $(_this.container).find('.mini-play-btn').addClass('loading');
            });

            //play
            $(audioPlayer).on('play', function (e) {
                // _this.currentTime(_this.currentSource.current_time);
            });


            //当媒介能够无需因缓冲而停止即可播放至结尾时运行的脚本。
            $(audioPlayer).on('canplaythrough', function (e) {
                $(_this.container).find('.btn-play').removeClass('loading');
                $(_this.container).find('.mini-play-btn').removeClass('loading');
            });

            //当元数据（比如分辨率和时长）被加载时
            $(audioPlayer).on('loadedmetadata', function (e) {
                let playerDuration = isNaN(audioPlayer.duration) ? 0 : audioPlayer.duration;
                let duration = _this.timeFormat(Math.round(playerDuration));
                _this.currentSource.duration = playerDuration;
                $(_this.container).find('.duration').html(duration.m + ':' + duration.s);
                //真机上需要延迟，否则无效
                setTimeout(function () {
                    let lastProgress = _this.currentSource.attachment.last_progress;
                    if(!opt.startPlayWidthLastProgress){
                        lastProgress = 0;
                    }
                    _this.currentTime(lastProgress);
                }, 50);
            });

            //播放结束
            $(audioPlayer).on('ended', function () {
                $(_this.container).find('.mini-play-btn').removeClass('pause');
                $(_this.container).find('.btn-play').removeClass('pause');
                clearInterval(_this.sendItemLastProgressLoop);
                _this.sendItemLastProgress(_this.currentSource.attachment.duration.value);

                //结束强制设置播放时间为最后duration
                let playerDuration = isNaN(audioPlayer.duration) ? 0 : audioPlayer.duration;
                let duration = _this.timeFormat(Math.round(playerDuration));
                $(_this.container).find('.current-time').html(duration.m + ':' + duration.s);

                opt.endedCallback && opt.endedCallback.call(_this);
                //cookie存储当前播放音乐的信息
                if(_this.currentSource.item_id){
                    $.setCookie('chicken_player_playing_item_info',JSON.stringify({
                        item_id: _this.currentSource.item_id,
                        status: 'pause'
                    }),null,'/')
                }

                if(opt.autoSwitch){
                    let nextIndex = _this.currentSourceIndex + 1;
                    if(nextIndex >= opt.sourcesList.length) {
                        if (opt.autoLoop) {
                            nextIndex = 0;
                            _this.switchCurSource(opt.sourcesList[nextIndex].item_id);
                        }
                    }else{
                        _this.switchCurSource(opt.sourcesList[nextIndex].item_id);
                    }


                }
            });

            //暂停
            $(audioPlayer).on('pause', function (e) {
                opt.pauseCallback && opt.pauseCallback.call(_this, e);
                clearInterval(_this.sendItemLastProgressLoop);
                _this.sendItemLastProgress();
            });

            //加载异常
            $(audioPlayer).on('error', function (e) {
                console.log(['加载失败', e]);
            });
        },
        //展示播放界面
        showPlayerView: function (displayViewType,miniViewBottom) {
            let _this = this, opt = this.options, type = displayViewType || opt.displayViewType;
            miniViewBottom = isNaN(parseInt(miniViewBottom)) ? opt.miniViewBottom : parseInt(miniViewBottom) ;
            if(_this.displayViewType !== type){
                _this.displayViewType = type;
                opt.displayViewType = type;
                opt.playerViewTypeChangeCallback && opt.playerViewTypeChangeCallback.call(_this,type);
            }
            if(type === 'mini'){
                $(_this.container).addClass('type-mini').show().css({
                    bottom: miniViewBottom +'px'
                });
            }else{
                $(_this.container).removeClass('type-mini').show().css({
                    bottom: 0
                });

                //只有第一次展示normal界面的时候默认展示置顶提示
                // if(_this.topTipsNumb === 0) {
                //     _this.topTipsNumb++;
                //     if (_this.platform() === 'ios' && !$(_this.container).find('.bottom-handle-mini').hasClass('clicked')) {
                //         _this.setTopTips();
                //     }
                // }

                //只有第一次展示normal界面的时候默认展示分享提示
                if(_this.shareTipsNumb === 0 && _this.platform() === 'ios') {
                    _this.shareTipsNumb++;
                    _this.setShareTips();
                }

                //安卓非客户端一直展示下载提示
                if (_this.platform() === 'android' && passStatus === 'activated') {
                    _this.setTopTips();
                }
            }
        },
        //后台播放，提示使用微信的置顶功能
        topTipsNumb:0,
        setTopLoop: undefined,
        //置顶提示
        setTopTips:function() {
            let _this = this;
            if(Thefair.platform() === 'browser') {
                if(_this.platform() === 'ios' && !$.getCookie('player_handle_mini_auto_showed')) {
                    $.setCookie('player_handle_mini_auto_showed',1,30,'/');
                    _this.setWechatTopDialogTips();
                }else{
                    $(_this.container).find('.set-wechat-top').show();
                    clearTimeout(_this.setTopLoop);
                    _this.setTopLoop = setTimeout(function () {
                        $(_this.container).find('.set-wechat-top').hide();
                    }, 4000);
                }
            }
        },
        //置顶弹窗提示
        setWechatTopDialogTips:function() {
            let _this = this;
            if(Thefair.platform() === 'browser') {
                $(_this.container).find('.set-wechat-top-dialog').show();
            }
        },
        shareTipsNumb: 0,
        setShareTipsLoop: undefined,
        setShareTips:function() {
            let _this = this;
            if(Thefair.platform() === 'browser') {
                if(_this.platform() === 'ios' && !$.getCookie('player_handle_mini_auto_share_showed')) {
                    $.setCookie('player_handle_mini_auto_share_showed',1,30,'/');
                    _this.setShareTipsDialogTips();
                }else{
                    $(_this.container).find('.set-share-tips').show();
                    clearTimeout(_this.setShareTipsLoop);
                    _this.setShareTipsLoop = setTimeout(function () {
                        $(_this.container).find('.set-share-tips').hide();
                    }, 4000);
                }
            }
        },
        //分享弹窗提示
        setShareTipsDialogTips:function() {
            let _this = this;
            if(Thefair.platform() === 'browser') {
                $(_this.container).find('.set-share-tips-dialog').show();
            }
        },
        //隐藏播放界面
        hidePlayerView: function () {
            let _this = this;
            $(_this.container).removeClass('type-mini').hide();
            _this.pause();
            _this.currentTime(0);
        },
        timeFormat:function(time) {
            let _this = this;
            let h = Math.floor(time / (60 * 60));
            let m = Math.floor((time % (60 *60)) / 60);
            let s = Math.floor((time % (60 *60)) % 60);
            return {
                h: _this.numbFormat(h),
                m: _this.numbFormat(m),
                s: _this.numbFormat(s)
            }
        },
        numbFormat:function(n) {
            if(n < 10){
                return '0'+n
            }else{
                return n;
            }
        },
        percentify: function(time,end) {
            let percent = time / end || 0;
            return  (percent >= 1 ? 1 : percent) * 100;
        },
        //设置进度条位置
        setPlayProgress:function(percent) {
            let _this = this;
            $(_this.container).find('.play-line').css({
                width: percent+'%'
            });
        },
        updatePlayProgress: function (ele,e) {
            let _this = this;
            let pos = _this.getPointerPosition(ele,e);
            let curTime = pos.x * _this.currentSource.duration;
            _this.currentTime(curTime);
            //需要主动出发修改位置，timeupdate事件出发有延迟，需要等到下载当然位置的内容完成
            _this.setPlayProgress(pos.x * 100);
            $(this).find('.play-pointer').addClass('touching');
            $(_this.container).find('.current-time').html(_this.timeFormat(curTime).m+':'+_this.timeFormat(curTime).s);
        },
        //获取元素出发事件的时的偏移位置的百分比
        getPointerPosition:function(el, event) {
            let position = new Object();
            let box = $(el).offset();
            let boxW = el.offsetWidth;
            let boxH = el.offsetHeight;

            let boxY = box.top;
            let boxX = box.left;
            let pageY = event.pageY / Thefair.scale;
            let pageX = event.pageX / Thefair.scale;

            if (event.changedTouches) {
                pageX = event.changedTouches[0].pageX / Thefair.scale;
                pageY = event.changedTouches[0].pageY / Thefair.scale;
            }

            position.y = Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH));
            position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

            return position;
        },
        //发送播放进度
        sendItemLastProgress: function (time) {
            let _this = this;
            let itemId = (_this.currentSource && _this.currentSource.item_id) || 0;
            let curTime = time || _this.currentTime();
            _this.currentSource.attachment.last_progress = curTime;
            if(itemId) {
                $.ajax({
                    url: '/chicken/page/update_item_last_progress',
                    type: 'post',
                    data: {
                        item_id: itemId,
                        progress: curTime,
                        __s: source,
                        __t: (+new Date())
                    },
                    success: function (data) {
                        // console.log(data);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                })
            }else{
                console.log(['miss item_id;currentSource = ',_this.currentSource]);
            }
        },
        autoPlayTriggerFirstLoop: null,
        //自动播放的hack触发一次就够了，否则切换src的时候，会停止播放
        hasAutoPlayTriggerFirst : false,
        //hack异步更新src不能第一次自动播放video的设备，需在用户操作播放的时候，先调用此方法，（初始化时必须有可播放的src）
        //此方法必须由用户的交互直接触发（touch、click），不能放在异步回调中，否则无效果。
        autoPlayTriggerFirst: function() {
            let _this = this,audioPlayer = _this.audioPlayer;
            if(!_this.hasAutoPlayTriggerFirst) {
                _this.hasAutoPlayTriggerFirst = true;
                  //audioPlayer
                audioPlayer.volume = 0;
                _this.play();
                _this.autoPlayTriggerFirstLoop = setTimeout(function () {
                    _this.pause();
                    audioPlayer.volume = 1;
                    $(_this.container).find('.duration').text('00:00');
                }, 50);
            }
        },
        //提示上次播放位置
        displayLastPlayPostion: function () {
            let _this = this, opt = _this.options;
            let lastTime = _this.currentSource.attachment.last_progress;
            if(!isNaN(parseFloat(lastTime)) && lastTime >= 10){
                let lastTimeInfo = _this.timeFormat(lastTime);
                $(_this.container).find('.last-time').html(lastTimeInfo.m +':'+lastTimeInfo.s).addClass('show');
                $(_this.container).find('.last-p').addClass('show');
                setTimeout(function () {
                    $(_this.container).find('.last-p').removeClass('show');
                },2000);
            }
        },
        continuePlay: function () {
            let _this = this, opt = _this.options;
            let lastPlayingItemInfo = JSON.parse(_this.getStoragePlayingItemInfo());
            if(lastPlayingItemInfo && lastPlayingItemInfo.item_id && lastPlayingItemInfo.status === 'play'){
                _this.getAvailableItemInfo(lastPlayingItemInfo);
            }
            document.addEventListener('WeixinJSBridgeReady', function () {
                if(lastPlayingItemInfo && lastPlayingItemInfo.status === 'play'){
                    _this.play();
                }
            });
        },
        //获取音频信息
        getAvailableItemInfo :function(playItemInfo) {
            let _this = this,opt = this.options;
            _this.autoPlayTriggerFirst();
            $.ajax({
                url: '/chicken/item/get_available_item_info',
                type: 'post',
                data: {
                    item_id: playItemInfo.item_id,
                    __s: source
                },
                dataType: 'json',
                success: function (data) {
                    if(parseInt(data.code) === 0) {
                        if(data.result.item_info){
                            let itemInfo = data.result.item_info;
                            let index = $(_this.container).find('.list-wrapper .source-item[data-item_id="'+itemInfo.item_id+'"]').removeClass('loading').index();
                            if(index && opt.sourcesList[index]){
                                opt.sourcesList[index] = itemInfo
                                _this.updateCurrentPlaySource(index,true);
                            }else{
                                //如果不是播放列表里面的歌曲 直接干掉播放列表
                                let _sourcesList = [itemInfo];
                                _this.updateSourcesList(_sourcesList,false);
                            }
                            _this.showPlayerView('mini');
                            if(playItemInfo.status === 'play') {
                                _this.play();
                                document.addEventListener('WeixinJSBridgeReady', function () {
                                    _this.play();
                                });
                            }else if(playItemInfo.status === 'pause'){
                                _this.pause();
                                document.addEventListener('WeixinJSBridgeReady', function () {
                                    _this.pause();
                                });
                            }
                        }
                    }else{
                        console.log(data.message.text);
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        showSourceListView: function () {
            let _this = this, opt = this.options;
            $(_this.container).find('.source-list-area').addClass('show');
        },
        hideSourceListView: function () {
            let _this = this, opt = this.options;
            $(_this.container).find('.source-list-area').removeClass('show');
        },
        loadingSourceInfo: false,
        //歌曲切换
        switchCurSource: function (itemId,cb) {
            let _this = this , opt = this.options;
            _this.loadingSourceInfo = true;
            $(_this.container).find('.play-pause-btn').addClass('loading');
            let index = $(_this.container).find('.list-wrapper .source-item[data-item_id="'+itemId+'"]').index();
            if(index >=0) {
                let params = $.extend({
                    item_id: itemId
                }, opt.sourcesList[index].ext_info);
                $.ajax({
                    url: '/chicken/item/get_available_item_info',
                    type: 'post',
                    data: params,
                    dataType: 'json',
                    success: function (data) {
                        if (parseInt(data.code) === 0) {
                            if (data.result.item_info) {
                                let itemInfo = data.result.item_info;
                                cb && cb.call(_this, data.result);
                                let index = $(_this.container).find('.list-wrapper .source-item[data-item_id="' + itemId + '"]').removeClass('loading').index();
                                opt.sourcesList[index] && (opt.sourcesList[index] = itemInfo);
                                _this.updateCurrentPlaySource(index, true);
                                opt.switchCurSourceCallback && opt.switchCurSourceCallback.call(_this,itemInfo);
                            }
                        } else {
                            alert(data.message.text);
                        }
                        _this.loadingSourceInfo = false;
                        $(_this.container).find('.play-pause-btn').removeClass('loading');
                    },
                    error: function (e) {
                        alert('获取音频信息失败');
                        _this.loadingSourceInfo = false;
                        $(_this.container).find('.play-pause-btn').removeClass('loading');
                    }
                });
            }
        },
        //sessionStorage存储当前播放音频信息
        storagePlayingItemInfo: function (status) {
            let _this = this;
            sessionStorage && sessionStorage.setItem('chicken_player_playing_item_info',JSON.stringify({
                item_id: _this.currentSource.item_id,
                status: status
            }))
        },
        getStoragePlayingItemInfo: function () {
            return sessionStorage && sessionStorage.getItem('chicken_player_playing_item_info')
        }

    };
    if (typeof exports === "object") {
        module.exports = playerObj;
    } else if (typeof define === "function" && define.amd) {
        define([], function () {
            return playerObj;
        })
    } else {
        window.playerObj = playerObj;
    }
})(window);
