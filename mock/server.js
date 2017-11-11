let app = require('koa')();
let router = require('koa-router')();

// capsule_detail
let detailData = require('./capsule/detail.js')
router.post('/chicken/page/get_item_detail', function *(next) {
    this.body = detailData
});

//capsuleList
let capsuleListData = require('./capsule/list.js');
router.post('/chicken/item/get_onsell_item_list', function *(next) {

    let listData = Object.assign({},capsuleListData); //clone
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
let confirmData = require('./pay/orderConfirm.js');
router.post('/chicken/pay/order_confirmation', function *(next) {
    this.body = confirmData
});

//direct_pay
let payData = require('./pay/directPay.js');
router.post('/chicken/pay/direct_pay', function *(next) {
    this.body = payData
});



// 开始服务并生成路由
app.use(router.routes())
   .use(router.allowedMethods());
app.listen(3000);
