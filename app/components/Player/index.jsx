import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import '../../static/touch/chicken/player/css/style.less'
import Player from '../../static/touch/chicken/player/js/player'

class Player extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            player: null
        }
    }


    componentDidMount() {
        let player = new Player({
            autoShow: false,
            displayViewType: 'mini',  //normal 、mini
            miniViewBottom: 49,
            //初始化一个播放的，触发事件的时候先能够播放，先把播放的声音0关闭，然后再把声音恢复1到正常
            // 这样绕开ios用户没有主动触发过播放的，不能autoPlay的限制
            // 或者先给一个声音本身没有任何声音的音频
            // sourcesList: [],  //不能传空数组[]
            currentSourceIndex:0,
            continuePlay: true,
        });
        this.setState({
            player: player
        })

    }


    render() {
        return (
            <div className="player-container" id="player-container">
                <audio className="player-audio" preload />
                <div className="player-view-mini">
                    <div className="mini-play-btn play-pause-btn" />
                    <div className="mini-info-box">
                        <div className="book-name" />
                        <div className="book-time">
                            <span className="current-time">00:00</span> ／ <span className="duration">00:00</span>
                        </div>
                    </div>
                    <i className="close-btn" />
                </div>
                <div className="player-view-normal">
                    <div className="top-handle-box">
                        <span className="top-handle-mini">收起</span>
                    </div>
                    <div className="book-info-box">
                        <div className="bg-box" />
                        <div className="book-img">
                            <img />
                        </div>
                        <div className="book-name" />
                        <div className="book-handler" />
                    </div>
                    <div className="player-controls-box">
                        <div className="block-process">
                            <span className="current-time">00:00</span>
                            <div className="play-process">
                                <div className="play-line-bg">
                        <span className="play-line">
                            <span className="play-pointer">
                                <span className="last-p">上次听到这里：<span className="last-time">00:00</span></span>
                            </span>
                        </span>
                                </div>
                            </div>
                            <span className="duration">00:00</span>
                        </div>
                        <div className="block-btn">
                            <span className="player-handle-btn btn-back-15" />
                            <span className="player-handle-btn btn-prev-item" />
                            <span className="player-handle-btn btn-play play-pause-btn" />
                            <span className="player-handle-btn btn-next-item" />
                            <span className="player-handle-btn btn-forward-15" />
                        </div>
                    </div>
                    <div className="bottom-handle-box">
            <span className="bottom-handle-item bottom-handle-doc">
                <span className="item-text">文稿</span>
            </span>
                        <span className="bottom-handle-item bottom-handle-rate">
                <span className="rate-numb">1.0<small>x</small></span>
                <span className="item-text">加速播放</span>
            </span>
                        <span className="bottom-handle-item bottom-handle-mini">
                <span className="item-text">后台播放</span>
            </span>
                        <span className="bottom-handle-item bottom-handle-list">
                <span className="item-text">播放列表</span>
            </span>
                        <span className="bottom-handle-item bottom-handle-share">
                <span className="item-text">请好友听</span>
            </span>
                    </div>
                </div>
                <div className="doc-view">
                    <div className="close-btn" />
                    <div className="doc-view-content">

                    </div>
                </div>
                <div className="set-wechat-top">
                    <span className="text-ios">在“…”中选择“置顶”该页面，可以后台播放音频</span>
                    <a className="text-android" href="/chicken/activity/app_download" />
                </div>
                <div className="set-share-tips">
                    <span>分享到朋友圈，送给好友免费读<!--（限5个名额）--></span>
                </div>

                <!-- 播放列表 -->
                <div className="source-list-area">
                    <div className="list-box">
                        <div className="list-title">播放列表</div>
                        <ul className="list-wrapper" />
                    </div>
                </div>

                <div className="set-wechat-top-dialog">
                    <div className="dialog-box">
                        <i className="close-btn" />
                    </div>
                </div>

                <div className="set-share-tips-dialog">
                    <div className="dialog-box">
                        <i className="close-btn" />
                    </div>
                </div>
            </div>
        )
    }

}

export default Player