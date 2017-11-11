import { get } from '../get'
import { post } from '../post'

//胶囊书列表
export function getListData(lastItemId) {
    return post('/chicken/item/get_onsell_item_list',{
        item_type: 'article_item',
        last_item_id: lastItemId
    });
}

//胶囊书详情
export function getDetailData(itemId) {
    return post('/chicken/page/get_item_detail',{
        item_id: itemId
    });
}