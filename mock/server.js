let app = require('koa')();
let router = require('koa-router')();
var cors = require('koa-cors');
// let bodyParser= require('koa-bodyparser');

// app.use(bodyParser());
app.use(cors());
// capsule_detail
let detailData = require('./capsule/detail.js')
router.post('/chicken/page/get_item_detail', function *(next) {
    this.body = detailData
});

//capsuleList
let capsuleListData = require('./capsule/list.js');
//listenList
let listenListData = require('./listen/list.js');
router.post('/chicken/item/get_onsell_item_list', function *(next) {
    // let rBody = this.request.body;
    // console.log(rBody);
    const params = this.params;let listData = '';

    console.log(this.request);
    if(params.item_type === 'audio_item'){
        //listenList
        listData = Object.assign({},listenListData);
    }else {
        //capsuleList
        listData = Object.assign({}, listenListData);
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
