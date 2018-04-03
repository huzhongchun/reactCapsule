import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import '../../static/touch/chicken/player/css/style.less'

class Player extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            audio: null,
            playerStatus: {
                displayViewType: 'normal', //初始化展示的类型：normal（完整播放界面），mini（迷你播放界面）
                autoPlay: true,
                loadingSource: false,
                paused: true,
                currentTime: {
                    numb: 0,
                    text: '00:00'
                },
                progress:{
                    percent: 0,  //0-100  播放进度百分比
                },
                duration: {
                    numb: 0,
                    text: '00:00'
                },
                playbackRate: '1.0',
                playbackRateGap: 0.25,
                maxPlaybackRate: 1.75,
                currentSourceIndex: 0
            },
            updateProgressThreshold: 5, //更新进度的阈值，单位：秒
            miniViewSetting: {
                bottom: 0
            },
            sourcesList:[
                {
                    item_id: 0,
                    item_name: '',
                    cover_img: {
                        url: ''
                    },
                    attachment: {
                        duration: {
                            value: '',
                            text: ''
                        },
                        last_progress: 0,
                        progress_rate: 0,
                        resource_type:"mp3",
                        url: 'http://video-thefair-bj.oss-cn-beijing.aliyuncs.com/activity/chicken/can_not_delete_2/can_not_delete_2.mp3',
                    },
                    detail_data:{
                        analyser_info: null,
                        analyser_content: '',
                        reader_info: null,
                        reader_content: ''
                    },
                    favorite_info: {
                        note_id:  0,
                        favorite:  0,  //点赞数
                        be_favorite: false
                    }
                }
            ],
            currentSource:{
                "item_id": "3123814823120088255",
                "item_type": "audio_item",
                "status": "play",
                "item_name": "《东方快车谋杀案》",
                "cover_img": {
                    "url": "http://image.thefair.net.cn/note/cover/20171122/cb79ee9c7766985f64de510ce7555b87.jpg@1pr_750w_1o.jpg",
                    "order": 1,
                    "img_info": {
                        "scale": 0.75,
                        "width": 452,
                        "height": 600
                    }
                },
                "category_id": "6",
                "desc": "侦探小说女王阿加莎·克里斯蒂名作。同名电影热映中。阿加莎自传的译者王霖为你解读：不可能犯罪的魅力，阿加莎与东方快车的情缘。",
                "price": "4.99",
                "original_price": "4.99",
                "promotion_desc": "",
                "sku_list": [
                    {
                        "sku_no": "VA0100100036601",
                        "sku_price": "4.99"
                    }
                ],
                "start_time": {
                    "timestamp": "2017-11-24 00:00:00",
                    "text": "11月24日"
                },
                "count_summary": {
                    "buyer_number": {
                        "count": 5814
                    }
                },
                "promos": [
                    {
                        "rule_id": "6",
                        "rule_label": "award_1_gift_x",
                        "title": "测试",
                        "ext_info": {
                            "gift_type": "item",
                            "gift_id": "3123814823120088255",
                            "gift_total_num": 500,
                            "gift_left_num": 500,
                            "get_gift_user_list": [],
                            "hashid": "C6d_0RmIKQYG"
                        }
                    }
                ],
                "attachment": {
                    "duration": {
                        "value": 1512,
                        "text": "25分12秒"
                    },
                    "last_progress": 0,
                    "progress_rate": 0,
                    "url": "http://pvtcdn.thefair.net.cn/201711291719/88d51da920ebc8d71f369bdd63a84cf5/note/attachment/20171124/1435889a49e3f41467815003b0e3959b/1435889a49e3f41467815003b0e3959b.mp3",
                    "resource_type": "m3u8"
                },
                "favorite_info": {
                    "note_id": 3123814823119792000,
                    "count": 0,
                    "be_favorite": false
                },
                "detail_data": {
                    "reader_info": {
                        "uid": "3123814823117576496",
                        "nick": "欣鑫"
                    },
                    "analyser_info": {
                        "uid": "3123814823119791067",
                        "nick": "王霖"
                    },
                    "analyser_content": "<p style=\"margin-left:0cm; margin-right:0cm\"><strong><span style=\"color:null\">关于作者</span></strong></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">阿加莎&bull;克里斯蒂，无可争议的侦探小说女王，侦探文学史上最伟大的作家之一。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">她的《无人生还》《东方快车谋杀案》《尼罗河上的惨案》《原告证人》等等作品，至今畅销不衰。她笔下经典的人物，大侦探波洛和马普尔小姐，几乎家喻户晓，至今仍然让人们着迷。她的一生一波三折，丰富的人生阅历为她持续不断的创作提供了灵感。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><strong><span style=\"color:null\">关于本书</span></strong></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">侦探小说女王阿加莎&middot;克里斯蒂代表作，&ldquo;不可能犯罪&rdquo;的经典，情与法惊人的冲突与融合。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">在通往神秘东方的、奢华的列车上，美国富商身中十二刀离奇死亡。头等车厢上的每一个乘客，看上去都有嫌疑，但却都有不在场证明，看上去无法犯案。最终，大侦探波洛揭开了案件的层层迷雾。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><strong><span style=\"color:null\">核心内容</span></strong></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p class=\"ck-upload-img-box-1\"><img class=\"ck-upload-img-1\" data-height=\"559\" data-width=\"800\" src=\"http://static.thefair.net.cn/ckEditor/images/20171124/eccd1a40cb06366a39514cbda4baf446.jpg\" style=\"opacity: 1; max-width: 100%;\" /></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm; text-align:center\"><strong><span style=\"color:#999999\">点击图片查看大图，保存到手机，可以分享到朋友圈</span></strong></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"text-align:justify\"><strong><span style=\"color:null\">一、故事梗概和灵感来源</span></strong></p>\n\n<p style=\"text-align:justify\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">东方快车因为暴雪停在了南斯拉夫境内，一位美国富商，被人杀死在包厢里，身上被刺了整整十二刀。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">著名的比利时大侦探波洛，也在这趟列车上，他接受了董事的委托来调查案件，并且，根据命案现场一张烧焦的纸片，查清楚了富商的真实身份：原来，富商其实是臭名昭著的绑匪卡塞蒂。卡塞蒂多年前在美国纽约绑架了一个小女孩，在收到赎金之后，他仍然残忍地杀害了这个小女孩。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">这个案件曾经轰动一时。女孩的一家人结局悲惨，卡塞蒂却逍遥法外。他坐拥大笔的钱财，从此隐姓埋名、远走他乡。波洛进一步调查，还发现一件奇怪的事，加来车厢上的十几个乘客，或多或少都和绑架案的受害者有关系，或多或少都有杀卡塞蒂的动机，但是这十几个人，看上去又都有不在场证明，都不可能犯案。最终，波洛不负众望，揭开了案件的层层迷雾。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">《东方快车谋杀案》的灵感来源之一，就是阿加莎自己乘坐这趟列车的真实经历。正是在东方快车上，阿加莎和考古学家马克斯感情升温。之后，阿加莎克服了上一次婚姻失败的阴影和对爱情生活的恐惧，和马克斯结婚。另一个灵感来源，是一起现实生活中发生的绑架案，林德伯格绑架案。阿加莎像串珠高手一样，把她自己的真实生活和她道听途说的奇闻异事，变成充满奇思妙想的小说作品。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><strong><span style=\"color:null\">二、创作特点</span></strong></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">从侦探小说吸引人的本质来看，它是&ldquo;不可能犯罪&rdquo;这个类型的典范。这个案件发生在密闭空间里，而且是在陆地上移动的密闭空间里。在移动中的、密闭的空间里作案，对罪犯的要求非常高，对侦探的要求也很高。这种&ldquo;不可能犯罪&rdquo;的类型，属于侦探小说中最迷人的一种类型。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">从这部作品的创作特点来看，它充分展现了侦探小说黄金时代的特点。侦探小说的黄金时代，是从1920年开始到1940年结束，欧美是主要阵地。黄金时代的侦探小说，最大的特点就是人物众多、情节曲折。一般来说，小说里的嫌疑犯大概十个人左右，发生的案件大概三到五件。这样处理，就会使小说悬念感极强。因为情节从线状变为了网状，读者的挑战难度增加，解谜难度也增加，这样的作品就会充满魅力。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\"><span style=\"background-color:null\">从小说的人性挖掘和社会意义来看，它体现了情与法的融合。《东方快车谋杀案》创作于1934年。那个年代，正是很多国家的大萧条时期。这个时期，治安混乱，案件频发，侦探小说展现的犯罪、报复、人情和法律等等，可以说是有当时的社会土壤的。从这个角度看，阿加莎的作品，并不只是一种解谜或者一种智力游戏，她还对社会心理有很敏锐的把握。</span></span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"text-align:justify\"><strong><span style=\"color:null\">三、各类改编</span></strong></p>\n\n<p style=\"text-align:justify\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">因为《东方快车谋杀案》发生在列车上，而且因为暴雪列车没法继续行驶，所以，罪犯很难是外边的人，那么头等车厢上的十几个乘客，就都有犯案嫌疑。并且，他们每个人，都有自己鲜明的性格。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">比如家庭教师玛丽&middot;德本汉小姐，举止端庄有礼，身材修长苗条，沉着果敢。再比如，卓戈米洛夫公主，出身高贵，衣着华丽，两手戴满戒指，但相貌丑陋无比。这种鲜明的性格和对比，就为小说的影视化和舞台剧改编带来很多可能。而且，由于每个人物都很精彩，这就使得参加演出的往往是群星云集、豪华阵容，就特别吸引观众。截止到目前，《东方快车谋杀案》的影视剧，已经有很多版本。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm; text-align:justify\">&nbsp;</p>\n\n<p style=\"text-align:justify\"><strong><span style=\"color:null\">四、写作生涯</span></strong></p>\n\n<p style=\"text-align:justify\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">1890年，阿加莎&bull;克里斯蒂在英国出生。在家里文学的熏陶下，她走上了写作道路。一战期间，她在医院成为志愿工作者，学习了近两年后，她从一个病房护士，变成了有资质的药剂师。药物和毒物知识的突飞猛进，让她终于能够构思出一部侦探小说来。她的处女作《斯泰尔斯庄园奇案》，就有很精彩的用毒技巧。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">同时，一战期间，她附近侨居着的那些来自比利时的难民，他们的形象更是给了阿加莎很大的启发。阿加莎的心里形成了一个完全不同于福尔摩斯的侦探形象，这就是大侦探波洛，一个可爱的比利时侦探。波洛在阿加莎的处女作《斯泰尔斯庄园奇案》中就出现了，他也是《东方快车谋杀案》中最重要的角色之一。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">除了《东方快车谋杀案》《尼罗河上的惨案》《阳光下的罪恶》《无人生还》这些屡屡被改编成影视剧的作品之外，她的其他作品也有很高的成就。如剧本《捕鼠器》，真实记录了她中东生活的《情牵叙利亚》等。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><strong><span style=\"color:null\">金句:</span></strong></p>\n\n<p>&nbsp;</p>\n\n<p><span style=\"color:null\">1. 阿加莎的神奇之处就在于，她总能像串珠高手一样，把她自己的真实生活和她道听途说的奇闻异事，变成充满奇思妙想的小说作品。</span></p>\n\n<p>&nbsp;</p>\n\n<p><span style=\"color:null\">2. 阿加莎的作品一般每部二十章左右，前十几章就像一杯白开水，平淡无奇。但是，到了最后几章，谜题逐渐揭开时，开始变得波澜起伏，让人读起来啧啧称奇。</span></p>\n\n<p>&nbsp;</p>\n\n<p><span style=\"color:null\">3. 怎么处理令人同情的凶手和他犯下的罪行呢？在这部小说的结尾，我们看到，两者达到了一个巧妙的、惊人的融合。也就是说，波洛处理凶手的方式，不是惯常意义上的，他是考虑到了人性的层面，去处理这个难题的。</span></p>\n\n<p>&nbsp;</p>\n\n<p><span style=\"color:null\">4. 面对这些成就，阿加莎却说，她并不认为自己是一位作家，她觉得自己就是一个家庭主妇。也许就是因为阿加莎充满了对家人和生活的热爱，才让她的作品，充满着生活趣味和人情冷暖，至今历久弥新。</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\">&nbsp;</p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">撰稿: 王霖</span></p>\n\n<p style=\"margin-left:0cm; margin-right:0cm\"><span style=\"color:null\">转述: 欣鑫</span></p>"
                },
                "ext_info": [],
                "activated_type": "pass",
                "pass_status": "activated",
                "url": "http://h5.st.thefair.net.cn/chicken/page/item_detail?item_id=3123814823120088255&__s=__dddd20171123"
            }
        };
        this.innerVar ={
            hasAutoPlayTriggerHack: false, //是否已经触发过 自动播放的hack处理
            autoPlayTriggerHackLoop: 0,
            sendItemLastProgressLoop: 0

        }
    }


    componentDidMount() {
        let props = this.props;
        this.setState(Object.assign({},{
            audio: document.getElementById('player-audio'),
            // sourcesList: props.sourcesList,
            // currentSource: props.sourcesList[(props.currentSourceIndex || 0)],
            // playerStatus: {
            //     autoPlay: props.autoPlay || false
            // }
        }),()=>{
            this.playerInit();
        });

    }

    playerInit(){

        this.addAudioEventListener();

        if(this.state.playerStatus.autoPlay){
            this.play();
            this.displayView();
        }
    }

    //时长格式化
    static timeFormat(time) {
        let h = Math.floor(time / (60 * 60));
        let m = Math.floor((time % (60 *60)) / 60);
        let s = Math.floor((time % (60 *60)) % 60);
        return {
            h: Player.numbFormat(h),
            m: Player.numbFormat(m),
            s: Player.numbFormat(s)
        }
    }

    //1位补0格式化
    static numbFormat(n) {
        if(n < 10){
            return '0'+n
        }else{
            return n;
        }
    }

    //百分比计算
    static percentile(cur,total) {
        let percent = cur / total || 0;
        return  (percent >= 1 ? 1 : percent) * 100;
    }

    //播放
    play(){
        this.state.audio.play();
        this.setState({
            playerStatus:{
                paused: false
            }
        });
        clearInterval(this.innerVar.sendItemLastProgressLoop);
        this.innerVar.sendItemLastProgressLoop = setInterval( () =>{
            this.sendItemLastProgress();
        },this.state.updateProgressThreshold * 1000);
    }

    //暂停
    pause(){
        this.state.audio.pause();
        this.setState({
            playerStatus:{
                paused: true
            }
        });
        clearInterval(this.innerVar.sendItemLastProgressLoop);
    }

    //展示播放界面
    displayView(type,setting){
        let miniPositionBottom = (setting && setting.bottom) || this.state.miniViewSetting.bottom;
        this.setState({
            playerStatus:{
                displayViewType: type || 'normal',
                miniViewSetting:{
                    bottom: miniPositionBottom
                }
            }
        });

        document.getElementById('player-container').style.display = 'block';
    }

    addAudioEventListener(){
        let audio = this.state.audio;

        //当元数据（比如分辨率和时长）被加载时
        document.addEventListener('loadedmetadata',(e)=>{
            let d = audio.duration();
            let dNumb = isNaN(d) ? 0:d;
            let dText = Player.timeFormat(dNumb);
            this.setState({
                playerStatus: {
                    duration: {
                        numb: dNumb,
                        text: dText
                    }
                }
            })
        });

        //正在播放，但是内容正在下载，展示loading
        document.addEventListener('waiting',(e)=>{
            this.setState({
                playerStatus: {
                    loadingSource: true
                }
            })
        });

        //当媒介能够无需因缓冲而停止即可播放至结尾时运行的脚本。
        document.addEventListener('canplaythrough',(e)=>{
            this.setState({
                playerStatus: {
                    loadingSource: false
                }
            })
        });


        //时间更新
        document.addEventListener('timeupdate',(e)=>{
            let ct = audio.currentTime();
            let ctNumb = isNaN(ct) ? 0: ct;
            let ctText = Player.timeFormat(ctNumb);
            let p = Player.percentile(ctNumb, this.state.playerStatus.duration);
            this.setState({
                playerStatus: {
                    currentTime: {
                        numb: ctNumb,
                        text: ctText
                    },
                    progress:{
                        percent: p,
                    }
                }
            })
        });

        //暂停
        document.addEventListener('pause',(e)=>{
            this.setState({
                playerStatus: {
                    paused: true
                }
            })
        });

        //播放结束
        document.addEventListener('ended',(e)=>{
            this.setState({
                playerStatus: {
                    paused: true
                }
            })
        });

        //异常
        document.addEventListener('error',(e)=>{
            this.setState({
                playerStatus: {
                    error: true
                }
            });

            clearInterval(this.innerVar.sendItemLastProgressLoop);
        });


    }

    //按钮 播放
    handlePlay(){
        if(this.state.playerStatus.paused){
            this.play();
            this.setState({
                playerStatus:{
                    paused: false
                }
            })
        }else{
            this.pause();
            this.setState({
                playerStatus:{
                    paused: true
                }
            })
        }

    }
    //按钮 后退
    handleBack(){
        this.pause();
    }
    //按钮 快进
    handleForward(){

    }
    //按钮 上一首
    handlePrevItem(){

    }
    //按钮 下一首
    handleNextItem(){

    }

    //底部 文档按钮
    bHandleDoc(){

    }
    //底部 播放速率
    bHandlePlayRate(){
        let playbackRate = this.state.playerStatus.playbackRate;
        playbackRate += this.state.playerStatus.playbackRateGap;
        if(playbackRate > this.state.playerStatus.maxPlaybackRate){
            playbackRate = 0.75;
        }

        this.setState({
            playerStatus: {
                playbackRate: playbackRate
            }
        });

        this.state.audio.playbackRate = playbackRate;
        this.state.audio.defaultPlaybackRate = playbackRate;
    }
    //底部 后台播放
    bHandlePlayBackground(){

    }
    //底部 邀请好友
    bHandleInvite(){

    }
    //底部 播放列表
    bHandleSourceList(){

    }


    //发送播放进度
    sendItemLastProgress() {
        let itemId = (this.state.currentSource && this.state.currentSource.item_id) || 0;
        let curTime = this.state.playerStatus.currentTime;
        if(itemId) {
            $.ajax({
                url: '/chicken/page/update_item_last_progress',
                type: 'post',
                data: {
                    item_id: itemId,
                    progress: curTime,
                    __t: (+new Date())
                },
                success: function (data) {
                    // console.log(data);
                },
                error: function (e) {
                    console.log(e);
                }
            })
        }
    }

    //hack异步更新src第一次不能自动播放的问题，需在用户有操作的时候，先调用此方法，（初始化时必须有可播放的src）
    //此方法必须由用户的交互直接触发（touch、click），不能放在异步回调中，否则无效果。
    autoPlayTriggerHack() {
        if(!this.innerVar.hasAutoPlayTriggerHack) {
            this.innerVar.hasAutoPlayTriggerHack = true;
            this.state.audio.volume = 0;
            this.state.audio.play();
            this.innerVar.autoPlayTriggerHackLoop = setTimeout(() =>{
                this.state.audio.pause();
                this.state.audio.volume = 1;
                this.setState({
                    playerStatus:{
                        duration:{
                            numb:0,
                            text: '00:00'
                        }
                    }
                });
                clearTimeout(this.innerVar.autoPlayTriggerHackLoop);
            }, 50);
        }
    }



    render() {
        debugger;
        let playerContainerClassName = 'player-container';
        if(this.state.playerStatus.displayViewType === 'mini'){
            playerContainerClassName = 'player-container type-mini';
        }
        return (
            <div className={playerContainerClassName} id="player-container" style={{bottom: this.state.miniViewSetting.bottom}}>
                <audio className="player-audio" id="player-audio" preload src={this.state.currentSource.attachment.url}/>
                <div className="player-view-mini">
                    <div className="mini-play-btn play-pause-btn" onClick={this.handlePlay.bind(this)}/>
                    <div className="mini-info-box">
                        <div className="item-name">{this.state.currentSource.item_name}</div>
                        <div className="book-time">
                            <span className="current-time">{this.state.playerStatus.currentTime.text}</span> ／ <span className="duration">{this.state.playerStatus.duration.text}</span>
                        </div>
                    </div>
                    <i className="close-btn" />
                </div>
                <div className="player-view-normal">
                    <div className="top-handle-box">
                        <span className="top-handle-mini">收起</span>
                    </div>
                    <div className="book-info-box">
                        <div className="bg-box" />
                        <div className="item-img">
                            <img />
                        </div>
                        <div className="item-name">{this.state.currentSource.item_name}</div>
                        <div className="item-handler">{this.state.currentSource.detail_data.analyser_info.nick}</div>
                    </div>
                    <div className="player-controls-box">
                        <div className="block-process">
                            <span className="current-time">{this.state.playerStatus.currentTime.text}</span>
                            <div className="play-process">
                                <div className="play-line-bg">
                                    <span className="play-line">
                                        <span className="play-pointer" />
                                    </span>
                                </div>
                            </div>
                            <span className="duration">{this.state.playerStatus.duration.text}</span>
                        </div>
                        <div className="block-btn">
                            <span className="player-handle-btn btn-back-15" onClick={this.handleBack.bind(this)} />
                            <span className="player-handle-btn btn-prev-item" onClick={this.handlePrevItem.bind(this)} />
                            <span className="player-handle-btn btn-play play-pause-btn" onClick={this.handlePlay.bind(this)}/>
                            <span className="player-handle-btn btn-next-item" onClick={this.handleNextItem.bind(this)} />
                            <span className="player-handle-btn btn-forward-15" onClick={this.handleForward.bind(this)} />
                        </div>
                    </div>
                    <div className="bottom-handle-box">
                        <span className="bottom-handle-item bottom-handle-doc" onClick={this.bHandleDoc.bind(this)}>
                            <span className="item-text">文稿</span>
                        </span>
                        <span className="bottom-handle-item bottom-handle-rate" onClick={this.bHandlePlayRate.bind(this)}>
                            <span className="rate-numb">{this.state.playerStatus.playbackRate}<small>x</small></span>
                            <span className="item-text">加速播放</span>
                        </span>
                        <span className="bottom-handle-item bottom-handle-mini" onClick={this.bHandlePlayBackground.bind(this)}>
                            <span className="item-text">后台播放</span>
                        </span>
                        <span className="bottom-handle-item bottom-handle-list" onClick={this.bHandleSourceList.bind(this)}>
                            <span className="item-text">播放列表</span>
                        </span>
                        <span className="bottom-handle-item bottom-handle-share" onClick={this.bHandleInvite.bind(this)}>
                            <span className="item-text">请好友听</span>
                        </span>
                    </div>
                </div>
                <div className="doc-view">
                    <div className="close-btn" />
                    <div className="doc-view-content" dangerouslySetInnerHTML={{__html:this.state.currentSource.detail_data.analyser_content}}/>
                </div>
                <div className="set-wechat-top">
                    <span className="text-ios">在“…”中选择“置顶”该页面，可以后台播放音频</span>
                    <a className="text-android" href="/chicken/activity/app_download" />
                </div>
                <div className="set-share-tips">
                    <span>分享到朋友圈，送给好友免费读</span>
                </div>

                <div className="source-list-area">
                    <div className="list-box">
                        <div className="list-title">播放列表</div>
                        <ul className="list-wrapper" />
                    </div>
                </div>

                <div className="set-wechat-top-dialog">
                    <div className="dialog-box">
                        <i className="close-btn" />
                    </div>
                </div>

                <div className="set-share-tips-dialog">
                    <div className="dialog-box">
                        <i className="close-btn" />
                    </div>
                </div>
            </div>
        )
    }

}

export default Player