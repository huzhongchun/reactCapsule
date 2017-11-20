/**
 * Created by huzhongchun on 2017/11/15.
 */

import common from '../../common'
/**
 * 设置分享
 * @param options
 */
function setShareOptions(options){
    let opt = Object.assign({},{
        title: '新世相读书会，一年365本书，为你读书，伴你成长',
        desc: '我们延揽大牛为你暴力拆解好书，提炼不掺水干货，将几十万字内容的精要，压缩在20分钟音频里。听这些就够了。',
        shareTimelineDesc: '新世相读书会，一年365本书，为你读书，伴你成长',
        image: 'http://resource.thefair.net.cn/_assets/touch/chicken/public/images/share_img.jpg',
        link: location.origin+'/chicken/page/index',
        shareAppMessageSuccessCallback: null,
        shareTimelineSuccessCallback: null
    },options);
    common.setWxShareContent(opt);
}

module.exports ={
    common,
    setShareOptions
};