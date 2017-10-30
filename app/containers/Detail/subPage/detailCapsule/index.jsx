import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import HandleBtn from './handleBtn'

import './style.less'
class DetailCapsule extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
                                        <span className="corp-icon"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="recommend-area" dangerouslySetInnerHTML={{__html:this.props.data.detail_data.summary}}></div>
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

export default DetailCapsule;