import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux'

import {setShareOptions} from '../../../../static/touch/chicken/js/public'
import HandleBtn from './handleBtn'

import './style.less'
class DetailCapsule extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount(){
        if(this.props.data) {
            setShareOptions({
                title: `${this.props.userInfo.nick}邀请你来读${this.props.data.item_name}的浓缩书文字版 | 新世相读书会`,
                desc: this.props.data.desc,
                shareTimelineDesc: `${this.props.userInfo.nick}邀请你来读${this.props.data.item_name}的浓缩书文字版 | 新世相读书会`,
                image: this.props.data.cover_img.url,
                link:  `${location.origin}/chicken/page/item_detail/${this.props.item_id}`
            })
        }
    }
    render() {
        return (
            <div>
                {
                    this.props.data?
                        <div>
                            <div className="book-info-area">
                                <div className="book-img">
                                    <img src={this.props.data.cover_img.url} />
                                </div>
                                <div className="book-intro">
                                    <div className="book-name">{this.props.data.item_name}</div>
                                    <div className="book-author">作者：{this.props.data.ext_info.author}</div>
                                    <div className="book-press">出版社：{this.props.data.ext_info.publishing_house}</div>
                                    <div className="book-corp">
                                        <span>全球最大的在线浓缩知识文库</span>
                                        <span className="corp-icon" />
                                    </div>
                                </div>
                            </div>
                            <div className="recommend-area" dangerouslySetInnerHTML={{__html:this.props.data.detail_data.summary}} />
                            <div className="handle-btn-area">
                                <HandleBtn data={this.props.data}/>
                            </div>
                        </div>
                        : <div>暂无数据</div>
                }

            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        userInfo: state.userInfo
    }
}
function  mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailCapsule)