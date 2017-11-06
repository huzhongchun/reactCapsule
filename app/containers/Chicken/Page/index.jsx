import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'


class Page extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="page">
                {
                    this.props.children
                }
            </div>
        )
    }
    componentDidMount() {

    }
}

export default Page
