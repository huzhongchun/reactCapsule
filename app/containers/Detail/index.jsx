import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import DetailCapsule from './subPage/detailCapsule'
import {getDetailData} from '../../fetch/Capsule'
class Detail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            loading: false,
            tpl_name: 'Capsule',
            data: null
        }
    }
    componentDidMount(){
        const result = getDetailData(this.props.params.item_id);
        this.setState({
            loading: true
        });
        result.then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            this.setState({
                loading: false,
                data: data.result
            })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.loading?
                        <div>加载中</div>
                        :<DetailCapsule data={this.state.data} item_id={this.props.item_id} />
                }

            </div>
        )
    }
}

export default Detail;