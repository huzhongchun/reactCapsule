var app = require('koa')();
var router = require('koa-router')();

// 详情
let detailData = require('./home/detailCapsule.js')
router.post('/chicken/page/get_item_detail', function *(next) {
    this.body = detailData
});

// 首页 —— 推荐列表（猜你喜欢）
let homeListData = require('./home/list.js');
router.post('/chicken/item/get_onsell_item_list', function *(next) {

    let listData = Object.assign({},homeListData); //clone
    // 参数
    const params = this.params;
    const paramsLastItemId = params.last_item_id;
    console.log('last_item_id：' + paramsLastItemId);
    if(paramsLastItemId === '2619182023912111070'){
        listData.result.last_item_id = '2619182023911192098'
    }else if(paramsLastItemId === '2619182023911192098'){
        delete listData.result.last_item_id
    }
    this.body = listData
});

//order_confirm
let confirmData = require('./home/orderConfirm.js');
router.post('/chicken/pay/order_confirmation', function *(next) {
    this.body = confirmData
});

//direct_pay
let payData = require('./home/directPay.js');
router.post('/chicken/pay/direct_pay', function *(next) {
    this.body = payData
});



// 开始服务并生成路由
app.use(router.routes())
   .use(router.allowedMethods());
app.listen(3000);
