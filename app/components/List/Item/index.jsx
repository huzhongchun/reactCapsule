import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
import ListItemBtn from './handleBtn'

import './style.less'

class ListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        const data = this.props.data;
        return (
            <div className="book-item needsclick" data-item_type={data.item_type} data-item_id={data.item_id} data-sku={data.sku_list[0].sku_no}>
                <div className="book-info">
                    <Link to={'/chicken/page/item_detail/'+data.item_id} className="book-img" href={data.url}>
                        {
                            data.storage_status === 'storage'?
                                <img src={data.cover_img.url} />
                                :<img className="lazy-img" data-url={data.cover_img.url} />
                        }
                    </Link>
                    <div className="book-intro">
                        <Link to={'/chicken/page/item_detail/'+data.item_id} className="book-name" href={data.url}>{data.item_name}</Link>
                        <Link to={'/chicken/page/item_detail/'+data.item_id} className="book-desc">{data.desc}</Link>
                        <div className="status-box">
                            <span className="status-item status-finish">已读完</span>
                        </div>
                        <div className="handle-box">
                            <span className="corp-icon" />
                            <ListItemBtn data={data} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItem