import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import DetailCapsule from './subPage/detailCapsule'
import {getDetailData} from '../../fetch/Capsule'
import './style.less'

class Detail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            loading: false,
            tpl_name: 'Capsule',
            data: ''
        }
    }
    componentDidMount(){
        const result = getDetailData(this.props.params.item_id);
        let data = window.sessionStorage.getItem('capsule_detail_data_'+this.props.params.item_id);
        if(data){
            this.setState({
                data: data
            });
        }else{
            this.setState({
                loading: true
            });
        }

        result.then(res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                loading: false,
                data: Object.assign(this.state.data,data.result)
            });
            window.sessionStorage.setItem('capsule_detail_data_'+this.props.params.item_id,this.state.data);
        })
    }

    render() {
        return (
            <div className="page-detail">
                {
                    this.state.loading?
                        <div className="loading">加载中...</div>
                        :<DetailCapsule data={this.state.data} item_id={this.props.item_id} />
                }

            </div>
        )
    }
}

export default Detail;