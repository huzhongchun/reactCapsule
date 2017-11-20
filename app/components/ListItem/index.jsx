import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
import ListItemHandleBtn from '../ListItemHandleBtn'

import './style.less'

class ListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        const data = this.props.data;
        let tpl = '';
        switch (data.item_type){
            case 'audio_item':
                tpl = <div className="book-item needsclick item-type-audio_item" data-price={data.item_type}
                     data-item_type={data.item_type} data-item_id={data.item_id} data-sku={data.sku_list[0].sku_no}>
                    <div className="date-box">
                        <span className="date">{data.start_time.text}</span>
                    </div>
                    <div className="book-info">
                        <a className="book-img" href={data.url}>
                            <img className="lazy-img" src={data.cover_img.url}/>
                        </a>
                        <div className="book-intro">
                            <a className="book-name" href={data.url}>{data.item_name}</a>
                            <a className="book-desc" href={data.url}>{data.desc}</a>
                            <div className="duration">
                                <span className="duration-text">时长:{data.attachComment.duration.text}</span>
                                <ListItemHandleBtn data={data} />
                            </div>
                        </div>
                    </div>
                </div>;
                break;
            case 'article_item':
                break;
        }
        return tpl;
    }
}

export default ListItem